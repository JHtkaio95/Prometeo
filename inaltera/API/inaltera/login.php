<?php

    include_once './config/header.php';
    include_once './dao/usuarioDAO.php';
    include_once './dao/empresaDAO.php';
    include_once './dao/LoggerDAO.php';
    include_once './config/database.php';
    include_once './vendor/autoload.php';
    include_once './auth_middleware.php';

    use Firebase\JWT\JWT;

    $key = "MisterFall-contra-HectorPlasma_yAlanzonkaNoBit";

    $json = file_get_contents("php://input");
    $data = json_decode($json);

    if($data && isset($data->email) && isset($data->contrasenya)){
        $database = new database();
        $db = $database->getConnection();
        $dao = new usuarioDAO($db);
        $daoEmpresa = new empresaDAO($db);

        $user = $dao->buscarPorCorreo($data->email);
        $empresa = $daoEmpresa->buscarPorUsuario($user['Id']);
        $estado = $dao->obtenerEstadoSuscripcion($user['Id']);

        if($user && password_verify(trim($data->contrasenya), trim($user['contrasenya']))) {
            $empresa = $daoEmpresa->buscarPorUsuario($user['Id']);
            
            if (!$empresa) {
                $empresa = [
                    'razon_social' => null, 
                    'domicilio_fiscal' => null, 
                    'NIF' => null, 
                    'telefono_empresarial' => null, 
                    'id_usuario' => $user['Id']
                ];
            }

            $payload = [
                "iat" => time(),
                "exp" => time() + 3600,
                "data" => [
                    "id" => $user['Id'],
                    "email" => $user['email'],
                    "role" => $user['role'] ?? 'usuario'
                ]
            ];

            $jwt = JWT::encode($payload, $key, 'HS256');

            
            $respuesta = [
                "token" => $jwt,
                "id" => $user['Id'],
                "email" => $user['email'],
                "tarifa" => $user['id_tarifa'],
                "nombre_tarifa" => $estado['nombre_tarifa'],
                "role" => $user['role'] ?? 'user',
                "limite_facturas" => (int)$estado['maximo_facturas'],
                "facturas_usadas" => (int)$estado['facturas_usadas'],
                "esVerificado" => (boolean)$user['es_verificado']
            ];
            
            $logger = new LoggerDAO($db);
            $logger->registrar($user['Id'], 'LOGIN', "Usuario accedio a su cuenta", [
                'token_generado' => $jwt,
                'respuesta' => $respuesta
            ]);

            echo json_encode($respuesta);
        }else {
            http_response_code(401);
            echo json_encode(["message" => "Usuario o contraseña incorrectos."]);
        }

    } else {
        echo json_encode(["message" => "Error faltan datos aqui..."]);
    }
?>