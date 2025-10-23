<?php

require_once __DIR__ . "/../models/account.php";

class controllerAccount{
    public function guardar($Email, $Contrasena){
        // Content-Type ya está configurado en routes.php


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
        // Content-Type ya está configurado en routes.php
        $account = new account();
        $rows = $account->mostrarAccounts();
        echo json_encode($rows);
    }

    public function borrar($idAccount){
        // Content-Type ya está configurado en routes.php
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
        // Content-Type ya está configurado en routes.php
        
        echo json_encode(["success" => false, "message" => "Not implemented: provide IdAccount to update"]);
    }

    public function validar($Email, $Contrasena){
        try {
            // Content-Type ya está configurado en routes.php
            error_log("Validando credenciales para email: " . $Email);
            
            if (empty($Email) || empty($Contrasena)){
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Email and Contrasena are required"]);
                return;
            }
            
            $account = new account();
            $isValid = $account->validarCredenciales($Email, $Contrasena);
            
            error_log("Resultado de validación: " . ($isValid ? "VÁLIDO" : "INVÁLIDO"));
            
            if ($isValid){
                echo json_encode(["success" => true, "message" => "Valid credentials"]);
            } else {
                http_response_code(401);
                echo json_encode(["success" => false, "message" => "Invalid credentials"]);
            }
        } catch (Exception $e) {
            error_log("Error en validar: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Error interno del servidor", "error" => $e->getMessage()]);
        }
    }

    
}