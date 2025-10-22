<?php
require_once "controllers/controllerAccount.php";

$accion = isset($_GET['accion']) ? $_GET['accion'] : "";

$controllerAccount = new controllerAccount();


$raw = file_get_contents('php://input');
$jsonBody = json_decode($raw, true);

switch ($accion) {
    case 'crearAccount':
        $email = isset($jsonBody['Email']) ? $jsonBody['Email'] : null;
        $contrasena = isset($jsonBody['Contrasena']) ? $jsonBody['Contrasena'] : null;
        $controllerAccount->guardar($email, $contrasena);
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Unknown action"]);
        break;

        case 'mostarAccount':
            $controllerAccount->mostrar();
            break;
        case 'borrarAccount':
            $idAccount = isset($jsonBody['IdAccount']) ? $jsonBody['IdAccount'] : null;
            $controllerAccount->borrar($idAccount);
            break;

        case 'actualizarAccount':
            $email = isset($jsonBody['Email']) ? $jsonBody['Email'] : null;
            $contrasena = isset($jsonBody['Contrasena']) ? $jsonBody['Contrasena'] : null;
            $controllerAccount->actualizar($email, $contrasena);
            break;
}