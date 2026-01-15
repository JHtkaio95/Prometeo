import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [MatButtonModule, MatCommonModule, MatIconModule, CommonModule,
    FormsModule
  ],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.css'
})
export class FacturacionComponent {

  
  isElaborar: boolean = true;
  isCargar: boolean = false;

  lineasConceptos = [
    { clienteId: '', cantidad: 1, precio: 0}
  ];
  
  clientes = [
    { id: 1, nombre: 'juez'},
    { id: 2, nombre: 'carl'},
    { id: 3, nombre: 'nort'}
  ];

  agregarConcepto(){
    this.lineasConceptos.push({ clienteId: '', cantidad: 1, precio: 0});
  }

  reducirConcepto(index: number){
    if(this.lineasConceptos.length > 1) {
      this.lineasConceptos.splice(index, 1);
    }
  }

  cambiarVentana(index: number){
    if(index === 0){
      if(!this.isElaborar){
        this.isElaborar = true;
        this.isCargar = false;
      }
    } else if (index === 1){
      if(!this.isCargar) {
        this.isCargar = true;
        this.isElaborar = false;
      }
    }
  }

  get subtotal(): number {
    return this.lineasConceptos.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
  }

  get iva(): number {
    return this.subtotal * 0.21;
  }

  get total(): number {
    return this.subtotal + this.iva;
  }

}
