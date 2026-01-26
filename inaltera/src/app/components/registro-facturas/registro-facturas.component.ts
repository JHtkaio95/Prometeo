import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';
import { Factura } from '../../modelos/factura-modelo';

@Component({
  selector: 'app-registro-facturas',
  standalone: true,
  imports: [FormsModule, CommonModule, MatCommonModule, MatIconModule],
  templateUrl: './registro-facturas.component.html',
  styleUrl: './registro-facturas.component.css'
})
export class RegistroFacturasComponent implements OnInit{
  facturaForm: FormGroup;


  listaFacturas: Factura[] = [];

  isRegistro: boolean = true;

  constructor(private fb: FormBuilder, private authService: AuthService){
    this.facturaForm = this.fb.group({
      
    });
  }

  ngOnInit(){
    this.getFacturas();
  }

  getFacturas() {
    this.authService.getFacturas().subscribe({
      next: (data) => {
        this.listaFacturas = data;
        console.log("Dados cargados correctamente");
      },
      error: (err) => console.error("Error al intentar conectar con la API", err)
    });
  }

}
