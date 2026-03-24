<?php
    include_once './config/header.php';
    include_once './config/database.php';
    include_once './dao/facturaDAO.php';
    include_once './auth_middleware.php';

    $userData = obtenerUsuarioAutenticado();
    $id_usuario = $userData->id;

    try {
        $database = new database();
        $db = $database->getConnection();
        $dao = new facturaDAO($db);

        $listaFacturas = $dao->buscarTodas($id_usuario);

        if($listaFacturas) {
            echo json_encode($listaFacturas);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Lista vacia"]);
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["Error" => $e]);
    }
?>