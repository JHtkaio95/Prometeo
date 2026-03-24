<?php
    include_once './config/header.php';
    include_once './config/database.php';
    include_once './dao/empresaDAO.php';
    include_once './auth_middleware.php'; 

    $userData = obtenerUsuarioAutenticado(); 
    $id_usuario = $userData->id;

    try {
        $database = new database();
        $db = $database->getConnection();
        $daoEmpresa = new empresaDAO($db);
        
        $empresa = $daoEmpresa->buscarPorUsuario($id_usuario);

        if($empresa) {
            echo json_encode($empresa);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Empresa no encontrada"]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error en el servidor", "error" => $e->getMessage()]);
    }
?>