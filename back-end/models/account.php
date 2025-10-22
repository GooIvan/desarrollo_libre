<?php

require_once("../config/conexion.php");

class account extends conexion{
    
    public function agregarAccount($Email, $Contrasena){
        $query = "INSERT INTO accounts (Email, Contrasena) VALUES(?, ?)";
        $env=$this->conn->prepare($query);
        $env->bind_param("ss", $Email, $Contrasena);
        $env->execute();
        $env->close();
    }

    public function mostrarAccounts(){
        $query = "SELECT * FROM accounts";
        $env = $this->conn->prepare($query);
        $env->execute();
        $env->close();
    }

    public function borrarAccount($idAccount){
        $query="DELETE FROM accounts WHERE IdAccount = ?";
        $env= $this->conn->prepare($query);
        $env->bind_param("i",$idAccount);
        $env->execute();
        $env->close();
    }

    public function actualizarAccount($Email, $Contrasena){
        $query="UPDATE accounts SET Email = ?, Contrasena=?";
        $env=$this->conn->prepare($query);
        $env->bind_param("ss", $Email, $Contrasena);
        $env->execute();
        $env->close();
    }
}















