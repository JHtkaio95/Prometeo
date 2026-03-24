import { Injectable, inject } from '@angular/core';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class TalkerService {

  private _snackBar = inject(MatSnackBar);
  

  constructor(
   ) { }

  notificarExitoSwal(texto: string) {
    Swal.fire({
      title: '¡Operación Exitosa!',
      text: texto,
      icon: 'success',
      confirmButtonColor: '#38bdf8',
      background: '1e293b',
      color: '#ffffff'
    });
  }

  notificarErrorSwal(error: string) {
    Swal.fire({
      title: 'Error Crítico',
      text: error,
      icon: 'error',
      confirmButtonColor: '#ef4444'
    });
  }

  notificarExitoSnack(texto: string, tipo: 'exito' | 'error' = 'exito') {
    this._snackBar.open(texto, '', {
      duration: 2000,
      panelClass: ['inaltera-toast', `toast-${tipo}`],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
