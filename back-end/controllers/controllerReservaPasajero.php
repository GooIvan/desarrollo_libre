<?php

require_once __DIR__ . "/../models/reserva_pasajero.php";
require_once __DIR__ . "/../helpers/auth.php";

class controllerReservaPasajero {

    public function crear($IdReserva, $IdPasajero, $IdSilla = null, $TipoPasajero = null){
        header('Content-Type: application/json');

        // require logged-in cliente
        if (!require_role(2)){
            http_response_code(403);
            echo json_encode(["success" => false, "message" => "Forbidden: requires cliente role"]);
            return;
        }

        if (empty($IdReserva) || empty($IdPasajero)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdReserva and IdPasajero are required"]);
            return;
        }

        $model = new ReservaPasajero();
        if (!empty($IdSilla)){
            $ok = $model->reservarSillaParaPasajero($IdReserva, $IdPasajero, $IdSilla, $TipoPasajero);
            if ($ok){
                http_response_code(201);
                echo json_encode(["success" => true]);
            } else {
                http_response_code(409);
                echo json_encode(["success" => false, "message" => "Could not reserve seat"]);
            }
            return;
        }

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
