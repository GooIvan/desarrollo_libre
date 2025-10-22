<?php

require_once "controllers/controllerAccount.php";
require_once "controllers/controllerPasajeros.php";
require_once "controllers/controllerReserva.php";
require_once "controllers/controllerReservaPasajero.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$accion = isset($_GET['accion']) ? $_GET['accion'] : "";

$raw = file_get_contents('php://input');
$jsonBody = json_decode($raw, true);

header('Content-Type: application/json');

try {
    $controllerAccount = new controllerAccount();

    switch ($accion) {
        case 'crearAccount':
            $email = isset($jsonBody['Email']) ? $jsonBody['Email'] : null;
            $contrasena = isset($jsonBody['Contrasena']) ? $jsonBody['Contrasena'] : null;
            $controllerAccount->guardar($email, $contrasena);
            break;

        case 'mostrarAccount':
            $controllerAccount->mostrar();
            break;

        case 'borrarAccount':
            $idAccount = isset($jsonBody['IdAccount']) ? $jsonBody['IdAccount'] : null;
            $controllerAccount->borrar($idAccount);
            break;

        case 'actualizarAccount':
            $idAccount = isset($jsonBody['IdAccount']) ? $jsonBody['IdAccount'] : null;
            $email = isset($jsonBody['Email']) ? $jsonBody['Email'] : null;
            $contrasena = isset($jsonBody['Contrasena']) ? $jsonBody['Contrasena'] : null;
            
            $controllerAccount->actualizar($email, $contrasena);
            break;

            case 'validarAccount':
            $email = isset($jsonBody['Email']) ? $jsonBody['Email'] : null;
            $contrasena = isset($jsonBody['Contrasena']) ? $jsonBody['Contrasena'] : null;
            $controllerAccount->validar($email, $contrasena);
            break;

            case 'crearPasajero':
            $controllerPasajeros = new controllerPasajeros();
            $nombre = isset($jsonBody['Nombre']) ? $jsonBody['Nombre'] : null;
            $telefono = isset($jsonBody['Telefono']) ? $jsonBody['Telefono'] : null;
            $documentoIdentidad = isset($jsonBody['DocumentoIdentidad']) ? $jsonBody['DocumentoIdentidad'] : null;
            $controllerPasajeros->guardar($nombre, $telefono, $documentoIdentidad, $genero, $tipoDocumento, $fechaNacimiento, $idAccount);
            break;

            case 'mostrarPasajero':
            $controllerPasajeros = new controllerPasajeros();
            $controllerPasajeros->mostrar();
            break;

            case 'borrarPasajero':
            $controllerPasajeros = new controllerPasajeros();
            $idPasajero = isset($jsonBody['IdPasajero']) ? $jsonBody['IdPasajero'] : null;
            $controllerPasajeros->borrar($idPasajero);
            break;

            case 'actualizarPasajero':
            $controllerPasajeros = new controllerPasajeros();
            $idPasajero = isset($jsonBody['IdPasajero']) ? $jsonBody['IdPasajero'] : null;
            $nombre = isset($jsonBody['Nombre']) ? $jsonBody['Nombre'] : null;
            $telefono = isset($jsonBody['Telefono']) ? $jsonBody['Telefono'] : null;
            $documentoIdentidad = isset($jsonBody['DocumentoIdentidad']) ? $jsonBody['DocumentoIdentidad'] : null;
            $controllerPasajeros->actualizar($nombre, $telefono, $documentoIdentidad, $genero, $tipoDocumento, $fechaNacimiento, $idAccount);
            break;

            case 'crearReserva':
            $controllerReserva = new controllerReserva();
            $idVuelo = isset($jsonBody['IdVuelo']) ? $jsonBody['IdVuelo'] : null;
            $idAccount = isset($jsonBody['IdAccount']) ? $jsonBody['IdAccount'] : null;
            $precioTotal = isset($jsonBody['PrecioTotal']) ? $jsonBody['PrecioTotal'] : null;
            $fechaReserva = isset($jsonBody['FechaReserva']) ? $jsonBody['FechaReserva'] : null;
            $estadoPago = isset($jsonBody['EstadoPago']) ? $jsonBody['EstadoPago'] : null;
            $controllerReserva->guardar($idVuelo, $idAccount, $precioTotal, $fechaReserva, $estadoPago);
            break;

            case 'mostrarReserva':
            $controllerReserva = new controllerReserva();
            $idReserva = isset($jsonBody['IdReserva']) ? $jsonBody['IdReserva'] : null;
            $controllerReserva->mostrar($idReserva);
            break;

            case 'borrarReserva':
            $controllerReserva = new controllerReserva();
            $idReserva = isset($jsonBody['IdReserva']) ? $jsonBody['IdReserva'] : null;
            $controllerReserva->borrar($idReserva);
            break;

            case 'actualizarReserva':
            $controllerReserva = new controllerReserva();
            $idReserva = isset($jsonBody['IdReserva']) ? $jsonBody['IdReserva'] : null;
            $idVuelo = isset($jsonBody['IdVuelo']) ? $jsonBody['IdVuelo'] : null;
            $idAccount = isset($jsonBody['IdAccount']) ? $jsonBody['IdAccount'] : null;
            $precioTotal = isset($jsonBody['PrecioTotal']) ? $jsonBody['PrecioTotal'] : null;
            $fechaReserva = isset($jsonBody['FechaReserva']) ? $jsonBody['FechaReserva'] : null;
            $estadoPago = isset($jsonBody['EstadoPago']) ? $jsonBody['EstadoPago'] : null;
            $controllerReserva->actualizar($idVuelo, $idAccount, $precioTotal, $fechaReserva, $estadoPago);
            break;
            

    }
} catch (\Throwable $e) {
    http_response_code(500);
    $msg = $e->getMessage();
    
    echo json_encode(["error" => "internal_error", "message" => $msg]);
}