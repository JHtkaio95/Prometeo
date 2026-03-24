<?php
include_once './config/header.php';
include_once './config/database.php';
include_once './dao/empresaDAO.php';
include_once './dao/LoggerDAO.php';
include_once './auth_middleware.php';
include_once './vendor/autoload.php';

$userData = obtenerUsuarioAutenticado();
$id_usuario_token = $userData->id; 

    $json = file_get_contents("php://input");
    $data = json_decode($json);

    if(!empty($data->NIF) && !empty($data->razon_social) && !empty($id_usuario_token)) {
        
        $database = new database();
        $db = $database->getConnection();
        $dao = new empresaDAO($db);

        $empresa = $dao->buscarPorUsuario($id_usuario_token);

        if(!$empresa){
            $dao->registrarEmpresa(
                $data->NIF, 
                $data->razon_social, 
                $data->domicilio_fiscal,
                $data->codigo_postal,
                $data->localidad,
                $data->provincia,
                $data->pais,
                $data->telefono_empresarial, 
                $id_usuario_token
            );

            $logger = new LoggerDAO($db);
            $logger->registrar($id_usuario_token, 'PERFIL_UPDATE', "Usuario registro empresa", [
                'datos_registrados' => $dao
            ]);

            echo json_encode(["message" => "Empresa registrada correctamente"]);
        } else {
            $dao->actualizarEmpresa(
                $data->NIF, 
                $data->razon_social, 
                $data->domicilio_fiscal,
                $data->codigo_postal,
                $data->localidad,
                $data->provincia,
                $data->pais,
                $data->telefono_empresarial, 
                $id_usuario_token
            );

            $logger = new LoggerDAO($db);
            $logger->registrar($id_usuario_token, 'PERFIL_UPDATE', "Usuario actualizo su perfil empresa:", [
                'datos_actualizados' => $dao,
                'datos_recibidos' => $data
            ]);

            echo json_encode(["message" => "Datos actualizados correctamente"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Faltan datos obligatorios (NIF o Razón Social)"]);
    }
?>