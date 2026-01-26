export interface Auth {
    id: number;
    token:string;
    email:string;
    role?: string;
}

export class User {
    constructor(
        public id: number,
        public email: string,
        public token: string,
        public role: string,
    ){}
}