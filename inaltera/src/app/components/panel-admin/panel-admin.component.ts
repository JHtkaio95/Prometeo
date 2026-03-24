import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCommonModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { mapToCanMatch } from '@angular/router';
import { BlockchainService } from '../../services/blockchain.service';
import { UsoSeguridadComponent } from '../uso-seguridad/uso-seguridad.component';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatCheckboxModule, MatCommonModule,
    FormsModule, UsoSeguridadComponent
  ],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent implements OnInit{
  @ViewChild('irisGroup', { static: false }) irisGroup!: ElementRef;
  
  esAdmin = false;
  idBusqueda: number | null = null;
  modoMantenimiento = false;
  seguirRaton = false;

  nodos: any[] = [];
  estadoMirador: 'idle' | 'buscando' | 'error' | 'ok' = 'idle';

  constructor(
    private authService: AuthService,
    private blockchainService: BlockchainService,
    private renderer: Renderer2
  ){}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.esAdmin = user?.role === 'administrador';
    });
  }

  refrescarAuditoria() {
    
  }

  lanzarMirador() {
    if (!this.idBusqueda) return;

    this.estadoMirador = 'buscando';
    this.blockchainService.auditarUsuario(this.idBusqueda).subscribe({
      next: (res) => {
        this.nodos = res.nodos;
        this.estadoMirador = res.integro ? 'ok' : 'error';
      },
      error: () => this.estadoMirador = 'error'
    });
  }


  toggleMantenimiento() {
    if(this.modoMantenimiento) {
      this.modoMantenimiento = false;
    } else {
      this.modoMantenimiento = true;
    }
  }

  limpiarCacheGlobal() {
    console.log(`Iniciando limpieza de cache por usuario: ${this.idBusqueda}`);
  }

  ejecutarMiradorManual(id: number | null) {
    console.log(`Iniciando auditoria blockchain para usuario: ${id}`);
    
  }

}
