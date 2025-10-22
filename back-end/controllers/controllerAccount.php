<?php

require_once __DIR__ . "/../models/account.php";

class controllerAccount{
    public function guardar($Email, $Contrasena){
        header('Content-Type: application/json');


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
        header('Content-Type: application/json');
        $account = new account();
        $rows = $account->mostrarAccounts();
        echo json_encode($rows);
    }

    public function borrar($idAccount){
        header('Content-Type: application/json');
        if (empty($idAccount)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdAccount required"]);
            return;
        }
        $account = new account();
        $ok = $account->borrarAccount($idAccount);
        if ($ok){
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false]);
        }
    }

    public function actualizar($Email, $Contrasena){
        header('Content-Type: application/json');
        
        echo json_encode(["success" => false, "message" => "Not implemented: provide IdAccount to update"]);
    }
}