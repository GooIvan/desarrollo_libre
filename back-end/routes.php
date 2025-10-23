<?php
// PRIMERO: Configurar para evitar errores HTML
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('html_errors', 0);

// Limpiar cualquier salida previa
ob_clean();
ob_start();

// Headers CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Manejar peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$accion = isset($_GET['accion']) ? $_GET['accion'] : "";

$raw = file_get_contents('php://input');
$jsonBody = json_decode($raw, true);

try {
    switch ($accion) {
        case 'crearAccount':
            require_once "controllers/controllerAccount.php";
            $controllerAccount = new controllerAccount();
            $email = isset($jsonBody['Email']) ? $jsonBody['Email'] : null;
            $contrasena = isset($jsonBody['Contrasena']) ? $jsonBody['Contrasena'] : null;
            $controllerAccount->guardar($email, $contrasena);
            break;

        case 'mostrarAccount':
            require_once "controllers/controllerAccount.php";
            $controllerAccount = new controllerAccount();
            $controllerAccount->mostrar();
            break;

        case 'borrarAccount':
            require_once "controllers/controllerAccount.php";
            $controllerAccount = new controllerAccount();
            $idAccount = isset($jsonBody['IdAccount']) ? $jsonBody['IdAccount'] : null;
            $controllerAccount->borrar($idAccount);
            break;

        case 'actualizarAccount':
            require_once "controllers/controllerAccount.php";
            $controllerAccount = new controllerAccount();
            $idAccount = isset($jsonBody['IdAccount']) ? $jsonBody['IdAccount'] : null;
            $email = isset($jsonBody['Email']) ? $jsonBody['Email'] : null;
            $contrasena = isset($jsonBody['Contrasena']) ? $jsonBody['Contrasena'] : null;
            $controllerAccount->actualizar($email, $contrasena);
            break;

        case 'validarAccount':
            require_once "controllers/controllerAccount.php";
            $controllerAccount = new controllerAccount();
            
            if (empty($jsonBody)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "No se recibieron datos"]);
                break;
            }
            
            $email = isset($jsonBody['Email']) ? $jsonBody['Email'] : null;
            $contrasena = isset($jsonBody['Contrasena']) ? $jsonBody['Contrasena'] : null;
            
            if (empty($email) || empty($contrasena)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Email y contraseña son requeridos"]);
                break;
            }
            
            $controllerAccount->validar($email, $contrasena);
            break;

        case 'crearPasajero':
            require_once "controllers/controllerPasajeros.php";
            $controllerPasajeros = new controllerPasajeros();
            
            if (empty($jsonBody)) {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "No se recibieron datos"]);
                break;
            }
            
            $nombre = isset($jsonBody['name']) ? trim($jsonBody['name']) : '';
            $apellido = isset($jsonBody['lastname']) ? trim($jsonBody['lastname']) : '';
            $nombreCompleto = trim($nombre . ' ' . $apellido);
            $telefono = isset($jsonBody['phone']) ? trim($jsonBody['phone']) : '';
            $documentoIdentidad = isset($jsonBody['document']) ? trim($jsonBody['document']) : '';
            $genero = isset($jsonBody['gender']) ? trim($jsonBody['gender']) : '';
            $nacionalidad = isset($jsonBody['nationality']) ? trim($jsonBody['nationality']) : '';
            
            // Construir fecha de nacimiento desde componentes separados
            $birthDay = isset($jsonBody['birthDay']) ? $jsonBody['birthDay'] : null;
            $birthMonth = isset($jsonBody['birthMonth']) ? $jsonBody['birthMonth'] : null;
            $birthYear = isset($jsonBody['birthYear']) ? $jsonBody['birthYear'] : null;
            
            $fechaNacimiento = '';
            if ($birthYear && $birthMonth && $birthDay) {
                $fechaNacimiento = sprintf('%04d-%02d-%02d', $birthYear, $birthMonth, $birthDay);
            }
            
            // Verificar si es pagante
            $esPagante = isset($jsonBody['esPagante']) && $jsonBody['esPagante'] ? 1 : 0;
            
            // Obtener vueloId si está presente
            $vueloId = isset($jsonBody['vueloId']) ? intval($jsonBody['vueloId']) : null;
            
            error_log("Datos para crear pasajero: nombre=$nombreCompleto, telefono=$telefono, documento=$documentoIdentidad, genero=$genero, nacionalidad=$nacionalidad, fecha=$fechaNacimiento, esPagante=$esPagante, vueloId=$vueloId");
            
            $controllerPasajeros->guardar($nombreCompleto, $telefono, $documentoIdentidad, $genero, $nacionalidad, $fechaNacimiento, $esPagante, $vueloId);
            break;

        case 'mostrarPasajeros':
            require_once "controllers/controllerPasajeros.php";
            $controllerPasajeros = new controllerPasajeros();
            $controllerPasajeros->mostrar();
            break;

        case 'borrarPasajero':
            require_once "controllers/controllerPasajeros.php";
            $controllerPasajeros = new controllerPasajeros();
            $idPasajero = isset($jsonBody['IdPasajero']) ? $jsonBody['IdPasajero'] : null;
            $controllerPasajeros->borrar($idPasajero);
            break;

        case 'actualizarPasajero':
            require_once "controllers/controllerPasajeros.php";
            $controllerPasajeros = new controllerPasajeros();
            $idPasajero = isset($jsonBody['IdPasajero']) ? $jsonBody['IdPasajero'] : null;
            $nombreCompleto = isset($jsonBody['NombreCompleto']) ? $jsonBody['NombreCompleto'] : null;
            $telefono = isset($jsonBody['Telefono']) ? $jsonBody['Telefono'] : null;
            $documentoIdentidad = isset($jsonBody['DocumentoIdentidad']) ? $jsonBody['DocumentoIdentidad'] : null;
            $genero = isset($jsonBody['Genero']) ? $jsonBody['Genero'] : null;
            $nacionalidad = isset($jsonBody['Nacionalidad']) ? $jsonBody['Nacionalidad'] : null;
            $fechaNacimiento = isset($jsonBody['FechaNacimiento']) ? $jsonBody['FechaNacimiento'] : null;
            $controllerPasajeros->actualizar($idPasajero, $nombreCompleto, $telefono, $documentoIdentidad, $genero, $nacionalidad, $fechaNacimiento);
            break;

        default:
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Acción no válida"]);
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
            
        case 'actualizarReservaPasajero':
            $controllerReservaPasajero = new controllerReservaPasajero();
            $idReserva = isset($jsonBody['IdReserva']) ? $jsonBody['IdReserva'] : null;
            $idPasajero = isset($jsonBody['IdPasajero']) ? $jsonBody['IdPasajero'] : null;
            $controllerReservaPasajero->actualizar($idReserva, $idPasajero);
            break;

        case 'crearVuelo':
            $controllerVuelo = new controllerVuelos();
            $origen = isset($jsonBody['Origen']) ? $jsonBody['Origen'] : null;
            $destino = isset($jsonBody['Destino']) ? $jsonBody['Destino'] : null;
            $fechaSalida = isset($jsonBody['FechaSalida']) ? $jsonBody['FechaSalida'] : null;
            $fechaVuelta = isset($jsonBody['FechaVuelta']) ? $jsonBody['FechaVuelta'] : null;
            $precioIda = isset($jsonBody['PrecioIda']) ? $jsonBody['PrecioIda'] : null;
            $precioVuelta = isset($jsonBody['PrecioVuelta']) ? $jsonBody['PrecioVuelta'] : null;
            $destino = isset($jsonBody['Destino']) ? $jsonBody['Destino'] : null;
            $controllerVuelo->guardar($IdVuelo, $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioVuelta, $Destino, $Origen, $IdAvion, $Estado);
            break;

        case 'listarVuelos':
            $controllerVuelo = new controllerVuelos();
            $controllerVuelo->listar();
            break;

        case 'borrarVuelo':
            $controllerVuelo = new controllerVuelos();
            $idVuelo = isset($jsonBody['IdVuelo']) ? $jsonBody['IdVuelo'] : null;
            $controllerVuelo->borrar($idVuelo);
            break;

        case 'actualizarVuelo':
            $controllerVuelo = new controllerVuelos();
            $idVuelo = isset($jsonBody['IdVuelo']) ? $jsonBody['IdVuelo'] : null;
            $origen = isset($jsonBody['Origen']) ? $jsonBody['Origen'] : null;
            $destino = isset($jsonBody['Destino']) ? $jsonBody['Destino'] : null;
            $fechaSalida = isset($jsonBody['FechaSalida']) ? $jsonBody['FechaSalida'] : null;
            $fechaVuelta = isset($jsonBody['FechaVuelta']) ? $jsonBody['FechaVuelta'] : null;
            $precioIda = isset($jsonBody['PrecioIda']) ? $jsonBody['PrecioIda'] : null;
            $precioVuelta = isset($jsonBody['PrecioVuelta']) ? $jsonBody['PrecioVuelta'] : null;
            $destino = isset($jsonBody['Destino']) ? $jsonBody['Destino'] : null;
            $controllerVuelo->actualizar($idVuelo, $fechaSalida, $fechaVuelta, $precioIda, $precioVuelta, $destino, $origen, $idAvion);
            break;

        case 'vuelosDisponibles':
            require_once "controllers/controllerVuelos.php";
            $controllerVuelo = new controllerVuelos();
            $controllerVuelo->vuelosDisponibles();
            break;

        case 'obtenerVuelo':
            require_once "controllers/controllerVuelos.php";
            $controllerVuelo = new controllerVuelos();
            $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
            if ($id > 0) {
                $controllerVuelo->obtenerVueloPorId($id);
            } else {
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "ID de vuelo requerido"]);
            }
            break;

        case 'buscarVuelos':
            require_once "controllers/controllerVuelos.php";
            $controllerVuelo = new controllerVuelos();
            
            // Obtener parámetros de búsqueda desde GET o POST
            $origen = isset($_GET['origen']) ? $_GET['origen'] : (isset($jsonBody['origen']) ? $jsonBody['origen'] : '');
            $destino = isset($_GET['destino']) ? $_GET['destino'] : (isset($jsonBody['destino']) ? $jsonBody['destino'] : '');
            $fechaSalida = isset($_GET['fechaSalida']) ? $_GET['fechaSalida'] : (isset($jsonBody['fechaSalida']) ? $jsonBody['fechaSalida'] : '');
            $fechaVuelta = isset($_GET['fechaVuelta']) ? $_GET['fechaVuelta'] : (isset($jsonBody['fechaVuelta']) ? $jsonBody['fechaVuelta'] : '');
            $tipoVuelo = isset($_GET['tipo']) ? $_GET['tipo'] : (isset($jsonBody['tipo']) ? $jsonBody['tipo'] : 'oneWay');
            
            error_log("Búsqueda de vuelos - Origen: $origen, Destino: $destino, FechaSalida: $fechaSalida, Tipo: $tipoVuelo");
            
            $controllerVuelo->buscarVuelos($origen, $destino, $fechaSalida, $fechaVuelta, $tipoVuelo);
            break;

        case 'listarAviones':
            $controllerAviones = new controllerAviones();
            $controllerAviones->listar();
            break;
    }
    
} catch (Exception $e) {
    error_log("Error en routes.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error interno del servidor", "error" => $e->getMessage()]);
}

ob_end_flush();
?>