<?php
class seguridadDAO {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function verificarIntegridadUsuario($id_usuario) {
        $query = "SELECT f.id_factura, s.hash_actual, s.hash_anterior
                  FROM facturas f
                  JOIN registros_facturacion s ON f.id_factura = s.id_factura
                  WHERE f.id_usuario = :uid
                  ORDER BY f.id_factura ASC";
        $stmt = $this->pdo->prepare($query);
        $stmt->execute([':uid' => $id_usuario]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $resultado = [];
        $cadena_integra = true;

        for($i = 0; $i < count($rows); $i++) {
            $actual = $rows[$i];
            $estado = 'valido';

            if($i > 0) {
                $anterior = $rows[$i - 1];
                if($actual['hash_anterior'] !== $anterior['hash_actual']) {
                    $estado = 'corrupto';
                    $cadena_integra = false;
                }
            }

            $resultado[] = [
                'id_factura' => $actual['id_factura'],
                'estado' => $estado,
                'hash_corto' => substr($actual['hash_actual'], 0, 8) . '...'
            ];
        }

        return [
            'integro' => $cadena_integra,
            'nodos' => $resultado
        ];
    }
}

?>