export interface AuthEmpresa {
    NIF: string;
    razon_social: string;
    domicilio_fiscal: string;
    codigo_postal: string;
    localidad: string;
    provincia: string;
    pais: string;
    telefono_empresarial: number;
    id_usuario: number;
}

export class Empresa {
    constructor(
        public NIF: string,
        public razon_social: string,
        public domicilio_fiscal: string,
        public codigo_postal: string,
        public localidad: string,
        public provincia: string,
        public pais: string,
        public telefono_empresarial: number,
        public id_usuario: number
    ){}
}