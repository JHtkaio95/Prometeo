<?php
    include_once './config/header.php';
    include_once './config/database.php';
    include_once './auth_middleware.php';

    $userData = obtenerUsuarioAutenticado();
    $id_usuario = $userData->id;
    $serie = $_GET['serie'] ?? date('Y') . '-A';

    $database = new database();
    $db = $database->getConnection();

    $query = "SELECT MAX(numero) as ultimo FROM facturas WHERE id_usuario = :id_usuario AND serie = :serie";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id_usuario', $id_usuario);
    $stmt->bindParam(':serie', $serie);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $siguiente = ($row['ultimo'] ?? 0) + 1;

    echo json_encode(["siguiente_numero" => $siguiente]);

?>