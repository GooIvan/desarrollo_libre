<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

echo "<h2>Debug - Datos recibidos para crear pasajero</h2>";

echo "<h3>Método HTTP:</h3>";
echo $_SERVER['REQUEST_METHOD'] . "<br>";

echo "<h3>Headers recibidos:</h3>";
foreach (getallheaders() as $name => $value) {
    echo "$name: $value<br>";
}

echo "<h3>Raw input:</h3>";
$rawInput = file_get_contents('php://input');
echo "Longitud: " . strlen($rawInput) . "<br>";
echo "Contenido: <pre>" . htmlspecialchars($rawInput) . "</pre>";

echo "<h3>JSON decodificado:</h3>";
$jsonBody = json_decode($rawInput, true);
if ($jsonBody === null) {
    echo "Error JSON: " . json_last_error_msg() . "<br>";
} else {
    echo "<pre>";
    var_dump($jsonBody);
    echo "</pre>";
}

echo "<h3>GET params:</h3>";
echo "<pre>";
var_dump($_GET);
echo "</pre>";

echo "<h3>POST params:</h3>";
echo "<pre>";
var_dump($_POST);
echo "</pre>";
?>