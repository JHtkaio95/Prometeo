export interface Auth {
    id: number;
    token:string;
    tarifa:number;
    facturas_usadas: number;
    limite_facturas: number;
    email:string;
    role?: string;
}

export class User {
    constructor(
        public id: number,
        public email: string,
        public tarifa: number,
        public facturas_usadas: number,
        public limite_facturas: number,
        public token: string,
        public role: string,
    ){}
}