<?php
// Test simple para sillas
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    // Generar datos de sillas simuladas
    $sillasSimuladas = [];
    $ocupadosSimulados = [1, 3, 7, 12, 15, 18, 22, 25, 30];
    
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
    
    echo json_encode([
        'success' => true,
        'sillas' => $sillasSimuladas,
        'total' => count($sillasSimuladas),
        'simuladas' => true
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>