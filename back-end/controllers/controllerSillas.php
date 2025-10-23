<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../models/sillas.php';

class controllerSillas {
    
    public function obtenerSillasPorVuelo() {
        try {
            error_log("=== Iniciando obtenerSillasPorVuelo ===");
            
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
                return;
            }
            
            // Obtener el ID del vuelo desde el parámetro GET
            $idVuelo = isset($_GET['vuelo']) ? intval($_GET['vuelo']) : 0;
            error_log("ID de vuelo recibido: $idVuelo");
            
            if ($idVuelo <= 0) {
                error_log("ID de vuelo inválido: $idVuelo");
                http_response_code(400);
                echo json_encode(['error' => 'ID de vuelo inválido o no proporcionado']);
                return;
            }
            
            $sillas = new sillas();
            $sillasDisponibles = $sillas->obtenerSillasDisponiblesPorVuelo($idVuelo);
            
            if (empty($sillasDisponibles)) {
                error_log("No se encontraron sillas para el vuelo: $idVuelo");
                
                // Intentar generar sillas simuladas como fallback
                $sillasSimuladas = $this->generarSillasSimuladas($idVuelo);
                
                if (!empty($sillasSimuladas)) {
                    error_log("Usando sillas simuladas para vuelo: $idVuelo");
                    http_response_code(200);
                    echo json_encode([
                        'success' => true,
                        'sillas' => $sillasSimuladas,
                        'total' => count($sillasSimuladas),
                        'simuladas' => true
                    ]);
                    return;
                }
                
                http_response_code(404);
                echo json_encode(['error' => 'No se encontraron sillas para este vuelo']);
                return;
            }
            
            error_log("Sillas obtenidas exitosamente: " . count($sillasDisponibles));
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'sillas' => $sillasDisponibles,
                'total' => count($sillasDisponibles)
            ]);
            
        } catch (Exception $e) {
            error_log("Error en obtenerSillasPorVuelo: " . $e->getMessage());
            
            // Fallback en caso de error
            $sillasSimuladas = $this->generarSillasSimuladas(isset($idVuelo) ? $idVuelo : 1);
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'sillas' => $sillasSimuladas,
                'total' => count($sillasSimuladas),
                'simuladas' => true,
                'error_original' => $e->getMessage()
            ]);
        }
    }
    
    private function generarSillasSimuladas($idVuelo) {
        $sillasSimuladas = [];
        $ocupadosSimulados = [1, 3, 7, 12, 15, 18, 22, 25, 30]; // Algunos asientos ocupados
        
        for ($fila = 1; $fila <= 30; $fila++) {
            $columnas = ['A', 'B', 'C', 'D', 'E', 'F'];
            
            foreach ($columnas as $columna) {
                $idSilla = (($fila - 1) * 6) + array_search($columna, $columnas) + 1;
                $numeroAsiento = $fila . $columna;
                
                // Determinar tipo según fila
                if ($fila <= 3) {
                    $clase = 'Business';
                    $precio = 200;
                } elseif ($fila <= 8) {
                    $clase = 'Premium';  
                    $precio = 120;
                } else {
                    $clase = 'Economy';
                    $precio = 50;
                }
                
                $sillasSimuladas[] = [
                    'IdSilla' => $idSilla,
                    'IdAvion' => 1,
                    'Fila' => $fila,
                    'Columna' => $columna,
                    'Clase' => $clase,
                    'Precio' => $precio,
                    'numeroAsiento' => $numeroAsiento,
                    'ocupado' => in_array($idSilla, $ocupadosSimulados)
                ];
            }
        }
        
        return $sillasSimuladas;
    }
    
    public function obtenerSillasAvion() {
        try {
            error_log("=== Iniciando obtenerSillasAvion ===");
            
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
                return;
            }
            
            // Obtener el ID del avión desde la URL
            $uri = $_SERVER['REQUEST_URI'];
            preg_match('/\/sillas\/avion\/(\d+)/', $uri, $matches);
            
            if (!$matches || !isset($matches[1])) {
                error_log("ID de avión no encontrado en la URL: $uri");
                http_response_code(400);
                echo json_encode(['error' => 'ID de avión no proporcionado']);
                return;
            }
            
            $idAvion = intval($matches[1]);
            error_log("ID de avión extraído: $idAvion");
            
            if ($idAvion <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'ID de avión inválido']);
                return;
            }
            
            $sillas = new sillas();
            $sillasAvion = $sillas->obtenerSillasPorAvion($idAvion);
            
            if (empty($sillasAvion)) {
                error_log("No se encontraron sillas para el avión: $idAvion");
                http_response_code(404);
                echo json_encode(['error' => 'No se encontraron sillas para este avión']);
                return;
            }
            
            error_log("Sillas del avión obtenidas exitosamente: " . count($sillasAvion));
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'sillas' => $sillasAvion,
                'total' => count($sillasAvion)
            ]);
            
        } catch (Exception $e) {
            error_log("Error en obtenerSillasAvion: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error interno del servidor: ' . $e->getMessage()]);
        }
    }
    
    public function obtenerTodasLasSillas() {
        try {
            error_log("=== Iniciando obtenerTodasLasSillas ===");
            
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
                return;
            }
            
            $sillas = new sillas();
            $todasLasSillas = $sillas->mostrarSillas();
            
            error_log("Total de sillas obtenidas: " . count($todasLasSillas));
            
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'sillas' => $todasLasSillas,
                'total' => count($todasLasSillas)
            ]);
            
        } catch (Exception $e) {
            error_log("Error en obtenerTodasLasSillas: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error interno del servidor: ' . $e->getMessage()]);
        }
    }
    
    public function agregarSilla() {
        try {
            error_log("=== Iniciando agregarSilla ===");
            
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode(['error' => 'Método no permitido']);
                return;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                http_response_code(400);
                echo json_encode(['error' => 'Datos no válidos']);
                return;
            }
            
            // Validar campos requeridos
            $camposRequeridos = ['Fila', 'Columna', 'Clase', 'IdAvion'];
            foreach ($camposRequeridos as $campo) {
                if (!isset($input[$campo]) || empty($input[$campo])) {
                    http_response_code(400);
                    echo json_encode(['error' => "El campo $campo es requerido"]);
                    return;
                }
            }
            
            $sillas = new sillas();
            $sillas->Fila = $input['Fila'];
            $sillas->Columna = $input['Columna'];
            $sillas->Clase = $input['Clase'];
            $sillas->IdAvion = $input['IdAvion'];
            
            $resultado = $sillas->agregarSillas();
            
            if ($resultado) {
                error_log("Silla agregada exitosamente");
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Silla agregada exitosamente'
                ]);
            } else {
                error_log("Error al agregar la silla");
                http_response_code(500);
                echo json_encode(['error' => 'Error al agregar la silla']);
            }
            
        } catch (Exception $e) {
            error_log("Error en agregarSilla: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Error interno del servidor: ' . $e->getMessage()]);
        }
    }
}
?>