<?php
// Script para insertar asientos de ejemplo en la base de datos
// Actualizado para trabajar con la estructura real: IdSilla, IdAvion, IdTipoSilla, Disponible, Precio

require_once 'config/conexion.php';

echo "=== Insertando asientos de ejemplo ===\n";

try {
    $conexion = new conexion();
    $conn = $conexion->conectar();
    
    if (!$conn) {
        echo "Error: No se pudo conectar a la base de datos\n";
        exit;
    }
    
    // Verificar estructura de las tablas
    echo "Verificando estructura de tablas...\n";
    
    // Verificar tabla sillas
    $estructuraSillas = $conn->query("DESCRIBE sillas");
    if ($estructuraSillas) {
        echo "Estructura tabla 'sillas':\n";
        while ($row = $estructuraSillas->fetch_assoc()) {
            echo "  - {$row['Field']} ({$row['Type']})\n";
        }
    }
    
    // Verificar si existe tabla tiposilla
    $checkTipoSilla = $conn->query("SHOW TABLES LIKE 'tiposilla'");
    $existeTipoSilla = $checkTipoSilla && $checkTipoSilla->num_rows > 0;
    
    if ($existeTipoSilla) {
        echo "\nTabla 'tiposilla' encontrada.\n";
        $estructuraTipoSilla = $conn->query("DESCRIBE tiposilla");
        if ($estructuraTipoSilla) {
            echo "Estructura tabla 'tiposilla':\n";
            while ($row = $estructuraTipoSilla->fetch_assoc()) {
                echo "  - {$row['Field']} ({$row['Type']})\n";
            }
        }
    } else {
        echo "\nAdvertencia: Tabla 'tiposilla' no encontrada. Creando tipos de silla básicos...\n";
        
        // Crear tabla tiposilla si no existe
        $createTipoSilla = "CREATE TABLE IF NOT EXISTS tiposilla (
            IdTipoSilla INT AUTO_INCREMENT PRIMARY KEY,
            Nombre VARCHAR(50) NOT NULL,
            Fila INT,
            Columna VARCHAR(1)
        )";
        
        if ($conn->query($createTipoSilla)) {
            echo "Tabla 'tiposilla' creada exitosamente.\n";
        }
    }
    
    // Verificar aviones existentes
    $avionesQuery = "SELECT IdAvion FROM aviones LIMIT 1";
    $avionesResult = $conn->query($avionesQuery);
    
    if (!$avionesResult || $avionesResult->num_rows == 0) {
        echo "Creando avión de ejemplo...\n";
        $insertAvion = "INSERT INTO aviones (Modelo, Capacidad) VALUES ('Boeing 737', 180)";
        if ($conn->query($insertAvion)) {
            $idAvion = $conn->insert_id;
            echo "Avión creado con ID: $idAvion\n";
        } else {
            echo "Error creando avión: " . $conn->error . "\n";
            exit;
        }
    } else {
        $avion = $avionesResult->fetch_assoc();
        $idAvion = $avion['IdAvion'];
        echo "Usando avión existente ID: $idAvion\n";
    }
    
    // Crear tipos de silla si no existen
    $tiposSilla = [
        ['nombre' => 'Economy', 'precio' => 50],
        ['nombre' => 'Premium', 'precio' => 120],
        ['nombre' => 'Business', 'precio' => 200]
    ];
    
    $idTiposSilla = [];
    
    foreach ($tiposSilla as $tipo) {
        // Verificar si ya existe
        $checkTipo = $conn->prepare("SELECT IdTipoSilla FROM tiposilla WHERE Nombre = ?");
        $checkTipo->bind_param("s", $tipo['nombre']);
        $checkTipo->execute();
        $resultTipo = $checkTipo->get_result();
        
        if ($resultTipo->num_rows > 0) {
            $row = $resultTipo->fetch_assoc();
            $idTiposSilla[$tipo['nombre']] = $row['IdTipoSilla'];
        } else {
            // Insertar nuevo tipo
            $insertTipo = $conn->prepare("INSERT INTO tiposilla (Nombre) VALUES (?)");
            $insertTipo->bind_param("s", $tipo['nombre']);
            if ($insertTipo->execute()) {
                $idTiposSilla[$tipo['nombre']] = $conn->insert_id;
                echo "Tipo de silla '{$tipo['nombre']}' creado con ID: {$idTiposSilla[$tipo['nombre']]}\n";
            }
        }
        $checkTipo->close();
    }
    
    // Verificar asientos existentes
    $checkAsientos = $conn->query("SELECT COUNT(*) as total FROM sillas WHERE IdAvion = $idAvion");
    $countExistente = $checkAsientos->fetch_assoc()['total'];
    
    echo "Asientos existentes para avión $idAvion: $countExistente\n";
    
    if ($countExistente > 0) {
        echo "Ya existen asientos para este avión.\n";
        echo "Asientos actuales:\n";
        $existentes = $conn->query("SELECT s.*, t.Nombre as TipoSilla FROM sillas s LEFT JOIN tiposilla t ON s.IdTipoSilla = t.IdTipoSilla WHERE s.IdAvion = $idAvion LIMIT 10");
        while ($row = $existentes->fetch_assoc()) {
            echo "  ID: {$row['IdSilla']}, Tipo: {$row['TipoSilla']}, Disponible: {$row['Disponible']}, Precio: {$row['Precio']}\n";
        }
    } else {
        echo "Insertando asientos para el avión...\n";
        
        // Insertar asientos: 30 filas, 6 asientos por fila
        $insertCount = 0;
        
        for ($fila = 1; $fila <= 30; $fila++) {
            $columnas = ['A', 'B', 'C', 'D', 'E', 'F'];
            
            foreach ($columnas as $columna) {
                // Determinar tipo de silla según la fila
                if ($fila <= 3) {
                    $tipoSilla = 'Business';
                    $precio = 200;
                } elseif ($fila <= 8) {
                    $tipoSilla = 'Premium';
                    $precio = 120;
                } else {
                    $tipoSilla = 'Economy';
                    $precio = 50;
                }
                
                $idTipoSilla = $idTiposSilla[$tipoSilla];
                $disponible = 1; // Todos disponibles inicialmente
                
                // Insertar asiento
                $query = "INSERT INTO sillas (IdAvion, IdTipoSilla, Disponible, Precio) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($query);
                
                if ($stmt) {
                    $stmt->bind_param("iiid", $idAvion, $idTipoSilla, $disponible, $precio);
                    
                    if ($stmt->execute()) {
                        $insertCount++;
                    } else {
                        echo "Error insertando asiento fila $fila columna $columna: " . $stmt->error . "\n";
                    }
                    
                    $stmt->close();
                } else {
                    echo "Error preparando query: " . $conn->error . "\n";
                }
            }
            
            // Mostrar progreso cada 10 filas
            if ($fila % 10 === 0) {
                echo "Insertadas filas 1-$fila... ($insertCount asientos)\n";
            }
        }
        
        echo "\n=== Resultado ===\n";
        echo "Asientos insertados: $insertCount\n";
        echo "Total esperado: 180 asientos (30 filas × 6 columnas)\n";
        
        // Verificar el resultado final
        $finalCount = $conn->query("SELECT COUNT(*) as total FROM sillas WHERE IdAvion = $idAvion")->fetch_assoc()['total'];
        echo "Total de asientos en BD para avión $idAvion: $finalCount\n";
        
        // Mostrar resumen por tipo
        $resumen = $conn->query("
            SELECT t.Nombre, COUNT(*) as cantidad, AVG(s.Precio) as precio_promedio 
            FROM sillas s 
            LEFT JOIN tiposilla t ON s.IdTipoSilla = t.IdTipoSilla 
            WHERE s.IdAvion = $idAvion 
            GROUP BY t.Nombre
        ");
        
        echo "\n=== Resumen por tipo de asiento ===\n";
        while ($row = $resumen->fetch_assoc()) {
            echo "Tipo: {$row['Nombre']}, Cantidad: {$row['cantidad']}, Precio promedio: \${$row['precio_promedio']}\n";
        }
    }
    
    $conn->close();
    echo "\nScript completado exitosamente!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>