<?php

require_once __DIR__ . "/../config/conexion.php";

class sillas extends conexion{
    public function agregarSillas($IdSilla, $Fila, $Columna, $Clase, $IdAvion){
        $query= "INSERT INTO sillas(IdSilla, Fila, Columna, Clase, IdAvion) VALUES(?,?,?,?,?)";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("iissi", $IdSilla, $Fila, $Columna, $Clase, $IdAvion);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function mostrarSillas(){
        $query = "SELECT * FROM sillas";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

}
