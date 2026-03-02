import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cargar-factura',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './cargar-factura.component.html',
  styleUrl: './cargar-factura.component.css'
})
export class CargarFacturaComponent {

  archivo: File | null = null;
  nombre: string = "";
  tamanio: string = "";

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if(file && file.type === 'application/pdf') {
      this.archivo = file;
      this.nombre = file.name;
      this.tamanio = this.formatBytes(file.size);
    } else {
      alert('Selecciona un archivo PDF válido.');
    }
  }

  cancelar() {
    this.archivo = null;
    this.nombre  = '';
    this.tamanio = '';
  }

  cargarYSellar() {
    if (!this.archivo) return;

    console.log('Iniciando proceso de sellado', this.nombre);
  }

  private formatBytes(bytes: number, decimals = 2) {
    if(bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0: decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) /  Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

}
