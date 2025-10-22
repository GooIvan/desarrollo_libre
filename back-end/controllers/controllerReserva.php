<?php

require_once __DIR__."../models/reserva.php";

class controllerReserva{
    public function guardar($IdVuelo, $IdAccount,$PrecioTotal, $FechaReserva, $EstadoPago){
        header("Content-Type : application/json");

        $reserva= new Reserva();
        $result = $reserva->agregarReserva($IdVuelo, $IdAccount,$PrecioTotal, $FechaReserva, $EstadoPago);

        if ($result !== false){
            http_response_code(201);
            echo json_encode(["success" => true, "IdReserva" => $result]);
        }else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Could not create reserva"]);
        }
    }
    
    public function mostrar($IdReserva){
         header('Content-Type: application/json');
        $reserva = new Reserva();
        $rows = $reserva->mostrarReserva($IdReserva);
        echo json_encode($rows);
    }

    public function borrar($IdReserva){
        header('Content-Type: application/json');
        if (empty($IdReserva)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdReserva required"]);
            return;
        }
        $Reserva = new  Reserva();
        $ok = $Reserva->borrarReserva($IdReserva);
        if ($ok){
            echo json_encode(["success" => true]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false]);
        }
    }

    public function actualizar($IdVuelo, $IdAccount,$PrecioTotal, $FechaReserva, $EstadoPago){
        header('Content-Type: application/json');
        if (empty($IdReserva)){
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "IdReserva required"]);
            return;
        }
        $Reserva= new Reserva();
        $ok = $Reserva->actualizarReserva($IdVuelo, $IdAccount,$PrecioTotal, $FechaReserva, $EstadoPago);
    }
}