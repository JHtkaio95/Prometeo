import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule, FormatWidth } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { distinctUntilChanged, filter, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [MatButtonModule, MatCommonModule, MatIconModule, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './facturacion.component.html',
  styleUrl: './facturacion.component.css'
})


export class FacturacionComponent implements OnInit {
  facturaForm: FormGroup;
  
  isElaborar: boolean = true;
  isCargar: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService){
    this.facturaForm = this.fb.group({
      company_id: [1],
      serie: ['2026-A', Validators.required],
      numero: [null, Validators.required],
      fecha_emision: [new Date().toISOString().substring(0, 10)],
      fecha_vecimiento: [''],
      tipo_factura: ['ORDINARIA'],
      cliente: this.fb.group({
        nombre: ['', Validators.required],
        nif: ['', Validators.required],
        direccion_completa: this.fb.group({
          direccion: [''],
          codigo_postal: [''],
          localidad: [''],
          provincia: [''],
          pais: ['']
        })
      }),
      lineas: this.fb.array([])
    });
    this.agregarLinea();
  }

  ngOnInit(): void {
  }


  get lineas() {return this.facturaForm.get('lineas') as FormArray; }

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

  agregarLinea() {
    const linea = this.fb.group ({
      descripcion: '',
      cantidad: 1,
      unidad: 'Und',
      precioUnitario: 0,
      descuentoPorcentaje: 0,
      ivaPorcentaje: 21 
    });
    this.lineas.push(linea);
  }

  eliminarLinea(index: number) {
    if(this.lineas.length > 1) {
      this.lineas.removeAt(index);
    } else {
      this.lineas.at(0).reset({
        descripcion: '',
        cantidad: 1,
        unidad: 'Und',
        precioUnitario: 0,
        descuentoPorcentaje: 0,
        ivaPorcentaje: 21 });
    }
  }

  getImporteLinea(index: number): number {
    const linea = this.lineas.at(index).value;
    const bruto = (linea.cantidad || 0) * (linea.precioUnitario || 0);
    const descuento = bruto * ((linea.descuentoPorcentaje || 0) / 100);
    
    return bruto - descuento;
  }

  getImporteBruto(index: number): number {
    const linea = this.lineas.at(index).value;
    return (linea.cantidad || 0) * (linea.precioUnitario || 0);
  }

  getDescuento(index: number): number {
    const linea = this.lineas.at(index).value;
    const bruto = (linea.cantidad || 0) * (linea.precioUnitario || 0);
    const descuento = bruto * ((linea.descuentoPorcentaje || 0) / 100);
    
    return descuento;
  }
  
  get subtotal(): number {
    return this.lineas.controls.reduce((acc, _, linea) => acc + this.getImporteLinea(linea), 0);
  }

  get bruto(): number {
    return this.lineas.controls.reduce((acc, _, linea) => acc + this.getImporteBruto(linea), 0);
  }

  get descuento(): number {
    return this.lineas.controls.reduce((acc, _, linea) => acc + this.getDescuento(linea), 0);
  }

  get totalIva(): number {
    return this.lineas.controls.reduce((acc, control, index) => {
      const linea = control.value;
      const importeNeto = this.getImporteLinea(index);
      return acc + (importeNeto * ((linea.ivaPorcentaje || 0) / 100));
    }, 0);
  }

  get totalFactura(): number {
    return this.subtotal + this.totalIva;
  }

  registrarFactura(){
    this.authService.crearFactura("sas");
  }

  limpiarCamposFormulario() {
    this.facturaForm.reset({});
  }
}