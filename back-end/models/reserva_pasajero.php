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
                  FROM reserva_pasajeros rp
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
        $query = "DELETE FROM reserva_pasajeros WHERE IdReserva = ? AND IdPasajero = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("ii", $IdReserva, $IdPasajero);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    // Borra todas las relaciones de una reserva
    public function borrarPorReserva($IdReserva){
        $query = "DELETE FROM reserva_pasajeros WHERE IdReserva = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("i", $IdReserva);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

}
