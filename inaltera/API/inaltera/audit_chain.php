<?php
    include_once './config/header.php';
    include_once './config/database.php';
    include_once './dao/seguridadDAO.php';
    include_once './auth_middleware.php';

    $userData = obtenerUsuarioAutenticado();
    
    try {
        $db = new database();
        $seguridad = new seguridadDAO($db->getConnection());

        $audit = $seguridad->verificarintegridadUsuario($userData->id);

        echo json_encode($audit);
    } catch (Exception $e) {
        http_response_code(404);
        echo json_encode(["message" => "Error al auditar", "Error" => $e->getMessage()]);
    }
?>