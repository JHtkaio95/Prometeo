<?php
    include_once './dao/facturaDAO.php';
    include_once './config/database.php';
    include_once './config/header.php';

    $hash = $_GET['hash'];

    if (!$hash) {
        echo json_encode(["status" => "error", "message" => "No se proporcionó un hash"]);
        exit;
    }

    try {
        $database = new database();
        $db = $database->getConnection();
        $dao = new facturaDAO($db);

        $factura = $dao->buscarPorHash($hash);

        ob_clean();

        if ($factura) {
            echo json_encode($factura);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Factura no encontrada"]);
        }


        exit;
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error en el servidor", "error" => $e->getMessage()]);
    }
?>