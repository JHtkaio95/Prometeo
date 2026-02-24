import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule} from '@angular/material/core';
import { AuthService } from '../../services/auth.service';
import { MatFormField} from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';


export interface Cliente{
  nombre: string;
  nif: string;
  direccion_completa: {
    direccion: string;
    codigo_postal: string;
    localidad: string;
    provincia: string;
    pais: string;
  };
}

export interface Factura {
  Id: number;
  NIF: string;
  serie: string;
  numero: number;
  fecha_emision: string;
  tipo_factura: string;
  base_total: number;
  iva_total: number;
  importe_total: number;
  estado: string;
  id_usuario: number;
  datos_cliente: Cliente;
}

@Component({
  selector: 'app-registro-facturas',
  standalone: true,
  imports: [FormsModule, CommonModule, MatCommonModule, MatIconModule,
    MatFormField, MatDatepickerModule
  ],
  templateUrl: './registro-facturas.component.html',
  styleUrl: './registro-facturas.component.css'
})
export class RegistroFacturasComponent implements OnInit{
  facturaForm: FormGroup;

  textoBusqueda: string = '';
  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  facturasOriginales: any[] = []; 
  facturasFiltradas: any[] = [];  

  aplicarFiltros() {
    this.facturasFiltradas = this.facturasOriginales.filter(f => {
      
      const busqueda = this.textoBusqueda.toLowerCase();
      const cumpleTexto = !busqueda || 
                          f.numero.toString().includes(busqueda) || 
                          f.serie.toLowerCase().includes(busqueda) ||
                          JSON.stringify(f.datos_cliente).toLowerCase().includes(busqueda);

      const fechaFactura = new Date(f.fecha_emision);
      const cumpleDesde = !this.fechaDesde || fechaFactura >= this.fechaDesde;

      const cumpleHasta = !this.fechaHasta || fechaFactura <= this.fechaHasta;

      return cumpleTexto && cumpleDesde && cumpleHasta;
    });
  }
  listaFacturas: Factura[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService){
    this.facturaForm = this.fb.group({
      
    });
  }

  ngOnInit(){
    this.getFacturas();
  }

  getFacturas() {
    this.authService.getFacturas().subscribe({
      next: (data: any[]) => {
        this.listaFacturas = data.map(f => ({
          ...f,
          NIF: String(f.NIF),
          serie: String(f.serie),
          numero:  Number(f.numero),
          fecha_emision: f.fecha_emision,
          tipo_factura: String(f.tipo_factura),
          base_total: Number(f.base_total),
          iva_total: Number(f.iva_total),
          importe_total: Number(f.importe_total),
          estado: String(f.estado),
          id_usuario: Number(f.id_usuario),
          datos_cliente: f.datos_cliente ? JSON.parse(f.datos_cliente) : null
        }));
        console.log("Dados cargados correctamente");
      },
      error: (err) => console.error("Error al intentar conectar con la API", err)
    });
  }

}
