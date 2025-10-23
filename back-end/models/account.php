<?php

require_once __DIR__ . "/../config/conexion.php";

class account extends conexion{
    
    public function agregarAccount($Email, $Contrasena){
        try {
            error_log("Intentando crear account con email: $Email");
            
            // Asignar rol de Cliente por defecto (IdRol = 2)
            $IdRol = 2; // Rol de "Cliente"
            
            $query = "INSERT INTO accounts (Email, Contrasena, IdRol, UltimaModificacion) VALUES(?, ?, ?, NOW())";
            $env = $this->conn->prepare($query);
            
            if (!$env) {
                error_log("Error preparando query: " . $this->conn->error);
                return false;
            }
            
            $env->bind_param("ssi", $Email, $Contrasena, $IdRol);
            $ok = $env->execute();
            
            if (!$ok) {
                error_log("Error ejecutando query: " . $env->error);
                $env->close();
                return false;
            }
            
            $insertId = $this->conn->insert_id;
            error_log("Account creado exitosamente con ID: $insertId");
            $env->close();
            return $insertId;
        } catch (Exception $e) {
            error_log("Excepción en agregarAccount: " . $e->getMessage());
            return false;
        }
    }

    public function mostrarAccounts(){
        $query = "SELECT * FROM accounts";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

    public function borrarAccount($idAccount){
        $query = "DELETE FROM accounts WHERE IdAccount = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("i", $idAccount);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function actualizarAccountById($idAccount, $Email, $Contrasena){
        $query = "UPDATE accounts SET Email = ?, Contrasena = ?, UltimaModificacion = NOW() WHERE IdAccount = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("ssi", $Email, $Contrasena, $idAccount);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function validarCredenciales($Email,$Contrasena){
        try {
            error_log("Validando en BD - Email: $Email");
            
            $query = "SELECT * FROM accounts WHERE Email = ? AND Contrasena = ?";
            $env = $this->conn->prepare($query);
            
            if (!$env) {
                error_log("Error preparando query: " . $this->conn->error);
                return false;
            }
            
            $env->bind_param("ss", $Email, $Contrasena);
            $env->execute();
            $result = $env->get_result();
            
            if (!$result) {
                error_log("Error ejecutando query: " . $env->error);
                $env->close();
                return false;
            }
            
            $numRows = $result->num_rows;
            error_log("Filas encontradas: $numRows");
            
            $isValid = $numRows > 0;
            $env->close();
            
            return $isValid;
        } catch (Exception $e) {
            error_log("Excepción en validarCredenciales: " . $e->getMessage());
            return false;
        }
    }
}















