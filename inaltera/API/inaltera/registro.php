<?php

    include_once './config/header.php';
    include_once './dao/usuarioDAO.php';
    include_once './dao/LoggerDAO.php';
    include_once './config/database.php';
    include_once './vendor/autoload.php';
    include_once './auth_middleware.php';

    use Firebase\JWT\JWT;
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->email) && !empty($data->contrasenya)) {
            $database = new database();
            $db = $database->getConnection();
            $dao = new usuarioDAO($db);
            $logger = new LoggerDAO($db);
            

            $usuario = $dao->buscarPorCorreo($data->email);

            if(!$usuario){
                $tokenVer = bin2hex(random_bytes(32));

                $id_usuario = $dao->registrarUsuario($data->email, $data->contrasenya, $tokenVer);
                
                if($id_usuario) {
                    $enlace = "http://sdas/verificar-cuenta?token=" . $tokenVer;
                    $emailEnviado = enviarCorreoVerificacion($data-Zemail, $enlace);

                    $logger->registrar($id_usuario, 'NUEVO_USUARIO', "Nuevo usuario registrado: $dao", [
                        'correo_usuario' => $usuario,
                        'email_enviado' => $emailEnviado
                    ]);

                    echo json_encode(["status" => "success", "message" => "Usuario registrado con éxito"]);
                }
            } else {
                http_response_code(401);
                echo json_encode(["[message" => "Este usuario ya existe"]);
            }

            

        } else {
            http_response_code(401);
            echo (["message]" => "Faltan datos para registrar usuario."]);
        }

function enviarCorreoVerificacion($email, $enlace) {
    $correoFrom = "silvajhonataheyber@gmail.com";

    $asunto = "Activa tu cuenta en INALTERA";
    $mensaje = "Bienvenido a INALTERA. Haz clicl aquí para verificar tu cuenta: " . $enlace;
    $cabeceras = "FROM: " . $correoFrom;

    return mail($email, $asunto, $mensaje, $cabeceras);
}
?>