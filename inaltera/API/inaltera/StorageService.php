<?php
class StorageService {
    private $base_path;

    public function __construct() {
        $this->base_path = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'facturas' . DIRECTORY_SEPARATOR;
    }

    public function guardarFactura($nombreArchivo, $contenidoPDF) {

        if(!is_dir($this->base_path)){
            if (!mkdir($this->base_path, 0777, true)) {
                throw new Exception("No se pudo crear la carpeta en: " . $this->base_path);
            }
        }

        $rutaCompleta = $this->base_path . $nombreArchivo;

        if(file_put_contents($rutaCompleta, $contenidoPDF) === false) {
            throw new Exception("Error de permisos al escribir el PDF ");
        }

        return 'uploads/facturas/' . $nombreArchivo;

        /* PREPARADO PARA S3 (futuro):
        $s3->putObject([
            'Bucket' => 'tus-facturas-bucket',
            'Key'    => 'facturas/' . $nombreArchivo,
            'Body'   => $contenidoPDF
        ]);
        return $s3->getObjectUrl(...);
        */
    }
}

?>