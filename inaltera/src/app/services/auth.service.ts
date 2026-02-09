import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Auth, User } from '../modelos/auth-modelo';
import { AuthEmpresa, Empresa } from '../modelos/empresa-modelo';
import { AuthFactura } from '../modelos/factura-modelo';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public avail: boolean = false;
  public msg: string = "";

  private isAuthenticated = false;
  private redirectUrl: string | null = null;
  private authToken: string | null = null;
  private siteKey = '';
  private secretKey = '';
  private usa!: Auth;

  private readonly TOKEN_KEY = 'token_Data';
  private readonly USER_DATA_KEY = 'USER_Data';
  private readonly EMPRESA_DATA_KEY = 'Empresa_Data';
  private readonly SESSION_EXPIRY_KEY = 'sessionExpiryData';
  private readonly SESSION_DURATION = 5 * 24 * 60 * 60 * 1000;

  private empresa = this.buscarEmpresaParaUsuario();

  apiURLUsers = environment.apiUrlLocal;
  apiURLUsersLocal = environment.apiUrlLocal;
  apiURLGoogleLogin = environment.apiUrl + 'GoogleLogin';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  createUser(email: string, contrasenya: string): Observable<Auth> {
    return this.http.post<Auth>(`${this.apiURLUsers}/registro.php`, {email, contrasenya});
  }

  crearEmpresa(NIF: string, razon_social: string, domicilio_fiscal: string, codigo_postal: string, localidad: string, provincia: string, pais: string, telefono_empresarial:number, id_usuario: number): Observable <AuthEmpresa>{
    return this.http.post<AuthEmpresa>(`${this.apiURLUsers}/registrarEmpresa.php`, {NIF, razon_social, domicilio_fiscal, codigo_postal, localidad, provincia, pais, telefono_empresarial, id_usuario});
  }

  crearFactura(datos: any): Observable<AuthFactura>{
    return this.http.post<AuthFactura>(`${this.apiURLUsers}/registrarFactura.php`, datos);
  }

  cambiarTarifa(tarifa: number): Observable<any> {
    return this.http.post<any>(`${this.apiURLUsers}/cambiarTarifa.php`, {tarifa});
  }

  loginUser(email: string, contrasenya: string): Observable<Auth> {
    return this.http.post<Auth>(`${this.apiURLUsers}/login.php`, {email, contrasenya})
      .pipe (
        tap(user => {
          if(user.token) {
            this.setUserSession(user);
          }
        })
      );
  }

  buscarEmpresaParaUsuario(): Observable<any> {
    return this.http.get<any>(`${this.apiURLUsers}/getEmpresa.php`);
  }

  getFacturas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiURLUsers}/getFacturas.php`);
  }

  ActualizarUserSession(): Observable<Auth>{
    return this.http.get<Auth>(`${this.apiURLUsers}/getDatosUsuario.php`)
      .pipe(
        tap(newData => {
          // 1. Recuperamos lo que ya tenemos en sesión para no perder el token actual
          const currentData = JSON.parse(sessionStorage.getItem("USER_Data") || '{}');

          // 2. Fusionamos: mantenemos el token viejo pero actualizamos los datos nuevos
          const updatedUser = { 
              ...currentData, // Mantiene el token y datos previos
              ...newData      // Sobrescribe con la nueva tarifa, etc.
          };

          // 3. Guardamos y actualizamos el estado de la app
          this.setUserSession(updatedUser);
          console.log("✅ Sesión sincronizada con la base de datos");
        })
      );
  }
  
  setUserSession(user: Auth): void {
    if(user && user.token) {
      const data = {
        id_usuario: user.id,
        email: user.email,
        tarifa: user.tarifa,
        factura_usadas: user.facturas_usadas,
        limite_facturas: user.limite_facturas,
        role: user.role,
        token: user.token
      };
      this.usa = user;
      this.authToken = user.token;
      
      this.setStorageItem(this.TOKEN_KEY, user.token);
      this.setStorageItem(this.USER_DATA_KEY, JSON.stringify(data));
      this.setSessionExpiry();
      this.isAuthenticated = true;

      if(user.role === undefined) {
        const redirectUrl = this.getRedirectUrl();
        this.setRedirectUrl(redirectUrl || '/panel');
      }
    } else {
      console.error('Token de usuario es indefinido');
      this.isAuthenticated = false;
    }
  }

  private setStorageItem(key: string, value: string): void{
    sessionStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  private setSessionExpiry(): void {
    const expiryTime = new Date().getTime() + this.SESSION_DURATION;
    sessionStorage.setItem(this.SESSION_EXPIRY_KEY, expiryTime.toString());
  }

  private checkSessionExpiry(): void {
    const expiryTime = sessionStorage.getItem(this.SESSION_EXPIRY_KEY);
    if(expiryTime) {
      const currentTime = new Date().getTime();
      if(currentTime >= +expiryTime) {
        this.logout();
      }
    }
  }

  isLoggedIn(): boolean {
    this.checkSessionExpiry();
    this.authToken = this.getToken();
    return !!this.authToken;
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    this.removeStorageItem(this.TOKEN_KEY);
    this.removeStorageItem(this.USER_DATA_KEY);
    localStorage.removeItem("loged");
    sessionStorage.removeItem(this.SESSION_EXPIRY_KEY);
    this.clearSessionStorage();
    this.isAuthenticated = false;
    this.authToken = null;
    this.router.navigate(['/auth']);
  }

  clearSessionStorage(): void {
    sessionStorage.clear();
  }

  forgotInstructorcontrasenya(email: string):Observable<any> {
    return this.http.post(`${this.apiURLUsers}/forgot-contrasenya`, { email });
  }

  resetUsercontrasenya(token: string, newcontrasenya: string): Observable<any> {
    return this.http.post(`${this.apiURLUsers}/reset-contrasenya/${token}`, { newcontrasenya });
  }

  requestcontrasenyaResey(email: string): Observable<any> {
    return this.http.post(`${this.apiURLUsers}/forgot-contrasenya`, { email });
  }

  veriry(token: string): Observable<any> {
    
    return this.http.get(`${this.apiURLUsers}/verify/${token}`);
  }

  verifyHcaptcha(response: string): Observable<any>{
    const requestBody = { secret: this.secretKey, response };
    return this.http.post(`${this.apiURLUsers}/verify-hcaptcha`, requestBody);
  }

  getSiteKey(): string {
    return this.siteKey;
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    const url = this.redirectUrl;
    this.redirectUrl = null;
    return url;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  

}
