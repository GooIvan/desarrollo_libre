<?php

class conexion{
    protected $conn;

    public function __construct(){
        $this->conn = new mysqli("127.0.0.1","root","","pragma");

        if($this->conn->connect_error){
            
            throw new \RuntimeException('Database connection error: ' . $this->conn->connect_error);
        }
    }
        
    }