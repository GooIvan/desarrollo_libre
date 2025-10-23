<?php
require_once __DIR__."/../config/conexion.php";
class pasajero extends conexion{
    
    public function agregarPasajero($NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$Nacionalidad,$FechaNacimiento,$esPagante = 0, $vueloId = null){
        try {
            error_log("Intentando crear pasajero: $NombreCompleto, esPagante: $esPagante, vueloId: $vueloId");
            
            $query = "INSERT INTO pasajeros (NombreCompleto, Telefono, DocumentoIdentidad, Genero, Nacionalidad, FechaNacimiento, esPagante, vueloId, UltimaModificacion) VALUES (?,?,?,?,?,?,?,?,NOW())";
            $env = $this->conn->prepare($query);
            
            if (!$env) {
                error_log("Error preparando query pasajero: " . $this->conn->error);
                return false;
            }
            
            $env->bind_param("ssssssii", $NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$Nacionalidad,$FechaNacimiento,$esPagante,$vueloId);
            $ok = $env->execute();
            
            if (!$ok) {
                error_log("Error ejecutando query pasajero: " . $env->error);
                $env->close();
                return false;
            }
            
            $insertId = $this->conn->insert_id;
            error_log("Pasajero creado exitosamente con ID: $insertId");
            $env->close();
            return $insertId;
        } catch (Exception $e) {
            error_log("Excepción en agregarPasajero: " . $e->getMessage());
            return false;
        }
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

