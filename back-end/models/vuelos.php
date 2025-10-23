<?php

require_once __DIR__ . "/../config/conexion.php";

class vuelos extends conexion{

    public function agregarVuelos($IdVuelo, $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioVuelta, $Destino, $Origen, $IdAvion, $Estado){
        $query= "INSERT INTO vuelos(IdVuelo, FechaSalida, FechaVuelta, PrecioIda, PrecioVuelta, Destino, Origen, IdAvion, Estado) VALUES(?,?,?,?,?,?,?,?,?)";
        $env = $this->conn->prepare($query);
        if (!$env) return false;
        $env->bind_param("issssssi", $IdVuelo, $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioIda, $Destino, $Origen, $IdAvion, $Estado);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function mostrarVuelos(){
        $query = "SELECT * FROM vuelos";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }
    public function borrarVuelos($IdVuelo){
        $query= "DELETE FROM vuelos WHERE IdVuelo= ?";
        $env = $this->conn->prepare($query);
        if(!$env) return false;
        $env->bind_param("i",$IdVuelo);
        $ok = $env->execute();
        $env->close();
        return $ok;
    }

    public function actualizarVuelos($IdVuelo, $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioVuelta, $Destino, $Origen, $IdAvion){
        $query= "UPDATE vuelos SET FechaSalida=?,FechaVuelta=?,PrecioIda=?,PrecioVuelta=?,Destino=?,Origen=?,IdAvion=? WHERE IdVuelo=?";
        $env=$this->conn->prepare($query);
        if(!$env)return false;
        $env->bind_param("ssssssii", $FechaSalida, $FechaVuelta, $PrecioIda, $PrecioVuelta, $Destino, $Origen, $IdAvion, $IdVuelo);
        $ok=$env->execute();
        $env->close();
        return $ok;
    }

    public function mostrarVueloPorId($IdVuelo){
        $query="SELECT * FROM vuelos WHERE IdVuelo= ?";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->bind_param("i",$IdVuelo);
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

    public function buscarVuelos($origen, $destino, $fechaSalida, $fechaVuelta){
        $query="SELECT * FROM vuelos WHERE Origen=? AND Destino=? AND FechaSalida=? AND FechaVuelta=?";
        $env = $this->conn->prepare($query);
        if (!$env) return [];
        $env->bind_param("ssss",$origen, $destino, $fechaSalida, $fechaVuelta);
        $env->execute();
        $result = $env->get_result();
        $rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
        $env->close();
        return $rows;
    }

    public function buscarVuelosDisponibles(){
        try {
            error_log("Buscando vuelos disponibles...");
            
            // Cambiar query para buscar Estado = 1 (tinyint) en lugar de 'true' (string)
            $query="SELECT * FROM vuelos WHERE Estado = 1";
            $env = $this->conn->prepare($query);
            
            if (!$env) {
                error_log("Error preparando query vuelos disponibles: " . $this->conn->error);
                return [];
            }
            
            $env->execute();
            $result = $env->get_result();
            
            if (!$result) {
                error_log("Error ejecutando query vuelos disponibles: " . $env->error);
                $env->close();
                return [];
            }
            
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            error_log("Vuelos encontrados: " . count($rows));
            
            $env->close();
            return $rows;
        } catch (Exception $e) {
            error_log("Excepción en buscarVuelosDisponibles: " . $e->getMessage());
            return [];
        }
    }

    public function buscarVuelosConFiltros($origen = '', $destino = '', $fechaSalida = '', $fechaVuelta = '', $tipoVuelo = 'oneWay'){
        try {
            error_log("Buscando vuelos con filtros - Origen: '$origen', Destino: '$destino', FechaSalida: '$fechaSalida', TipoVuelo: '$tipoVuelo'");
            
            // Construir query con filtros dinámicos
            $query = "SELECT * FROM vuelos WHERE Estado = 1";
            $params = [];
            $types = "";
            
            // Filtro por origen (buscar coincidencias parciales y exactas)
            if (!empty($origen)) {
                // Limpiar el origen de códigos de aeropuerto
                $origenLimpio = preg_replace('/\s*\([A-Z]{3}\)\s*/', '', $origen);
                $query .= " AND (Origen LIKE ? OR Origen = ?)";
                $params[] = "%$origenLimpio%";
                $params[] = $origenLimpio;
                $types .= "ss";
            }
            
            // Filtro por destino (buscar coincidencias parciales y exactas)
            if (!empty($destino)) {
                // Limpiar el destino de códigos de aeropuerto
                $destinoLimpio = preg_replace('/\s*\([A-Z]{3}\)\s*/', '', $destino);
                $query .= " AND (Destino LIKE ? OR Destino = ?)";
                $params[] = "%$destinoLimpio%";
                $params[] = $destinoLimpio;
                $types .= "ss";
            }
            
            // Filtro por fecha de salida
            if (!empty($fechaSalida)) {
                $query .= " AND DATE(FechaSalida) = ?";
                $params[] = $fechaSalida;
                $types .= "s";
            }
            
            // Para vuelos de ida y vuelta, ser más flexible con la fecha de regreso
            if ($tipoVuelo === 'roundTrip') {
                // Buscar vuelos que tengan fecha de vuelta (no sean solo ida)
                $query .= " AND (FechaVuelta IS NOT NULL AND FechaVuelta != '0000-00-00 00:00:00')";
                
                // Si se especifica fecha de vuelta, filtrar por ella
                if (!empty($fechaVuelta)) {
                    $query .= " AND DATE(FechaVuelta) = ?";
                    $params[] = $fechaVuelta;
                    $types .= "s";
                }
            } else if ($tipoVuelo === 'oneWay') {
                // Para vuelos de ida, mostrar tanto vuelos solo de ida como vuelos de ida y vuelta
                // No agregamos filtro adicional para ser más flexible
            }
            
            // Ordenar por fecha
            $query .= " ORDER BY FechaSalida ASC";
            
            error_log("Query construida: $query");
            error_log("Parámetros: " . json_encode($params));
            
            $env = $this->conn->prepare($query);
            
            if (!$env) {
                error_log("Error preparando query con filtros: " . $this->conn->error);
                return [];
            }
            
            // Bind parameters si existen
            if (!empty($params)) {
                $env->bind_param($types, ...$params);
            }
            
            $env->execute();
            $result = $env->get_result();
            
            if (!$result) {
                error_log("Error obteniendo resultado con filtros: " . $env->error);
                $env->close();
                return [];
            }
            
            $rows = $result->fetch_all(MYSQLI_ASSOC);
            error_log("Vuelos encontrados con filtros: " . count($rows));
            
            $env->close();
            return $rows;
            
        } catch (Exception $e) {
            error_log("Excepción en buscarVuelosConFiltros: " . $e->getMessage());
            return [];
        }
    }

    public function obtenerVueloPorId($id) {
        try {
            error_log("Buscando vuelo con ID: $id");
            
            $query = "SELECT * FROM vuelos WHERE IdVuelo = ?";
            $env = $this->conn->prepare($query);
            
            if (!$env) {
                error_log("Error preparando query obtener vuelo por ID: " . $this->conn->error);
                return false;
            }
            
            $env->bind_param("i", $id);
            $env->execute();
            $result = $env->get_result();
            
            if (!$result) {
                error_log("Error ejecutando query obtener vuelo por ID: " . $env->error);
                $env->close();
                return false;
            }
            
            $row = $result->fetch_assoc();
            $env->close();
            
            if ($row) {
                error_log("Vuelo encontrado: " . $row['Origen'] . " -> " . $row['Destino']);
                return $row;
            } else {
                error_log("No se encontró vuelo con ID: $id");
                return false;
            }
            
        } catch (Exception $e) {
            error_log("Excepción en obtenerVueloPorId: " . $e->getMessage());
            return false;
        }
    }
}