<?php
require_once __DIR__ . "/../models/pasajero.php";
class controllerPasajeros{
    public function guardar($NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$TipoDocumento,$FechaNacimiento,$IdAccount){
        header("Content-Type:  application/json");

        if(empty($NombreCompleto) || empty($DocumentoIdentidad)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Nombre y Documento son obligatorios"]);
            return;
        }

        $pasajero = new pasajero();
        $result = $pasajero->agregarPasajero($NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$TipoDocumento,$FechaNacimiento,$IdAccount);
        if ($result !== false){
            http_response_code(201);
            echo json_encode(["success" => true, "IdPasajero" => $result]);
        }else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Could not create pasajero"]);
        }
    }

    public function mostrar(){
        header('Content-Type: application/json');
        $pasajero = new pasajero();
        $rows = $pasajero->mostrarPasajero();
        echo json_encode($rows);
    }

    public function borrar($IdPasajero){
        header('Content-Type: application/json');
        if (empty($IdPasajero)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdPasajero required"]);
            return;
        }
        $pasajero = new  pasajero();
        $ok = $pasajero->borrarPasajero($IdPasajero);
        if ($ok){
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false]);
        }
    }

    public function actualizar($NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$TipoDocumento,$FechaNacimiento,$IdAccount){
        header('Content-Type: application/json');
        if (empty($IdPasajero)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdPasajero required"]);
            return;
        }
        $pasajero= new pasajero();
        $ok = $pasajero->actualizarPasajero($NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$TipoDocumento,$FechaNacimiento,$IdAccount);
    }

}