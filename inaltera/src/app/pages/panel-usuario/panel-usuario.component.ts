import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { RegistroFacturasComponent } from '../../components/registro-facturas/registro-facturas.component';
import { FacturacionComponent } from '../../components/facturacion/facturacion.component';
import { DatosEmpresaComponent } from '../../components/datos-empresa/datos-empresa.component';


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
export class PanelUsuarioComponent {

  subPaginas: boolean[] = [false, true, false,];

  activarContenido(index: number){
    for(let i = 0; i < this.subPaginas.length; i++){
      this.subPaginas[i] = false;
    }

    this.subPaginas[index] = true;

  }

}
