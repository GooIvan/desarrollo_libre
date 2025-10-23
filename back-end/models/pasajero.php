<?php

require_once __DIR__ . "/../config/conexion.php";
class pasajero extends conexion{
    
    public function agregarPasajero($NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$TipoDocumento,$FechaNacimiento,$IdAccount){
    $query = "INSERT INTO pasajeros (NombreCompleto, Telefono, DocumentoIdentidad, Genero, TipoDocumento, FechaNacimiento, IdAccount, UltimaModificacion) VALUES (?,?,?,?,?,?,?,NOW())";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("ssssssi", $NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$TipoDocumento,$FechaNacimiento,$IdAccount);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function mostrarPasajero(){
        $query = "SELECT * FROM pasajeros";
        $env=$this->conn->prepare($query);
        if (!$env) return [];
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

    public function borrarPasajero($IdPasajero){
        $query="DELETE FROM pasajeros WHERE IdPasajero=?";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("i", $IdPasajero);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function actualizarPasajero($IdPasajero,$NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$Nacionalidad,$FechaNacimiento){
        $query="UPDATE pasajeros SET NombreCompleto = ?, Telefono=?, DocumentoIdentidad=?, Genero=?, Nacionalidad=?, FechaNacimiento=?, UltimaModificacion=NOW() WHERE IdPasajero = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("ssssssi", $NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$Nacionalidad,$FechaNacimiento,$IdPasajero);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }
}

