<?php
function verificarAdminReal($pdo, $id_usuario) {
    $query = "SELECT role FROM datos_usuarios WHERE Id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->execute([':id' => $id_usuario]);
    $user = $stmt->fetch();

    if(!$user || $user['role'] !== 'adminitrador') {
        http_response_code(403);
        echo json_encode(["error" => "No tienes permisos de administrador."]);
        exit;
    }

    return true;
}
?>