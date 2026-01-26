import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { RegistroFacturasComponent } from '../../components/registro-facturas/registro-facturas.component';
import { FacturacionComponent } from '../../components/facturacion/facturacion.component';
import { DatosEmpresaComponent } from '../../components/datos-empresa/datos-empresa.component';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-panel-usuario',
  standalone: true,
  imports: [MatButtonModule, MatCommonModule, MatIconModule,
    CommonModule, DatosEmpresaComponent, RegistroFacturasComponent,
    FacturacionComponent
  ],
  templateUrl: './panel-usuario.component.html',
  styleUrl: './panel-usuario.component.css'
})
export class PanelUsuarioComponent implements OnInit{

  subPaginas: boolean[] = [false, true, false,];
  isBarraActiva: boolean = false;
  email!: string;
  razon_social: string = "";

  constructor(private authService: AuthService){}

  ngOnInit(){
    const dataString = sessionStorage.getItem("USER_Data");

    if(dataString) {
      const data = JSON.parse(dataString);

      this.email = data['email'];
    }
  }

  logout(){
    this.authService.logout();
  }

  cambiarBarra(){
    if(this.isBarraActiva){
      this.isBarraActiva = false;
    } else {
      this.isBarraActiva = true;
    }
  }

  funcionBarra(index: number){
    this.activarContenido(index);
    this.desactivarBarra();
  }

  desactivarBarra() {
    if(this.isBarraActiva) {
      this.isBarraActiva = false;
    }
  }

  activarContenido(index: number){
    for(let i = 0; i < this.subPaginas.length; i++){
      this.subPaginas[i] = false;
    }

    this.subPaginas[index] = true;

  }

}
