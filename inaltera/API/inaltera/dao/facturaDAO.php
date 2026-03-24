<?php
class facturaDAO {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getUltimoHashUsuario($id_usuario) {
        $sql = "SELECT hash_actual FROM registros_facturacion 
                WHERE id_usuario = :id_usuario 
                ORDER BY id DESC LIMIT 1";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $row ? $row['hash_actual'] : null;
    }

    public function insertarFactura($data) {
        $sql = "INSERT INTO facturas (NIF, serie, numero, fecha_vencimiento, tipo_factura, base_total, descuento_total, iva_total, importe_total, estado, id_usuario, datos_cliente) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        
        $stmt->execute([
            $data['NIF'], 
            $data['serie'], 
            $data['numero'], 
            $data['fecha_vencimiento'],
            $data['tipo_factura'], 
            $data['base_total'],
            $data['descuento_total'],
            $data['iva_total'], 
            $data['importe_total'],
            $data['estado'] || 'PENDIENTE',
            $data['id_usuario'],
            $data['datos_cliente']
        ]);
        return $this->conn->lastInsertId();
    }

    public function insertarFacturaExterno($data) {
        $sql = "INSERT INTO facturas (NIF, serie, numero, fecha_emision, tipo_factura, importe_total, estado, id_usuario, datos_cliente) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        
        $stmt->execute([
            $data['NIF'], 
            $data['serie'], 
            $data['numero'], 
            $data['fecha_emision'],
            $data['tipo_factura'],
            $data['importe_total'],
            $data['estado'],
            $data['id_usuario'],
            $data['datos_cliente']
        ]);
        return $this->conn->lastInsertId();
    }

    public function insertarLinea($data) {
        $sql = "INSERT INTO factura_lineas (descripcion, cantidad, unidad, precio_unitario, descuento, tipo_IVA, importe, id_factura) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $this->conn->prepare($sql)->execute([
            $data['descripcion'], $data['cantidad'], $data['unidad'], 
            $data['precio_unitario'], $data['descuento'], $data['tipo_IVA'], 
            $data['importe'], $data['id_factura']
        ]);
    }

    public function registrarSeguridad($data) {
        $sql = "INSERT INTO registros_facturacion (
            fecha_hora_generacion,
            tipo_evento,
            contenido_registro,
            hash_actual,
            hash_anterior,
            QR_URL,
            estado,
            id_usuario,
            id_factura
            ) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )";
        $this->conn->prepare($sql)->execute([
            $data['fecha'],
            $data['tipo_evento'],
            $data['contenido_registro'],
            $data['hash_actual'],
            $data['hash_anterior'],
            $data['QR_URL'],
            $data['estado'],
            $data['id_usuario'],
            $data['id_factura']
        ]);
    }

    public function actualizarRutaPDF($id, $ruta) {
        $query = "UPDATE facturas SET pdf_path = :ruta WHERE id_factura = :id";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([':ruta' => $ruta, ':id' => $id]);
    }

    public function buscarTodas($id){
        $query = "SELECT * FROM facturas WHERE id_usuario = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function buscarCodFac($id) {
        $query = "SELECT * FROM facturas WHERE";
    }

    public function buscarPorHash($hash) {
        $query = "SELECT *
                FROM facturas 
                WHERE id_factura IN (
                    SELECT id_factura 
                    FROM registros_facturacion 
                    WHERE hash_actual = :has)";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':has', $hash);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>