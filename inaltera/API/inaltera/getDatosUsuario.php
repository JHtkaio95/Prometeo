<?php
    include_once './config/header.php';
    include_once './config/database.php';
    include_once './dao/usuarioDAO.php';
    include_once './auth_middleware.php';

    use Firebase\JWT\JWT;

    $key = "MisterFall-contra-HectorPlasma_yAlanzonkaNoBit";

    $userData = obtenerUsuarioAutenticado();
    $id_usuario = $userData->id;

    try {
        $database = new database();
        $db = $database->getConnection();
        $dao = new usuarioDAO($db);

        $usuario = $dao->getUsuario($id_usuario);

        $estado = $dao->obtenerEstadoSuscripcion($id_usuario);

        if($usuario) {
            $payload = [
                "iat" => time(),
                "exp" => time() + 3600,
                "data" => [
                    "id" => $usuario['Id'],
                    "email" => $usuario['email'],
                    "role" => $usuario['role'] ?? 'usuario'
                ]
            ];

            $jwt = JWT::encode($payload, $key, 'HS256');

            $respuesta = [
                "token" => $jwt,
                "id" => $usuario['Id'],
                "email" => $usuario['email'],
                "tarifa" => $usuario['id_tarifa'],
                "nombre_tarifa" => $estado['nombre_tarifa'],
                "role" => $usuario['role'] ?? 'usuario',
                "limite_facturas" => (int)$estado['maximo_facturas'],
                "facturas_usadas" => (int)$estado['facturas_usadas']
            ];

            echo json_encode($respuesta);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Usuario no existe"]);
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["Error" => $e]);
    }
?>