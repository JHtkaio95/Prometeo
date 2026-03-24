<?php
header("Content-Type: application/json");
include_once './dao/seguridadDAO.php';
include_once './config/database.php';

$id_usuario_target = $_GET['id'] ?? null;

if (!$id_usuario_target) {
    echo json_encode(["error" => "ID de usuario necesario"]);
    exit;
}

$db = new database();
$seguridad = new seguridadDAO($db->getConnection());

$audit = $seguridad->verificarIntegridadUsuario($id_usuario_target);
echo json_encode($audit);

?>