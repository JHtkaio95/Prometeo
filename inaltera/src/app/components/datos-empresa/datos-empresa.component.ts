import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { AuthService } from '../../services/auth.service';

export interface Empresa {
  nif: string;
  razon_social: string;
  domicilio_fiscal: string;
  codigo_postal: string;
  localidad: string;
  provincia: string;
  pais: string;
  telefono_empresarial: number;
}

@Component({
  selector: 'app-datos-empresa',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, MatCommonModule],
  templateUrl: './datos-empresa.component.html',
  styleUrl: './datos-empresa.component.css'
})
export class DatosEmpresaComponent implements OnInit{

  isDatos: boolean = true;
  isTarifa: boolean = false;

  empresa: Empresa = {
    nif: "",
    razon_social: "",
    domicilio_fiscal: "",
    codigo_postal: "",
    localidad: "",
    provincia: "",
    pais: "",
    telefono_empresarial: 0
  };

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.iniciarEmpresa();

    
  }

  guardarEmpresa(){
    const dataString = sessionStorage.getItem("USER_Data");
    
    if(dataString){
      const data =  JSON.parse(dataString);
      const id_usuario = data['id_usuario'];

      this.authService.crearEmpresa(
        this.empresa.nif, 
        this.empresa.razon_social, 
        this.empresa.domicilio_fiscal,
        this.empresa.codigo_postal,
        this.empresa.localidad,
        this.empresa.provincia,
        this.empresa.pais,
        this.empresa.telefono_empresarial, 
        id_usuario).subscribe(data => {
      },
      error => {
        console.log(error, "Error al enviar datos");
    });
    }

    
  }

  iniciarEmpresa() {
  const dataString = sessionStorage.getItem("Empresa_Data");

  if (dataString) {
    // Si ya los tenemos, los cargamos
    this.asignarDatosEmpresa(JSON.parse(dataString));
  } else {
    // Si no, se los pedimos al servidor usando el Token
    this.authService.buscarEmpresaParaUsuario().subscribe({
      next: (dataBD) => {
        this.asignarDatosEmpresa(dataBD);
        // Guardamos para no volver a preguntar en esta sesión
        sessionStorage.setItem("Empresa_Data", JSON.stringify(dataBD));
      },
      error: (err) => console.error("No se pudo obtener la empresa", err)
    });
  }
}

asignarDatosEmpresa(data: any) {
  this.empresa.nif = data.NIF || data.nif;
  this.empresa.razon_social = data.razon_social;
  this.empresa.domicilio_fiscal = data.domicilio_fiscal;
  this.empresa.codigo_postal = data.codigo_postal;
  this.empresa.localidad = data.localidad;
  this.empresa.provincia = data.provincia;
  this.empresa.pais = data.pais;
  this.empresa.telefono_empresarial = data.telefono_empresarial;
}
  
  cambiarVentana(index: number){

  }

}
