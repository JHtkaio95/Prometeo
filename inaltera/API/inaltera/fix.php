<?php
include_once './config/database.php';
$database = new database();
$db = $database->getConnection();

$email = "foxy@gmail.com";
$pass = "pirate";
$hash = password_hash($pass, PASSWORD_DEFAULT);

$query = "UPDATE datos_usuarios SET contrasenya = :hash WHERE email = :email";
$stmt = $db->prepare($query);
$stmt->bindParam(':hash', $hash);
$stmt->bindParam(':email', $email);

if($stmt->execute()){
    echo "Base de datos actualizada";
}
?>