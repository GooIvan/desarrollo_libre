<?php

require_once "../config/conexion.php";

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



}

$reserva = new Reserva();
$reserva->agregarReserva(1,2,300,"12-03-01","L");