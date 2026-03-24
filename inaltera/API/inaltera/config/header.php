<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowedOrigins = [
    'http://inaltera:4200',
    'https://inaltera:4200',
    'http://localhost:4200',
    'https://localhost:4200',
    'http://192.168.1.36:4200',
    'https://192.168.1.36:4200',
    'https://192.168.201.22:4200',
    'http://192.168.201.22:4200'
];


if(in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
}

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

?>