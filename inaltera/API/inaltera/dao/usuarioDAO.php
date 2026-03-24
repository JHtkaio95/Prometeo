<?php
class usuarioDAO {

    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function conectarUsuario($email, $contrasenya) {
        try {
            $query = "SELECT * FROM datos_usuarios WHERE email = :email";
            $stmt = $this->conn->prepare($query);
            $contrasenya_hasheada = password_hash($contrasenya, PASSWORD_DEFAULT);

            $stmt->bindParam(':email', $email);

            $stmt->execute();
            
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if($user){
                if(password_verify($contrasenya, $user['contrasenya'])){
                    return $user;
                }
            } 

            return false;
        } catch (PDOException $e) {
            error_log("Error en login: " . $e->getMessage());
            return false;
        }
    }

    public function registrarUsuario($email, $contrasenya, $tokenVer) {
        $query = "INSERT INTO datos_usuarios (email, contrasenya, token_verificacion) VALUES (:email, :contra, :tokenVer)";
        $stmt = $this->conn->prepare($query);
        $contrasenya_hasheada = password_hash($contrasenya, PASSWORD_DEFAULT);
        
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':contra', $contrasenya_hasheada);
        $stmt->bindParam(':tokenVer', $tokenVer);

        return $stmt->execute();
    }

    public function cambiarTarifa($id, $idTarifa){
        $query = "UPDATE datos_usuarios SET id_tarifa = :tarifa WHERE Id = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':tarifa', $idTarifa);
        $stmt->bindParam(':id', $id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function usuarioExiste($email){
        $query = "SELECT * FROM datos_usuarios WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':email', $email);

        if($stmt->execute()->next()){
            return true;
        }

        return false;
    }

    public function getUsuario($id) {
        $query = "SELECT * FROM datos_usuarios WHERE Id = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function obtenerEstadoSuscripcion($id_usuario) {
        $query = "SELECT
                t.maximo_facturas,
                t.nombre as nombre_tarifa,
                (SELECT COUNT(*) FROM facturas f
                WHERE f.id_usuario = u.id
                AND MONTH(f.fecha_emision) = MONTH(CURRENT_DATE())
                AND YEAR(f.fecha_emision) = YEAR(CURRENT_DATE())
                ) as facturas_usadas
            FROM datos_usuarios u
            INNER JOIN tarifas t ON u.id_tarifa = t.Id
            WHERE u.id = :id_usuario";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function buscarPorCorreo($email) {
        $query = "SELECT * FROM datos_usuarios WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':email', $email);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

?>