<?php
class LoggerDAO {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function registrar($id_usuario, $tipo_evento, $descripcion, $detalles = []) {
        try {
            $query = "INSERT INTO logs_sistema (id_usuario, tipo_evento, descripcion, detalles_json, ip_origen)
                      VALUES (:uid, :tipo, :desc, :json, :ip)";

            $stmt = $this->pdo->prepare($query);
            $stmt->execute([
                ':uid'  => $id_usuario,
                'tipo'  => $tipo_evento,
                ':desc' => $descripcion,
                ':json' => json_encode($detalles, JSON_UNESCAPED_UNICODE),
                ':ip'   => $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'
            ]);
            return true;
        } catch (Exception $e) {
            error_log("Error en Logger: " . $e->getMessage());
            return false;
        } 
    }
}

?>