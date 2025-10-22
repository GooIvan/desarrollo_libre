<?php

require_once __DIR__ . "/../config/conexion.php";

class vuelos extends conexion{

    public function agregarVuelos($IdVuelo, $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioVuelta, $Destino, $Origen, $IdAvion, $Estado){
        $query= "INSERT INTO vuelos(IdVuelo, FechaSalida, FechaVuelta, PrecioIda, PrecioVuelta, Destino, Origen, IdAvion, Estado) VALUES(?,?,?,?,?,?,?,?,?)";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("issssssi", $IdVuelo, $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioIda, $Destino, $Origen, $IdAvion, $Estado);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function mostrarVuelos(){
        $query = "SELECT * FROM vuelos";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }
    public function borrarVuelos($IdVuelo){
        $query= "DELETE FROM vuelos WHERE IdVuelo= ?";
        $env = $this->conn->prepare($query);
        if(!$env) return false;
        $env->bind_param("i",$IdVuelo);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function actualizarVuelos($IdVuelo, $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioVuelta, $Destino, $Origen, $IdAvion){
        $query= "UPDATE vuelos SET FechaSalida=?,FechaVuelta=?,PrecioIda=?,PrecioVuelta=?,Destino=?,Origen=?,IdAvion=? WHERE IdVuelo=?";
        $env=$this->conn->prepare($query);
        if(!$env)return false;
        $env->bind_param("ssssssii", $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioVuelta, $Destino, $Origen, $IdAvion, $IdVuelo);
        $ok=$env->execute();
        $env->close();
        return $ok;
    }

    public function mostrarVueloPorId($IdVuelo){
        $query="SELECT * FROM vuelos WHERE IdVuelo= ?";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->bind_param("i",$IdVuelo);
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

    public function buscarVuelos($origen, $destino, $fechaSalida, $fechaVuelta){
        $query="SELECT * FROM vuelos WHERE Origen=? AND Destino=? AND FechaSalida=? AND FechaVuelta=?";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->bind_param("ssss",$origen, $destino, $fechaSalida, $fechaVuelta);
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

    public function buscarVuelosDisponibles(){
        $query="SELECT * FROM vuelos WHERE Estado='true'";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }
}