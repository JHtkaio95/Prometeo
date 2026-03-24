<?php
    include_once './config/header.php';
    include_once './dao/facturaDAO.php';
    include_once './dao/LoggerDAO.php';
    include_once './config/database.php';
    include_once './auth_middleware.php';
    include_once './vendor/autoload.php';
    include_once './StorageService.php';

    use Dompdf\Dompdf;
    use Dompdf\Options;
    use chillerlan\QRCode\QRCode;
    use chillerlan\QRCode\QROptions;

    header('Content-Type: application/json');

    $userData = obtenerUsuarioAutenticado();
    $id_usuario_token = $userData->id;

    $input = json_decode(file_get_contents('php://input'), true);

    if(!$input){
        echo json_encode(['status' => 'error', 'message' => 'Datos inválidos']);
        exit;
    }

    $database = new database();
    $pdo = $database->getConnection();
    $dao = new facturaDAO($pdo);

    $nif_emisor = $input['nif_emisor'] ?? null;
    $id_usuario = $id_usuario_token; 

    if (!$nif_emisor) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "NIF Emisor no encontrado."]);
        exit;
    }

    $qrOptions = new QROptions([
        'version'    => 5,
        'outputType' => QRCode::OUTPUT_MARKUP_SVG,
        'eccLevel'   => QRCode::ECC_L,
    ]);

    $qrcode = new QRCode($qrOptions);

    try {
        $pdo->beginTransaction();
        

        $base_total = 0;
        $descuento_total = 0;
        $iva_total = 0;
        
        if (!isset($input['lineas']) || !is_array($input['lineas'])) {
            throw new Exception("La factura debe tener al menos una línea.");
        }

        foreach ($input['lineas'] as &$l) {
            $iva_porcentaje = $l['iva_porcentaje'] ?? 21;
            $cuota_iva = round($l['importe'] * ($iva_porcentaje / 100), 2);
            
            $base_total += $l['importe'];
            $iva_total += $cuota_iva;
            
            $l['unidad'] = $l['unidad'] ?? 'unid';
            $l['tipo_IVA'] = $iva_porcentaje;
        }
        unset($l);

        $total_final = $base_total + $iva_total;
        $datos_cliente_json = isset($input['cliente']) ? json_encode($input['cliente']) : '{}';

        $id_factura = $dao->insertarFactura([
            'NIF'               => $nif_emisor,
            'serie'             => $input['serie'] ?? 'SIN-SERIE',
            'numero'            => $input['numero'] ?? 0,
            'fecha_emision'     => $input['fecha_emision'] ?? date('Y-m-d'),
            'fecha_vencimiento' => $input['fecha_vencimiento'] ?? null,
            'tipo_factura'      => $input['tipo_factura'] ?? 'ORDINARIA',
            'base_total'        => $base_total,
            'descuento_total'   => $input['descuento_total'] ?? 0,
            'iva_total'         => $iva_total,
            'importe_total'     => $total_final,
            'id_usuario'        => $id_usuario,
            'datos_cliente'     => $datos_cliente_json
        ]);

        foreach ($input['lineas'] as $linea) {
            $linea['id_factura'] = $id_factura;
            $dao->insertarLinea($linea);
        }

        $datos_cliente_array = json_decode($datos_cliente_json, true);

        $contenido_legal_json = json_encode([
            'id_factura'             => $id_factura,
            'datos_emisor'           => $input['datos_emisor'],
            'serie_numero'           => ($input['serie'] ?? '') . ($input['numero'] ?? ''),
            'direccion_completa'     => $datos_cliente_array,
            'serie'                  => $input['serie'],
            'numero'                 => $input['numero'],
            'fecha_emision'          => $input['fecha_emision'],
            'fecha_vencimiento'      => $input['fecha_vencimiento'],
            'lineas'                 => $input['lineas'],
            'base_total'             => $base_total,
            'descuento_total'        => $input['descuento_total'],
            'iva_total'              => $iva_total,
            'importe_total'          => $total_final,
            'id_usuario'             => $id_usuario
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRESERVE_ZERO_FRACTION);

        $previo_secuencia_usuario = $dao->getUltimoHashUsuario($id_usuario) ?: 'GENESIS_USER_' . $id_usuario;
        
        $nuevo_hash_secuencia = hash('sha256', $contenido_legal_json. $previo_secuencia_usuario);
        
        $qr_url = "http://192.168.1.36" . ":4200/verificar/" . $nuevo_hash_secuencia;

        $dao->registrarSeguridad([
            'fecha'                  => date('Y-m-d H:i:s'),
            'id_factura'             => $id_factura,
            'id_usuario'             => $id_usuario,
            'contenido_registro'     => $contenido_legal_json,
            'hash_actual'            => $nuevo_hash_secuencia,
            'hash_anterior'          => $previo_secuencia_usuario,
            'QR_URL'                 => $qr_url,
            'tipo_evento'            => 'CREACION'
        ]);

        $qrImageData = $qrcode->render($qr_url);

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        $dompdf = new Dompdf($options);

        $factura = $input;
        $hash_verificacion = $nuevo_hash_secuencia;
        $qr_base64 = $qrImageData;

        ob_start();
        include './templates/factura_template.php';
        $html = ob_get_clean();

        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $storage = new StorageService();
        $nombreArchivo = "FACTURA_" . $id_factura . "_" . date('YhmHis') . ".pdf";
        $ruta_pdf = $storage->guardarFactura($nombreArchivo, $dompdf->output());

        $dao->actualizarRutaPDF($id_factura, $ruta_pdf);

        $pdo->commit();

        ob_clean();

        $logger = new LoggerDAO($pdo);
        $logger->registrar($id_usuario, 'FACTURA_NUEVA', "Nueva factura generada: $id_factura", [
            'factura_normal' => $id_factura,
            'factura_seguridad' => $dao,
            'datos_enviados_a_bd'  => $input
        ]);

        echo json_encode([
            "status" => "ok",
            "factura_id" => $id_factura,
            "pdf_url" => $ruta_pdf,
            "hash_seguimiento" => $nuevo_hash_secuencia
        ]);

    } catch (Exception $e) {
        if($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        ob_clean();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
?>