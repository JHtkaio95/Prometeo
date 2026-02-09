import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule, DatePipe, FormatWidth } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { distinctUntilChanged, filter, debounceTime, switchMap } from 'rxjs';
import { Router } from '@angular/router';

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
  facturaForm = this.fb.group({
    company_id: [1],
    serie: ['2026-A', Validators.required],
    numero: [null, Validators.required],
    fecha_emision: [this.getNowIso()],
    fecha_vencimiento: [this.getNowIso()],
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
  
  isElaborar: boolean = true;
  isCargar: boolean = false;
  limiteAlcanzado: boolean = false;
  infoSuscripcion = { usadas: 0, max: 0};

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){
    this.agregarLinea();
  }

  ngOnInit(): void {
    this.checkLimites();
  }

  checkLimites() {
    const user = JSON.parse(sessionStorage.getItem("USER_Data") || '{}');
    this.infoSuscripcion.usadas = user.facturas_usadas || 0;
    this.infoSuscripcion.max = user.limite_facturas || 0;

    if(this.infoSuscripcion.max > 0 && this.infoSuscripcion.usadas >= this.infoSuscripcion.max) {
      this.limiteAlcanzado = true;
    }
  }

  irAPlanes() {
    this.router.navigateByUrl("/panel");
  }

  getNowIso(): string {
    const now = new Date();

    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
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
      precio_unitario: 0,
      descuento: 0,
      iva_porcentaje: 21,
      importe: 0
    });
    this.lineas.push(linea);
  }
  addLinea() { this.lineas.push(this.agregarLinea());}

  submit() {
    const userDataString = sessionStorage.getItem("USER_Data");

    for(let i = 0; i < this.lineas.length; i++){
      this.lineas.at(i).value['importe'] = this.getImporteLinea(i);
      console.log("Linea - " + i + " Importe: " + this.lineas.at(i).value['importe']);
    }

    const empresaDataString = sessionStorage.getItem("Empresa_Data"); 

    if (userDataString && empresaDataString) {
      const userData = JSON.parse(userDataString);
      const empresaData = JSON.parse(empresaDataString);

      const id_usuario = userData['id_usuario'];
      const correo_emisor = userData['email'];
      const nif_emisor = empresaData['NIF']; 
      const razon_emisor = empresaData['razon_social'];
      const domicilio_emisor = empresaData['domicilio_fiscal'];
      const codigo_postal_emisor = empresaData['codigo_postal'];
      const localidad_emisor = empresaData['localidad'];
      const provicincia_emisor = empresaData['provincia'];
      const pais_emisor = empresaData['pais'];
      const telefono_emisor = empresaData['telefono_empresarial'];

      const payload = {
        ...this.facturaForm.value,
        emisor_nif: nif_emisor,
        correo_emisor: correo_emisor,
        id_usuario: id_usuario,
        razon_social_emisor: razon_emisor,
        domicilio_emisor: domicilio_emisor,
        codigo_postal_emisor: codigo_postal_emisor,
        localidad_emisor: localidad_emisor,
        provicincia_emisor: provicincia_emisor,
        pais_emisor: pais_emisor,
        telefono_emisor: telefono_emisor
      };

      console.log("🐦: Começo");
      console.log("🚀 Payload listo para enviar:", payload);

      this.authService.crearFactura(payload).subscribe({
        next: (res) => {
          console.log('✅ Factura procesada:', res);
          alert('Factura guardada con éxito');
        },
        error: (err) => {
          console.error('❌ Error en el servidor:', err);
        }
      });

    } else {
      console.error("❌ No se encontraron datos en sessionStorage. USER_Data o EMPRESA_Data están vacíos.");
      alert("Error de sesión: No se pudieron recuperar los datos del emisor.");
    }
  }

  getFormErrors(form: any) {
    const errors: any = {};
    Object.keys(form.controls).forEach(key => {
      const controlErrors = form.get(key).errors;
      if (controlErrors != null) {
        errors[key] = controlErrors;
      }
    });
    return errors;
  }

  eliminarLinea(index: number) {
    if(this.lineas.length > 1) {
      this.lineas.removeAt(index);
    } else {
      this.lineas.at(0).reset({
        descripcion: '',
        cantidad: 1,
        unidad: 'Und',
        precio_unitario: 0,
        descuento: 0,
        iva_porcentaje: 21,
        importe: 0});
    }
  }

  getImporteLinea(index: number): number {
    const linea = this.lineas.at(index).value;
    const bruto = (linea.cantidad || 0) * (linea.precio_unitario || 0);
    const descuento = bruto * ((linea.descuento || 0) / 100);
    
    return bruto - descuento;
  }

  getImporteBruto(index: number): number {
    const linea = this.lineas.at(index).value;
    return (linea.cantidad || 0) * (linea.precio_unitario || 0);
  }

  getDescuento(index: number): number {
    const linea = this.lineas.at(index).value;
    const bruto = (linea.cantidad || 0) * (linea.precio_unitario || 0);
    const descuento = bruto * ((linea.descuento || 0) / 100);
    
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
      return acc + (importeNeto * ((linea.iva_porcentaje || 0) / 100));
    }, 0);
  }

  get totalFactura(): number {
    return this.subtotal + this.totalIva;
  }

  limpiarCamposFormulario() {
    this.facturaForm.reset({});
  }
}