<?php

require_once __DIR__ . "/../config/conexion.php";

class ReservaPasajero extends conexion{

    // Agrega una relación reserva-pasajero
    public function agregarRelacion($IdReserva, $IdPasajero, $Asiento = null, $TipoPasajero = null){
        $query = "INSERT INTO reserva_pasajeros (IdReserva, IdPasajero, Asiento, TipoPasajero, FechaCreacion) VALUES (?, ?, ?, ?, NOW())";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        // bind_param requires variables; convert nulls to null variables
        $as = $Asiento;
        $tp = $TipoPasajero;
        $env->bind_param("iiss", $IdReserva, $IdPasajero, $as, $tp);
        $ok = $env->execute();
        $insertId = $this->conn->insert_id;
        $env->close();
        return $ok ? $insertId : false;
    }

    // Muestra relaciones por IdReserva
    public function mostrarPorReserva($IdReserva){
        $query = "SELECT rp.IdRelacion, rp.IdReserva, rp.IdPasajero, p.NombreCompleto, p.Telefono, p.DocumentoIdentidad
                  FROM reservas_pasajeros rp
                  LEFT JOIN pasajeros p ON rp.IdPasajero = p.IdPasajero
                  WHERE rp.IdReserva = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->bind_param("i", $IdReserva);
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

    // Borra una relación por IdReserva y IdPasajero
    public function borrarRelacion($IdReserva, $IdPasajero){
        $query = "DELETE FROM reservas_pasajeros WHERE IdReserva = ? AND IdPasajero = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("ii", $IdReserva, $IdPasajero);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    // Borra todas las relaciones de una reserva
    public function borrarPorReserva($IdReserva){
        $query = "DELETE FROM reservas_pasajeros WHERE IdReserva = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("i", $IdReserva);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function buscarPorReserva($IdReserva){
        $query = "SELECT * FROM reservas_pasajeros WHERE IdReserva = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->bind_param("i", $IdReserva);
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

    public function buscarPorPasajero($IdPasajero){
        $query = "SELECT * FROM reservas_pasajeros WHERE IdPasajero = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->bind_param("i", $IdPasajero);
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

    public function sillaDisponible($IdSilla){
        $query = "SELECT COUNT(*) AS count FROM reservas_pasajeros WHERE IdSilla = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("i", $IdSilla);
        $env->execute();
        $result = $env->get_result();
        $row = $result ? $result->fetch_assoc() : null;
        $env->close();
        return $row && $row['count'] == 0;
    }

    public function actualizar($IdReserva, $IdPasajero){
        $query = "UPDATE reservas_pasajeros SET IdPasajero = ? WHERE IdReserva = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("ii", $IdPasajero, $IdReserva);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    /**
     * Reserva una silla para un pasajero: verifica que la silla pertenece al avión
     * del vuelo y que está disponible; inserta la relación y marca la silla como no disponible.
     */
    public function reservarSillaParaPasajero($IdReserva, $IdPasajero, $IdSilla, $TipoPasajero = null){
        $this->conn->begin_transaction();
        try {
            // obtener IdVuelo desde la reserva
            $stmt = $this->conn->prepare("SELECT IdVuelo FROM reservas WHERE IdReserva = ? FOR UPDATE");
            if (!$stmt) throw new \RuntimeException('Could not prepare select reserva');
            $stmt->bind_param("i", $IdReserva);
            $stmt->execute();
            $res = $stmt->get_result();
            $row = $res->fetch_assoc();
            if (!$row) throw new \RuntimeException('Reserva not found');
            $IdVuelo = $row['IdVuelo'];
            $stmt->close();

            // lock the seat row
            $stmt = $this->conn->prepare("SELECT IdAvion, Disponible FROM sillas WHERE IdSilla = ? FOR UPDATE");
            if (!$stmt) throw new \RuntimeException('Could not prepare select sillas');
            $stmt->bind_param("i", $IdSilla);
            $stmt->execute();
            $res = $stmt->get_result();
            $silla = $res->fetch_assoc();
            if (!$silla) throw new \RuntimeException('Silla not found');
            if ($silla['Disponible'] == 0) throw new \RuntimeException('Silla not available');
            $IdAvion = $silla['IdAvion'];
            $stmt->close();

            // verificar que la silla pertenece al avion asignado al vuelo
            $stmt = $this->conn->prepare("SELECT IdAvion FROM vuelos WHERE IdVuelo = ?");
            if (!$stmt) throw new \RuntimeException('Could not prepare select vuelo');
            $stmt->bind_param("i", $IdVuelo);
            $stmt->execute();
            $res = $stmt->get_result();
            $vuelo = $res->fetch_assoc();
            if (!$vuelo) throw new \RuntimeException('Vuelo not found');
            if ($vuelo['IdAvion'] != $IdAvion) throw new \RuntimeException('Silla does not belong to this flight\'s plane');
            $stmt->close();

            // insertar relacion
            $stmt = $this->conn->prepare("INSERT INTO reserva_pasajeros (IdReserva, IdPasajero, IdSilla, TipoPasajero, FechaCreacion) VALUES (?, ?, ?, ?, NOW())");
            if (!$stmt) throw new \RuntimeException('Could not prepare insert relation');
            $tp = $TipoPasajero;
            $stmt->bind_param("iiis", $IdReserva, $IdPasajero, $IdSilla, $tp);
            $ok = $stmt->execute();
            if (!$ok) throw new \RuntimeException('Could not insert relation');
            $stmt->close();

            // marcar silla como no disponible
            $stmt = $this->conn->prepare("UPDATE sillas SET Disponible = 0 WHERE IdSilla = ?");
            if (!$stmt) throw new \RuntimeException('Could not prepare update silla');
            $stmt->bind_param("i", $IdSilla);
            $ok = $stmt->execute();
            if (!$ok) throw new \RuntimeException('Could not update silla');
            $stmt->close();

            $this->conn->commit();
            return true;
        } catch (\Throwable $e){
            $this->conn->rollback();
            return false;
        }
    }
}
