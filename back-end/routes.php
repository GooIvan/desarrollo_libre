<?php

require_once "controllers/controllerAccount.php";


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
    }
} catch (\Throwable $e) {
    http_response_code(500);
    $msg = $e->getMessage();
    
    echo json_encode(["error" => "internal_error", "message" => $msg]);
}