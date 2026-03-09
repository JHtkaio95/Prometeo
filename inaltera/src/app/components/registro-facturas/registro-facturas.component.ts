import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule} from '@angular/material/core';
import { AuthService } from '../../services/auth.service';
import { MatFormField} from '@angular/material/form-field';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { environment } from '../../../environments/environment';


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
  id_factura: number;
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
  cliente: Cliente;
  pdf_path: string;
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
  fechaDesde: string = '';
  fechaHasta: string = '';

  facturasOriginales: any[] = []; 
  facturasFiltradas: any[] = []; 

  apiURL = environment.apiUrl;

  constructor(private fb: FormBuilder, private authService: AuthService){
    this.facturaForm = this.fb.group({});
  }

  ngOnInit(){
    this.getFacturas();
  }

  getFacturas() {
    this.authService.getFacturas().subscribe({
      next: (data: any[]) => {
        this.facturasOriginales = data.map(f => {
          const clienteParsed = f.datos_cliente ? JSON.parse(f.datos_cliente) : { nombre: 'N/A', nif: 'N/A' };
          
          return {
            ...f,
            id_factura: Number(f.id_factura),
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
            cliente: clienteParsed,
            pdf_path: String(f.pdf_path)
          };
        });

        this.facturasFiltradas = [...this.facturasOriginales];
        console.log("Dados cargados correctamente");
        
      },
      error: (err) => console.error("Error al intentar conectar con la API", err)
    });
  }

  aplicarFiltros() {
    this.facturasFiltradas = this.facturasOriginales.filter(f => {
      
      const busqueda = this.textoBusqueda.toLowerCase();
      const cumpleTexto = !busqueda || 
                          f.numero.toString().includes(busqueda) || 
                          f.serie.toLowerCase().includes(busqueda) ||
                          f.cliente.nombre.toLowerCase().includes(busqueda) ||
                          f.cliente.nif.toLowerCase().includes(busqueda);

      const fechaFactura = new Date(f.fecha_emision).getTime();

      const desde = this.fechaDesde ? new Date(this.fechaDesde).getTime() : null;
      const hasta = this.fechaHasta ? new Date(this.fechaHasta).getTime() : null;

      const cumpleDesde = !desde || fechaFactura >= desde;
      const cumpleHasta = !hasta || fechaFactura <= hasta;

      return cumpleTexto && cumpleDesde && cumpleHasta;
    });
  }

  limpiarFiltros() {
    this.textoBusqueda = '';
    this.fechaDesde = '';
    this.fechaHasta = '';
    this.facturasFiltradas = [...this.facturasOriginales];
  }

  

  isCharged(tipo: string): boolean {
    if(tipo === "EXT") {
      return true;
    } else {
      return false;
    }
  }

  downloadXML(idFactura: number) {
    console.log("Descargando Factura XML: " + idFactura);
    const token = sessionStorage.getItem('token_Data');
    const url = this.apiURL + `/descargarXML.php?id=${idFactura}&token=${token}`;
    window.open(url, '_blank');
  }

}
