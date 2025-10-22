<?php

require_once __DIR__ . "/../config/conexion.php";

class account extends conexion{
    
    public function agregarAccount($Email, $Contrasena){
        $query = "INSERT INTO accounts (Email, Contrasena) VALUES(?, ?)";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("ss", $Email, $Contrasena);
        $ok = $env->execute();
        $insertId = $this->conn->insert_id;
        $env->close();
        return $ok ? $insertId : false;
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
        $query = "UPDATE accounts SET Email = ?, Contrasena = ? WHERE IdAccount = ?";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("ssi", $Email, $Contrasena, $idAccount);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }
}















