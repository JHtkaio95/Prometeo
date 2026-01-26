export interface AuthFactura {
    Id: number;
    fecha_hora_generacion: number;
    contenido_registro: string;
    hash_registro_actual: string;
    hash_registro_anterior: string;
    QR_URL: string;
    estado: string;
    id_usuario: number;

    tipo: string;
    numero: string;
    cliente: string;
    total: number;
}

export class Factura {
    constructor(
        public Id: number, 
        public fecha_hora_generacion: number,
        public contenido_registro: string,
        public hash_registro_actual: string,
        public hash_registro_anterior: string,
        public QR_URL: string,
        public estado: string, 
        public id_usuario: number,

        public tipo: string,
        public numero: string,
        public cliente: string,
        public total: number
    ){}

}