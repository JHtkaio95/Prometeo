<?php
    ob_start();
    include_once './config/header.php';
    include_once './config/database.php';
    include_once './dao/LoggerDAO.php';
    include_once './auth_middleware.php';

    $userData = obtenerUsuarioAutenticado();
    $id_factura = $_GET['id'] ?? null;

    if(!$id_factura) exit("ID de factura no proporcionado");

    $database = new database();
    $db = $database->getConnection();

    $query = "SELECT f.*, r.contenido_registro, r.hash_actual
              FROM facturas f
              JOIN registros_facturacion r ON f.id_factura = r.id_factura
              WHERE f.id_factura = :id AND f.id_usuario = :uid";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id_factura);
    $stmt->bindParam(':uid', $userData->id);
    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$data) exit ("Factura no encontrada");

    $json = json_decode($data['contenido_registro'], true);

    $xml = new SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><FacturaInalterable></FacturaInalterable>');
    
    $seguridad = $xml->addChild('SeguridadCriptografica');
    $seguridad->addChild('HashSeguridad', $data['hash_actual']);

    $emisor = $xml->addChild('Emisor');
    $emisor->addChild('NIF', (string)$json['datos_emisor'][2]);
    $emisor->addChild('Nombre', (string)$json['datos_emisor'][3]);
    $dirEmisor = $emisor->addChild('DireccionFiscal');
    $dirEmisor->addChild('Calle', (string)$json['datos_emisor'][4] ?? '');
    $dirEmisor->addChild('CodigoPostal', (string)$json['datos_emisor'][5] ?? '');
    $dirEmisor->addChild('Localidad', (string)$json['datos_emisor'][6] ?? '');
    $dirEmisor->addChild('Provincia', (string)$json['datos_emisor'][7] ?? '');
    $dirEmisor->addChild('Pais', (string)$json['datos_emisor'][8] ?? '');

    $receptor = $xml->addChild('Receptor');
    $receptor->addChild('NIF', (string)$json['direccion_completa']['nif']);
    $receptor->addChild('Nombre', (string)$json['direccion_completa']['nombre']);
    
    $subDireccion = $json['direccion_completa']['direccion_completa'];
    $dirReceptor = $receptor->addChild('Direccion');
    $dirReceptor->addChild('Calle', (string)$subDireccion['direccion']);
    $dirReceptor->addChild('CodigoPostal', (string)$subDireccion['codigo_postal']);
    $dirReceptor->addChild('Localidad', (string)$subDireccion['localidad']);
    $dirReceptor->addChild('Provincia', (string)$subDireccion['provincia']);
    $dirReceptor->addChild('Pais', (string)$subDireccion['pais']);
    

    $info = $xml->addChild('DatosFactura');
    $info->addChild('Serie', (string)$json['serie']);
    $info->addChild('Numero', (string)$json['numero']);
    $info->addChild('FechaEmision', (string)$json['fecha_emision']);
    $info->addChild('FechaVencimineto', (string)$json['fecha_vencimiento']);

    $lineasXML = $xml->addChild('Items');
    foreach ($json['lineas'] as $item) {
        $linea = $lineasXML->addChild('Linea');
        $linea->addChild('Descripcion', (string)$item['descripcion']);
        $linea->addChild('Cantidad', (string)$item['cantidad']);
        $linea->addChild('PrecioUnitario', (string)$item['precio_unitario']);
        $linea->addChild('TipoIVA', (string)$item['tipo_IVA']);
        $linea->addChild('ImporteTotal', (string)$item['importe']);
    }

    $totales = $xml->addChild('Totales');
    $totales->addChild('BaseImponible', (string)$json['base_total']);
    $totales->addChild('CuotaIVA', (string)$json['iva_total']);
    $totales->addChild('Total', (string)$json['importe_total']);
    
    $dom = new DOMDocument("1.0");
    $dom->preserveWhiteSpace = false;
    $dom->formatOutput = true;
    $dom->loadXML($xml->asXML());

    ob_end_clean();

    header('Content-Type: application/xml; charset=UTF-8');
    $nombreArchivo = "INALTERA_" . $json['serie'] . "_" . ($json['numero'] ?? $data['numero']) . ".xml";
    header('Content-Disposition: attachment; filename="' . $nombreArchivo . '"');
    header('Cache-Control: max-age=0');

    $logger = new LoggerDAO($db);
    $logger->registrar($userData->id, 'FACTURA_XML_DESCARGADA', "Descarga de factura en formato XML ID: $id_factura", [
        'id_factura' => $id_factura,
        'nombre_archivo' => $nombreArchivo
    ]);

    echo $dom->saveXML();
    exit;
?>