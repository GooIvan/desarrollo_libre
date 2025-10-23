<?php

require_once __DIR__ . "/../config/conexion.php";

class sillas extends conexion{
    public function agregarSillas($IdAvion, $IdTipoSilla, $Disponible = 1, $Precio = 0){
        $query= "INSERT INTO sillas(IdAvion, IdTipoSilla, Disponible, Precio) VALUES(?,?,?,?)";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("iiid", $IdAvion, $IdTipoSilla, $Disponible, $Precio);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function mostrarSillas(){
        $query = "SELECT * FROM sillas";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

    public function obtenerSillasPorAvion($idAvion){
        try {
            error_log("Obteniendo sillas para avión ID: $idAvion");
            
            $query = "SELECT s.IdSilla, s.IdAvion, s.IdTipoSilla, s.Disponible, s.Precio, 
                            ts.Nombre as TipoSilla, ts.Fila, ts.Columna 
                     FROM sillas s 
                     LEFT JOIN tiposilla ts ON s.IdTipoSilla = ts.IdTipoSilla 
                     WHERE s.IdAvion = ? 
                     ORDER BY ts.Fila, ts.Columna";
            $env = $this->conn->prepare($query);
            
            if (!$env) {
                error_log("Error preparando query sillas por avión: " . $this->conn->error);
                return [];
            }
            
            $env->bind_param("i", $idAvion);
            $env->execute();
            $result = $env->get_result();
            
            if (!$result) {
                error_log("Error ejecutando query sillas por avión: " . $env->error);
                $env->close();
                return [];
            }
            
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            error_log("Sillas encontradas para avión $idAvion: " . count($rows));
            
            $env->close();
            return $rows;
            
        } catch (Exception $e) {
            error_log("Excepción en obtenerSillasPorAvion: " . $e->getMessage());
            return [];
        }
    }

    public function obtenerSillasOcupadas($idVuelo){
        try {
            error_log("Obteniendo sillas ocupadas para vuelo ID: $idVuelo");
            
            // Obtener asientos ocupados desde la tabla de pasajeros
            $query = "SELECT DISTINCT asiento FROM pasajeros WHERE vueloId = ? AND asiento IS NOT NULL AND asiento != ''";
            $env = $this->conn->prepare($query);
            
            if (!$env) {
                error_log("Error preparando query sillas ocupadas: " . $this->conn->error);
                return [];
            }
            
            $env->bind_param("i", $idVuelo);
            $env->execute();
            $result = $env->get_result();
            
            if (!$result) {
                error_log("Error ejecutando query sillas ocupadas: " . $env->error);
                $env->close();
                return [];
            }
            
            $asientosOcupados = [];
            while ($row = $result->fetch_assoc()) {
                $asientosOcupados[] = $row['asiento'];
            }
            
            error_log("Asientos ocupados en vuelo $idVuelo: " . implode(', ', $asientosOcupados));
            
            $env->close();
            return $asientosOcupados;
            
        } catch (Exception $e) {
            error_log("Excepción en obtenerSillasOcupadas: " . $e->getMessage());
            return [];
        }
    }

    public function obtenerSillasDisponiblesPorVuelo($idVuelo){
        try {
            error_log("Obteniendo sillas disponibles para vuelo ID: $idVuelo");
            
            // Primero obtenemos la información del vuelo para saber qué avión usa
            $queryVuelo = "SELECT IdAvion FROM vuelos WHERE IdVuelo = ?";
            $envVuelo = $this->conn->prepare($queryVuelo);
            
            if (!$envVuelo) {
                error_log("Error preparando query vuelo: " . $this->conn->error);
                return [];
            }
            
            $envVuelo->bind_param("i", $idVuelo);
            $envVuelo->execute();
            $resultVuelo = $envVuelo->get_result();
            
            if (!$resultVuelo || $resultVuelo->num_rows === 0) {
                error_log("Vuelo no encontrado: $idVuelo");
                $envVuelo->close();
                return [];
            }
            
            $vuelo = $resultVuelo->fetch_assoc();
            $idAvion = $vuelo['IdAvion'];
            $envVuelo->close();
            
            // Obtener todas las sillas del avión con información del tipo de silla
            $todasLasSillas = $this->obtenerSillasPorAvion($idAvion);
            
            // Obtener asientos ocupados
            $asientosOcupados = $this->obtenerSillasOcupadas($idVuelo);
            
            // Marcar disponibilidad
            $sillasConDisponibilidad = [];
            foreach ($todasLasSillas as $silla) {
                // Si no hay información de fila/columna del tipo de silla, generar basado en IdSilla
                $fila = $silla['Fila'] ?? $this->calcularFilaPorId($silla['IdSilla']);
                $columna = $silla['Columna'] ?? $this->calcularColumnaPorId($silla['IdSilla']);
                $numeroAsiento = $fila . $columna;
                
                // Verificar si está ocupado usando el campo Disponible de la BD o los asientos ocupados
                $ocupado = ($silla['Disponible'] == 0) || in_array($numeroAsiento, $asientosOcupados);
                
                $sillasConDisponibilidad[] = [
                    'IdSilla' => $silla['IdSilla'],
                    'Fila' => $fila,
                    'Columna' => $columna,
                    'Clase' => $silla['TipoSilla'] ?? 'Economy',
                    'IdAvion' => $silla['IdAvion'],
                    'Precio' => $silla['Precio'] ?? 0,
                    'numeroAsiento' => $numeroAsiento,
                    'ocupado' => $ocupado
                ];
            }
            
            error_log("Sillas con disponibilidad preparadas: " . count($sillasConDisponibilidad));
            return $sillasConDisponibilidad;
            
        } catch (Exception $e) {
            error_log("Excepción en obtenerSillasDisponiblesPorVuelo: " . $e->getMessage());
            return [];
        }
    }

    // Funciones auxiliares para calcular fila y columna basado en IdSilla
    private function calcularFilaPorId($idSilla) {
        // Asumiendo 6 asientos por fila (A-F)
        return intval(($idSilla - 1) / 6) + 1;
    }

    private function calcularColumnaPorId($idSilla) {
        // Asumiendo 6 asientos por fila (A-F)
        $columnas = ['A', 'B', 'C', 'D', 'E', 'F'];
        $indice = ($idSilla - 1) % 6;
        return $columnas[$indice];
    }

}
