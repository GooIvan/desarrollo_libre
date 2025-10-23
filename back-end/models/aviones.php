<?php

require_once __DIR__ . "/../config/conexion.php";

class aviones extends conexion{
    public function agregarAviones($IdAvion, $Capacidad, $Tamaño, $Nombre, $IdAerolinea){
        $query= "INSERT INTO aviones(IdAvion, Capacidad, Tamaño, Nombre, IdAerolinea) VALUES(?,?,?,?,?)";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("iisss", $IdAvion, $Capacidad, $Tamaño, $Nombre, $IdAerolinea);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function mostrarAviones(){
        $query = "SELECT * FROM aviones";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

    public function borrarAviones($IdAvion){
        $query= "DELETE FROM aviones WHERE IdAvion= ?";
        $env = $this->conn->prepare($query);
        if(!$env) return false;
        $env->bind_param("i",$IdAvion);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function actualizarAviones($IdAvion, $Capacidad, $Tamaño, $Nombre, $IdAerolinea){
        $query= "UPDATE aviones SET Capacidad=?,Tamaño=?,Nombre=?,IdAerolinea=? WHERE IdAvion=?";
        $env=$this->conn->prepare($query);
        if(!$env)return false;
        $env->bind_param("isssi", $Capacidad, $Tamaño, $Nombre, $IdAerolinea, $IdAvion);
        $ok=$env->execute();
        $env->close();
        return $ok;
    }
}