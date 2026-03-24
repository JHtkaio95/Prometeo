<?php
    include_once './config/database.php';
    include_once './config/header.php';
    include_once './dao/LoggerDAO.php';

    $input = json_decode(file_get_contents('php://input'), true);

    $database = new database();
    $db = $database->getConnection();
    $logger = new LoggerDAO($db);
    $logger->registrar($input['id_usuario'], 'LOGOUT', "Usuario se ha desconectado", []);

?>