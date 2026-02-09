import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-tarifas',
  standalone: true,
  imports: [MatCommonModule, MatIconModule, CommonModule],
  templateUrl: './tarifas.component.html',
  styleUrl: './tarifas.component.css'
})
export class TarifasComponent{

  constructor(private authService: AuthService){}

  isTarifaActiva(index: number): boolean {
    const dataString = sessionStorage.getItem("USER_Data");
    if(dataString){
      const data = JSON.parse(dataString);
      if(index === 0) {
        if(data['tarifa'] === 1) {
          return true;
        }
      } else if (index === 1) {
        if(data['tarifa'] === 2) {
          return true
        }
      } else if(index === 2) {
        if(data['tarifa'] === 3) {
          return true;
        }
      }
    }
    

    return false;
  }

  cambiarTarifa(index: number, tarifa: number){
    if(!this.isTarifaActiva(index)){
      this.temporal(tarifa);
    }
  }

  temporal(index: number) {
    this.authService.cambiarTarifa(index).pipe(
      switchMap(() => this.authService.ActualizarUserSession())
    ).subscribe({
      next: (userData) => {
        console.log("Proceso completo: DB y Sesión sincronizadas", userData);
      },
      error: (err) => {
        console.error("Algo falló en la cadena", err);
      }
    });
}

}
