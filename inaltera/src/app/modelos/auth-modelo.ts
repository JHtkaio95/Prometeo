export interface Auth {
    id: number;
    token:string;
    tarifa:number;
    nombre_tarifa:string;
    facturas_usadas: number;
    limite_facturas: number;
    email:string;
    role?: string;
    esVerificado: boolean;
}

export class User {
    constructor(
        public id: number,
        public email: string,
        public tarifa: number,
        public nombre_tarifa: string,
        public facturas_usadas: number,
        public limite_facturas: number,
        public token: string,
        public role: string,
        public esVerificado: boolean
    ){}
}