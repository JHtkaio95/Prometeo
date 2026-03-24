<?php
    include_once './config/header.php';
    include_once './config/database.php';
    include_once './dao/usuarioDAO.php';
    include_once './dao/LoggerDAO.php';
    include_once './vendor/autoload.php';
    include_once './auth_middleware.php';

    $userData = obtenerUsuarioAutenticado();
    $id_usuario = $userData->id;

    $json = file_get_contents("php://input");
    $data = json_decode($json);


    try{
        $database = new database();
        $db = $database->getConnection();
        $dao = new usuarioDAO($db);

        $dao->cambiarTarifa($id_usuario, $data->tarifa);

        $logger = new LoggerDAO($db);
        $logger->registrar($id_usuario, 'TARIFA_CAMBIO', "Usuario cambio de Tarifa: $data->tarifa", [
            'id_tarifa' => $data->tarifa
        ]);

        echo json_encode(["message" => "Factura actualizada"]);
    } catch(Exception $e){
        http_response_code(400);
        echo json_encode(["message" => "Hubo un error al intentar cambiar Tarifa", "tarifa" => $data->tarifa, "error" => $e]);
    }
?>