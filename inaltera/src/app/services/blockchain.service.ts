import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface EstadoSeguridad {
  integro: boolean;
  nodos: any[];
  auditando: boolean;
  ultimaRevision: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private url = this.authService.apiURLUsers + "/audit_chain.php";


  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private seguridadSubject = new BehaviorSubject<EstadoSeguridad>({
    integro: true,
    nodos: [],
    auditando: false,
    ultimaRevision: null
  });

  public seguridad$ = this.seguridadSubject.asObservable();

  auditarUsuario(id:number): Observable<any> {
    return this.http.get(`${this.url}/watcherBlockchain.php?id=${id}`);
  }

  auditarMiUsuario(): Observable<any> {
    return this.http.get(`${this.url}/audit_chain.php`);
  }

  verificarIntegridad(): void {
    const estadoActual = this.seguridadSubject.value;
    this.seguridadSubject.next({ ...estadoActual, auditando: true });

    this.http.get<any>(this.url).subscribe({
      next: (res) => {
        this.seguridadSubject.next({
          integro: res.integro,
          nodos: res.nodos,
          auditando: false,
          ultimaRevision: new Date()
        });
      },
      error: () => {
        this.seguridadSubject.next({
          ...estadoActual,
          integro: false,
          auditando: false
        });
      }
    });
  }

  obtenerEstadoActual() {
    return this.seguridadSubject.value;
  }
}
