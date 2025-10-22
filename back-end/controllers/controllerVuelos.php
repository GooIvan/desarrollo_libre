<?php

require_once __DIR__ . "/../models/vuelos.php";
class controllerVuelos{
    public function guardar($IdVuelo, $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioVuelta, $Destino, $Origen, $IdAvion, $Estado){
        header('Content-Type: application/json');

        if (empty($IdVuelo) || empty($FechaSalida) || empty($FechaVuelta) || empty($PrecioIda) || empty($PrecioVuelta) || empty($Destino) || empty($Origen) || empty($IdAvion) || empty($Estado)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "All fields are required"]);
            return;
        }

        $vuelos = new vuelos();
        $result = $vuelos->agregarVuelos($IdVuelo, $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioVuelta, $Destino, $Origen, $IdAvion, $Estado);
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

        $vuelos = new vuelos();
        $result = $vuelos->mostrarVuelos();
        if ($result !== false){
            http_response_code(200);
            echo json_encode(["success" => true, "data" => $result]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Could not retrieve vuelos"]);
        }
    }
    public function borrar($IdVuelo){
        header('Content-Type: application/json');
        if (empty($IdVuelo)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdVuelo required"]);
            return;
        }
        $vuelos = new vuelos();
        $ok = $vuelos->borrarVuelos($IdVuelo);
        if ($ok){
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false]);
        }
    }

    public function actualizar($IdVuelo, $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioVuelta, $Destino, $Origen, $IdAvion){
        header('Content-Type: application/json');
        if (empty($IdVuelo)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdVuelo required"]);
            return;
        }
        $vuelos= new vuelos();
        $ok = $vuelos->actualizarVuelos($IdVuelo, $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioVuelta, $Destino, $Origen, $IdAvion);
    }

    public function buscar($IdVuelo, $Destino, $FechaSalida, $FechaVuelta){
        header('Content-Type: application/json');
        if (empty($IdVuelo)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdVuelo required"]);
            return;
        }
        $vuelos = new vuelos();
        $result = $vuelos->buscarVuelos($IdVuelo, $Destino, $FechaSalida, $FechaVuelta);
        if ($result !== false){
            http_response_code(200);
            echo json_encode(["success" => true, "data" => $result]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Could not retrieve vuelo"]);
        }
    }

    public function vuelosDisponibles(){
        header('Content-Type: application/json');

        $vuelos = new vuelos();
        $result = $vuelos->buscarVuelosDisponibles();
        if ($result !== false){
            http_response_code(200);
            echo json_encode(["success" => true, "data" => $result]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Could not retrieve available vuelos"]);
        }
    }
}