<?php
    include_once './config/header.php';
    include_once './config/database.php';
    include_once './dao/LoggerDAO.php';
    include_once './dao/facturaDAO.php';
    include_once './auth_middleware.php';
    include_once './StorageService.php';

    $userData = obtenerUsuarioAutenticado();
    $id_usuario = $userData->id;

    $database = new database();
    $pdo = $database->getConnection();
    $dao = new facturaDAO($pdo);
    $storage = new StorageService();
    

    try {
        $nif_emisor = $_POST['nif_emisor'] ?? null;
        $nif_cliente = $_POST['nif'] ?? null;
        $nombre_cliente = $_POST['nombre'] ?? null;
        $numero_factura = $_POST['numero'] ?? null;
        $fecha_emision = $_POST['fecha'] ?? null;
        $importe_total = $_POST['total'] ?? 0;

        if (!$nif_cliente || !isset($_FILES['archivo'])) {
            throw new Exception("Datos incompletos o archivo no subido");
        }

        $pdo->beginTransaction();

        $archivo = $_FILES['archivo'];
        $nombreArchivo = "EXTERNA_" . time() . "_" . $archivo['name'];
        $ruta_final = $storage->guardarFactura($nombreArchivo, file_get_contents($archivo['tmp_name']));
        $tipo_factura = "CERTIFICACION_EXTERNA";

        $id_factura = $dao->insertarFacturaExterno([
            'NIF' => $nif_emisor,
            'serie' => 'EXT',
            'numero' => $numero_factura,
            'fecha_emision' => $fecha_emision,
            'tipo_factura'  => $tipo_factura,
            'importe_total' => $importe_total,
            'id_usuario' => $id_usuario,
            'ruta_pdf' => $ruta_final,
            'datos_cliente' => json_encode(['nombre' => $nombre_cliente, 'nif' => $nif_cliente]),
            'estado' => "SELLADO"
        ]);

        $fileHash = hash_file('sha256', $archivo['tmp_name']);
        $contenido_legal = json_encode([
            'tipo' => $tipo_factura,
            'nif_cliente' => $nif_cliente,
            'total' => $importe_total,
            'numero_original' => $numero_factura,
            'file_sha256' => $fileHash
        ]);

        $previo_hash = $dao->getUltimoHashUsuario($id_usuario) ?: 'GENESISI_EXT_' . $id_usuario;
        $nuevo_hash = hash('sha256', $contenido_legal . $previo_hash);

        $dao->registrarSeguridad([
            'fecha' => date('Y-m-d H:i:s'),
            'id_factura' => $id_factura,
            'id_usuario' => $id_usuario,
            'contenido_registro' => $contenido_legal,
            'hash_actual' => $nuevo_hash,
            'hash_anterior' => $previo_hash,
            'tipo_evento' => 'SELLADO_EXTERNO',
            'QR_URL'       => 'EXTERNO',
            'estado'       => 'COMPLETO'
        ]);

        $logger = new LoggerDAO($pdo);
        $logger->registrar($id_usuario, 'FACTURA_CARGADA', "Subida de factura externa: $numero_factura", [
            'id_factura' => $id_factura,
            'hash' => $nuevo_hash,
            'nombre_archivo' => $nombreArchivo
        ]);

        $pdo->commit();
        echo json_encode(["status" => "ok", "message" => "Archivo sellado e inalterable", "hash" => $nuevo_hash]);

    } catch(Exception $e) {
        if($pdo->inTransaction()) {
                $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }

?>