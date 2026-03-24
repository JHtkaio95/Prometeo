<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; margin: 0; padding: 0; line-height: 1.4; }
        .invoice-box { max-width: 800px; margin: auto; padding: 10px; }
        
        /* --- Cabecera con Logo --- */
        .header-table { width: 100%; border-bottom: 3px solid #1a237e; margin-bottom: 20px; padding-bottom: 10px; font-size:12px;}
        .logo-container { width: 50px; height: 50px; background-color: #1a237e; border-radius: 8px; text-align: center; display: inline-block; }
        .logo-icon { color: white; font-size: 30px; font-weight: bold; line-height: 50px; }
        .brand-name { color: #1a237e; font-size: 24px; font-weight: bold; margin-left: 10px; letter-spacing: 1px; }
        .brand-sub { font-size: 9px; color: #666; text-transform: uppercase; display: block; margin-left: 12px; }
        
        /* --- Información de Factura --- */
        .info-table { width: 100%; margin-bottom: 30px; }
        .section-title { font-size: 12px; color: #1a237e; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; margin-bottom: 5px; }
        .col-50 { width: 50%; vertical-align: top; }
        
        /* --- Tabla de Productos --- */
        .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .items-table th { background: #f8f9fa; color: #1a237e; padding: 12px 10px; text-align: left; font-size: 12px; border-bottom: 2px solid #eee; }
        .items-table td { padding: 12px 10px; border-bottom: 1px solid #f1f1f1; font-size: 13px; }
        
        /* --- Totales --- */
        .total-container { float: right; width: 40%; margin-top: 20px; }
        .total-table { width: 100%; border-collapse: collapse; }
        .total-label { font-weight: bold; color: #666; padding: 5px 0; font-size: 13px; }
        .total-value { text-align: right; font-weight: bold; font-size: 15px; color: #1a237e; padding: 5px 0; }
        /* --- Pie de Página Seguridad --- */
        .footer-security { margin-top: 100px; padding-top: 20px; border-top: 1px solid #ddd; position: relative; }
        .hash-section { width: 70%; float: left; }
        .qr-section { width: 25%; float: right; text-align: center; }
        .hash-title { font-size: 10px; font-weight: bold; color: #1a237e; margin-bottom: 5px; }
        .hash-box { font-family: 'Courier', monospace; font-size: 9px; background: #f4f4f4; padding: 8px; border: 1px solid #eee; color: #444; word-break: break-all; }
        .legal-text { font-size: 9px; color: #888; margin-top: 10px; line-height: 1.2; }
        .clear { clear: both; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <table class="header-table">
            <tr>
                <td>
                    <table style="border-collapse: collapse;">
                        <td><div class="logo-container"><span class="logo-icon">↗</span></div></td>
                        <td style="vertical-align: middle;">
                            <span class="brand-name">INALTERA</span>
                            <span class="brand-sub">Sistemas de Facturación Inalterables</span>
                        </td>
                    </table>
                </td>
                <td style="text-align: right; vertical-align: middle;">
                    <span style="color: #666; width:100%; display:block;">
                        <?php echo ($input['datos_emisor'][3]) . ' ' . ($input['datos_emisor'][4]) . ' -- ' . ($input['datos_emisor'][5]) . ' ' . ($input['datos_emisor'][6]); ?>
                    </span>
                    <span style="color: #666; display:block;">
                        CIF/NIF: <?php echo ($input['datos_emisor'][2]); ?>
                    </span>
                    <span style="color: #666; display:block;">
                        E-mail: <?php echo ($input['datos_emisor'][1]) . '  Teléfono: ' . ($input['datos_emisor'][9]); ?>
                    </span>
                </td>
            </tr>
        </table>

        <table class="info-table">
            <tr>
                <td class="col-50" >
                    <div class="section-title">Cliente</div>
                    <strong><?php echo $input['cliente']['nombre']; ?></strong><br>
                    <?php echo ($input['cliente']['direccion_completa']['direccion'] ?? '') . ' ' . ($input['cliente']['direccion_completa']['localidad']); ?><br>
                    <?php echo ($input['cliente']['direccion_completa']['codigo_postal']) . ' ' . ($input['cliente']['direccion_completa']['provincia']); ?>
                    <?php echo ($input['cliente']['direccion_completa']['pais']); ?>
                    CIF/NIF: <?php echo $input['cliente']['nif']; ?><br>
                    
                </td>
                <td class="col-50" style="padding-left: 40px;">
                    <div class="section-title">Factura</div>
                    <strong><?php echo $factura['serie'] . '-' . $factura['numero']; ?></strong><br>
                    Fecha de factura: <?php echo $factura['fecha_emision']; ?>
                </td>
            </tr>
            <tr>
                <td class="col-50">
                    
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Descripción</th>
                    <th style="text-align: center;">Cantidad</th>
                    <th style="text-align: center;">Unidad</th>
                    <th style="text-align: right;">Precio Unid.</th>
                    <th style="text-align: right;">DTO%</th>
                    <th style="text-align: right;">IVA%</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($input['lineas'] as $l): ?>
                <tr>
                    <td><?php echo $l['descripcion']; ?></td>
                    <td style="text-align: center;"><?php echo $l['cantidad']; ?></td>
                    <td><?php echo $l['unidad'];?></td>
                    <td style="text-align: right;"><?php echo number_format($l['precio_unitario'], 2); ?>€</td>
                    <td><?php echo $l['descuento']?></td>
                    <td><?php echo $l['iva_porcentaje']?></td>
                    <td style="text-align: right;"><?php echo number_format($l['importe'], 2); ?>€</td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <div class="total-container">
            <table class="total-table">
                <tr>
                    <td class="total-label">Base Imponible:</td>
                    <td class="total-value"><?php echo number_format($base_total, 2); ?>€</td>
                </tr>
                <tr>
                    <td class="total-label">Descuento aplicado</td>
                    <td class="total-value"><?php echo number_format($input['descuento_total'], 2); ?>€</td>
                </tr>
                <tr>
                    <td class="total-label">IVA:</td>
                    <td class="total-value"><?php echo number_format($iva_total, 2); ?>€</td>
                </tr>
                <tr style="border-top: 2px solid #1a237e; margin-top: 10px; padding-top: 10px;" class="total-row">
                    <td class="total-label" style="color: #1a237e; font-size: 18px;">TOTAL:</td>
                    <td class="total-value" style="font-size: 22px;"><?php echo number_format($total_final, 2); ?>€</td>
                </tr>
            </table>
        </div>
        <div class="clear"></div>

        <div class="footer-security">
            <div class="hash-section">
                <div class="hash-title">HUELLA CRIPTOGRÁFICA DE SEGURIDAD (VERIFACTU)</div>
                <div class="hash-box"><?php echo $hash_verificacion; ?></div>
                <div class="legal-text">
                    Este documento es una copia auténtica del registro electrónico generado por el sistema INALTERA.<br>
                    La integridad de esta factura está garantizada mediante encadenamiento de hash SHA-256.<br>
                    <strong>ID Registro:</strong> <?php echo $id_factura; ?> | <strong>Hash Anterior:</strong> <?php echo substr($previo_secuencia_usuario, 0, 16); ?>...
                </div>
            </div>
            <div class="qr-section">
                <img src="<?php echo $qr_base64; ?>" style="width: 100px; height: 100px;">
                <div style="font-size: 8px; color: #1a237e; font-weight: bold; margin-top: 5px;">VERIFICACIÓN OFICIAL</div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</body>
</html>