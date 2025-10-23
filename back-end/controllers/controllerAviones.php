<?php

require_once __DIR__ . "/../models/vuelos.php";
class controllerAviones{
    public function guardar($IdAvion, $Capacidad, $Tamaño, $Nombre, $IdAerolinea){
        header('Content-Type: application/json');

        if (empty($IdAvion) || empty($Capacidad) || empty($Tamaño) || empty($Nombre) || empty($IdAerolinea)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "All fields are required"]);
            return;
        }

        $aviones = new aviones();
        $result = $aviones->agregarAviones($IdAvion, $Capacidad, $Tamaño, $Nombre, $IdAerolinea);
        if ($result !== false){
            http_response_code(201);
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Could not create vuelo"]);
        }
    }

    public function listar(){
        header('Content-Type: application/json');

        $aviones = new aviones();
        $result = $aviones->mostrarAviones();
        if ($result !== false){
            http_response_code(200);
            echo json_encode(["success" => true, "data" => $result]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Could not retrieve aviones"]);
        }
    }
    public function borrar($IdAvion){
        header('Content-Type: application/json');
        if (empty($IdAvion)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdAvion required"]);
            return;
        }
        $aviones = new aviones();
        $ok = $aviones->borrarAviones($IdAvion);
        if ($ok){
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false]);
        }
    }

    public function actualizar($IdAvion, $Capacidad, $Tamaño, $Nombre, $IdAerolinea){
        header('Content-Type: application/json');
        if (empty($IdAvion)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdAvion required"]);
            return;
        }
        $aviones = new aviones();
        $ok = $aviones->actualizarAviones($IdAvion, $Capacidad, $Tamaño, $Nombre, $IdAerolinea);
        if ($ok){
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false]);
        }
    }

}