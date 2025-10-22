<?php

require_once __DIR__ . "/../models/reserva_pasajero.php";

class controllerReservaPasajero {

    public function crear($IdReserva, $IdPasajero){
        header('Content-Type: application/json');

        if (empty($IdReserva) || empty($IdPasajero)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdReserva and IdPasajero are required"]);
            return;
        }

        $model = new ReservaPasajero();
        
        $insertId = $model->agregarRelacion($IdReserva, $IdPasajero);
        if ($insertId !== false){
            http_response_code(201);
            echo json_encode(["success" => true, "IdRelacion" => $insertId]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Could not create relation"]);
        }
    }

    public function listarPorReserva($IdReserva){
        header('Content-Type: application/json');
        if (empty($IdReserva)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdReserva required"]);
            return;
        }
        $model = new ReservaPasajero();
        $rows = $model->mostrarPorReserva($IdReserva);
        echo json_encode($rows);
    }

    public function borrar($IdReserva, $IdPasajero){
        header('Content-Type: application/json');
        if (empty($IdReserva) || empty($IdPasajero)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdReserva and IdPasajero required"]);
            return;
        }
        $model = new ReservaPasajero();
        $ok = $model->borrarRelacion($IdReserva, $IdPasajero);
        if ($ok){
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false]);
        }
    }

    public function actualizar($IdReserva, $IdPasajero){
        header('Content-Type: application/json');
        if (empty($IdReserva) || empty($IdPasajero)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdReserva and IdPasajero required"]);
            return;
        }
        $model = new ReservaPasajero();
        $ok = $model->actualizar($IdReserva, $IdPasajero);
        if ($ok){
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false]);
        }
    }
}
