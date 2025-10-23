<?php

require_once __DIR__ . "/../config/conexion.php";

class Reserva extends conexion{

    public function agregarReserva($IdVuelo, $IdAccount, $PrecioTotal, $FechaReserva, $EstadoPago){
        $query = "INSERT INTO reservas (IdVuelo, IdAccount, PrecioTotal, FechaReserva, EstadoPago) VALUES(?,?,?,?,?)";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("iiiss",$IdVuelo, $IdAccount, $PrecioTotal, $FechaReserva, $EstadoPago);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function mostrarReserva($IdReserva){
        $query="SELECT * FROM reservas WHERE IdReserva= ?";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->bind_param("i",$IdReserva);
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

    public function borrarReserva($IdReserva){
        $query= "DELETE FROM reservas WHERE IdReserva= ?";
        $env = $this->conn->prepare($query);
        if(!$env) return false;
        $env->bind_param("i",$IdReserva);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function actualizarReserva($IdVuelo, $IdAccount,$PrecioTotal, $FechaReserva, $EstadoPago){
        $query= "UPDATE reservas SET IdVuelo=?,IdAccount=?,PrecioTotal = ?, FechaReserva = ?, EstadoPago=?, UltimaModificacion=? ";
        $env=$this->conn->prepare($query);
        if(!$env)return false;
        $env->bind_param("iiiss",$IdVuelo, $IdAccount, $PrecioTotal, $FechaReserva, $EstadoPago);
        $ok=$env->execute();
        $env->close();
        return $ok;
    }

    /**
     * Crear reserva de forma segura: verifica disponibilidad de sillas para el vuelo
     * y si hay espacio inserta la reserva dentro de una transacción.
     * Retorna IdReserva insertado o false en caso de fallo/disponibilidad.
     */
    public function crearReservaSegura($IdVuelo, $IdAccount, $PrecioTotal, $FechaReserva, $EstadoPago){
        // Begin transaction
        $this->conn->begin_transaction();
        try {
            // Lock the vuelo row to avoid races
            $stmt = $this->conn->prepare("SELECT IdAvion FROM vuelos WHERE IdVuelo = ? FOR UPDATE");
            if (!$stmt) throw new \RuntimeException('Could not prepare select vuelo');
            $stmt->bind_param("i", $IdVuelo);
            $stmt->execute();
            $res = $stmt->get_result();
            $row = $res->fetch_assoc();
            if (!$row) {
                $this->conn->rollback();
                return false;
            }
            $IdAvion = $row['IdAvion'];
            $stmt->close();

            // Count available seats in the airplane that are marked Disponible=1
            $stmt = $this->conn->prepare("SELECT COUNT(*) AS total FROM sillas WHERE IdAvion = ? AND Disponible = 1");
            if (!$stmt) throw new \RuntimeException('Could not prepare count sillas');
            $stmt->bind_param("i", $IdAvion);
            $stmt->execute();
            $total = $stmt->get_result()->fetch_assoc()['total'];
            $stmt->close();

            // Count seats already reserved for this flight
            $stmt = $this->conn->prepare("SELECT COUNT(*) AS reserved FROM reserva_pasajeros rp JOIN reservas r ON rp.IdReserva = r.IdReserva WHERE r.IdVuelo = ?");
            if (!$stmt) throw new \RuntimeException('Could not prepare count reserved');
            $stmt->bind_param("i", $IdVuelo);
            $stmt->execute();
            $reserved = $stmt->get_result()->fetch_assoc()['reserved'];
            $stmt->close();

            if (($total - $reserved) <= 0){
                $this->conn->rollback();
                return false; // no seats available
            }

            // Insert the reserva
            $stmt = $this->conn->prepare("INSERT INTO reservas (IdVuelo, IdAccount, PrecioTotal, FechaReserva, EstadoPago) VALUES (?, ?, ?, ?, ?)");
            if (!$stmt) throw new \RuntimeException('Could not prepare insert reserva');
            $stmt->bind_param("iiiss", $IdVuelo, $IdAccount, $PrecioTotal, $FechaReserva, $EstadoPago);
            $ok = $stmt->execute();
            if (!$ok) {
                $this->conn->rollback();
                return false;
            }
            $insertId = $this->conn->insert_id;
            $stmt->close();

            $this->conn->commit();
            return $insertId;
        } catch (\Throwable $e){
            $this->conn->rollback();
            return false;
        }
    }

    

}

