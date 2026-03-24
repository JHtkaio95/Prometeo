<?php
    require_once './vendor/autoload.php';
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

    function obtenerUsuarioAutenticado() {
        $token = null;
        $key = "MisterFall-contra-HectorPlasma_yAlanzonkaNoBit";
        $headers = apache_request_headers();

        if(isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            $token = trim(str_replace('Bearer', '', $authHeader));
        } else if (isset($_GET['token'])) {
            $token = trim($_GET['token']);
        }

        if(!$token){
            http_response_code(401);
            echo json_encode(["message" => "Acceso no autorizado"]);
            exit;
        }

        try{
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            return $decoded->data;
        } catch(Exception $e){
            http_response_code(401);
            echo json_encode(["message" => "Token inválido: " . $e->getMessage()]);
            exit;
        }
    }
?>