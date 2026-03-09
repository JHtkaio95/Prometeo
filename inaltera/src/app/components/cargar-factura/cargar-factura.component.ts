import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cargar-factura',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './cargar-factura.component.html',
  styleUrl: './cargar-factura.component.css'
})
export class CargarFacturaComponent {

  uploadForm: FormGroup;

  archivo: File | null = null;
  nombre: string = "";
  tamanio: string = "";
  isForm: boolean = false;
  isLoading: boolean = false;

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
  
  constructor(private fb: FormBuilder, private authService: AuthService) {
    const user = JSON.parse(sessionStorage.getItem("Empresa_Data") || '{}');
    
    this.uploadForm = this.fb.group({
      nif_emisor: [user.NIF || ''],
      nif: ['', [Validators.required, Validators.pattern('^[A-Z0-9]{9}$')]],
      nombre: ['', Validators.required],
      numero: ['', Validators.required],
      fecha: [new Date().toISOString().substring(0, 10), Validators.required],
      total: ['', [Validators.required, Validators.min(0)]]
    });

  }

  cancelar() {
    this.archivo = null;
    this.nombre  = '';
    this.tamanio = '';
  }

  abrirForm() {
    if(!this.archivo) {
      this.isForm = false;
      return;
    }

    this.isForm = true;
  }

  closeForm() {
    this.isForm = false;
    this.uploadForm.reset({});
  }

  cargarYSellar() {
    if (this.uploadForm.valid && this.archivo) {
      const datosFinales = {
        file: this.archivo,
        metadata: this.uploadForm.value
      };

      console.log('Iniciando proceso de sellado', this.nombre);

      this.isLoading = true;

      this.authService.sellarFacturaExterna(this.archivo, this.uploadForm.value).subscribe({
        next: (res) => {
          console.log('¡Sello generado!', res.hash);
          this.closeForm();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al sellar', err);
          this.isLoading = false;
        }
      });
    }
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
