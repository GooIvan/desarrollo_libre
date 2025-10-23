<?php

require_once __DIR__ . "/../models/pasajero.php";

class controllerPasajeros{

    public function guardar($NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$Nacionalidad,$FechaNacimiento){
        try {
            error_log("Guardando pasajero: $NombreCompleto, $DocumentoIdentidad");

            if(empty($NombreCompleto) || empty($DocumentoIdentidad)){
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "Nombre y Documento son obligatorios"]);
                return;
            }

            $pasajero = new pasajero();
            $result = $pasajero->agregarPasajero($NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$Nacionalidad,$FechaNacimiento);
            
            if ($result !== false){
                http_response_code(201);
                echo json_encode(["success" => true, "IdPasajero" => $result, "message" => "Pasajero creado exitosamente"]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Could not create pasajero"]);
            }
        } catch (Exception $e) {
            error_log("Error en controllerPasajeros->guardar: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Error interno del servidor", "error" => $e->getMessage()]);
        }
    }

    public function mostrar(){
        try {
            $pasajero = new pasajero();
            $rows = $pasajero->mostrarPasajero();
            echo json_encode($rows);
        } catch (Exception $e) {
            error_log("Error en controllerPasajeros->mostrar: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Error interno del servidor"]);
        }
    }

    public function borrar($IdPasajero){
        try {
            if (empty($IdPasajero)){
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "IdPasajero required"]);
                return;
            }
            
            $pasajero = new pasajero();
            $ok = $pasajero->borrarPasajero($IdPasajero);
            
            if ($ok){
                echo json_encode(["success" => true]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Could not delete pasajero"]);
            }
        } catch (Exception $e) {
            error_log("Error en controllerPasajeros->borrar: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Error interno del servidor"]);
        }
    }

    public function actualizar($IdPasajero, $NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$Nacionalidad,$FechaNacimiento){
        try {
            if (empty($IdPasajero)){
                http_response_code(400);
                echo json_encode(["success" => false, "message" => "IdPasajero required"]);
                return;
            }
            
            $pasajero = new pasajero();
            $ok = $pasajero->actualizarPasajero($IdPasajero, $NombreCompleto,$Telefono,$DocumentoIdentidad,$Genero,$Nacionalidad,$FechaNacimiento);
            
            if ($ok){
                echo json_encode(["success" => true, "message" => "Pasajero actualizado exitosamente"]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Could not update pasajero"]);
            }
        } catch (Exception $e) {
            error_log("Error en controllerPasajeros->actualizar: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Error interno del servidor"]);
        }
    }
}
?>