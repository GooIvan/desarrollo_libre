<?php

require_once("../models/account.php");

class controllerAccount{
    public function guardar($Email, $Contrasena){
        header('Content-Type: application/json');

        // Validate inputs
        if (empty($Email) || empty($Contrasena)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Email and Contrasena are required"]);
            return;
        }

        $account = new account();
        $result = $account->agregarAccount($Email, $Contrasena);
        if ($result !== false){
            http_response_code(201);
            echo json_encode(["success" => true, "IdAccount" => $result]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Could not create account"]);
        }
    }

    public function mostrar(){
        $account = new account();
        $account->mostrarAccounts();
    }

    public function borrar($idAccount){
        $account = new account();
        $account->borrarAccount($idAccount);
    }

    public function actualizar($Email, $Contrasena){
        $account = new account();
        $account->actualizarAccount($Email,$Contrasena);
    }
}