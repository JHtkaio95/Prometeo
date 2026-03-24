import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { RegistroFacturasComponent } from '../../components/registro-facturas/registro-facturas.component';
import { FacturacionComponent } from '../../components/facturacion/facturacion.component';
import { DatosEmpresaComponent } from '../../components/datos-empresa/datos-empresa.component';
import { AuthService } from '../../services/auth.service';
import { UsoSuscripcionComponent } from '../../components/uso-suscripcion/uso-suscripcion.component';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PanelAdminComponent } from '../../components/panel-admin/panel-admin.component';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { BlockchainService } from '../../services/blockchain.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { UsoSeguridadComponent } from '../../components/uso-seguridad/uso-seguridad.component';

@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [MatButtonModule, MatCommonModule, MatIconModule,
    CommonModule, DatosEmpresaComponent, RegistroFacturasComponent,
    FacturacionComponent, UsoSuscripcionComponent, 
    RouterOutlet, RouterLink, RouterLinkActive,
    PanelAdminComponent, MatSlideToggleModule,
    FormsModule, MatCheckboxModule,
    UsoSeguridadComponent
  ],
  templateUrl: './panel-usuario.component.html',
  styleUrl: './panel-usuario.component.css'
})
export class PanelUsuarioComponent implements OnInit{

  isBarraActiva: boolean = true;
  isAdminBar: boolean = false;
  email!: string;
  razon_social: string = "";

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

  ngOnInit(){
    const dataString = sessionStorage.getItem("USER_Data");

    if(dataString) {
      const data = JSON.parse(dataString);
      this.email = data['email'];
    }

    this.authService.user$.subscribe(user => {
      this.esAdmin = this.authService.isAdmin();
      console.log("Haber")
    });
  }

  logout(){
    this.authService.logout();
  }

  funcionBarra(){
    this.desactivarBarra();
  }

  cambiarBarra(){
    this.isBarraActiva = !this.isBarraActiva;
  }

  desactivarBarra() {
    if(this.isBarraActiva) {
      this.isBarraActiva = false;
    }
  }

  cambiarAdmin() {
    this.isAdminBar = ! this.isAdminBar;
  } 


  // FUNCIONES DE ADMINISTRACION

  @ViewChild('irisGroup', { static: false }) irisGroup!: ElementRef;
    
    
  
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
