import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-uso-suscripcion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uso-suscripcion.component.html',
  styleUrl: './uso-suscripcion.component.css'
})
export class UsoSuscripcionComponent implements OnInit, OnDestroy{
  @Input() tipo: 'circulo' | 'barra' = 'barra';

  usadas: number = 0;
  maximo: number = 0;
  porcentaje: number = 0;
  nombreTarifa: string= '';
  quedan: number = 0;

  private userSub: Subscription | undefined;

  constructor(private authService: AuthService){}

  ngOnInit() {
    this.cargarDatos();

    this.userSub = this.authService.user$.subscribe(user => {
      if(user) {
        this.usadas = user.facturas_usadas || 0;
        this.maximo = user.limite_facturas || 1;
        this.quedan = this.maximo - this.usadas < 0 ? 0 : this.maximo - this.usadas;
        this.nombreTarifa = user.nombre_tarifa || 'Gratuita';
        this.porcentaje = Math.min((this.usadas / this.maximo) * 100, 100);
      }
    });
  }

  ngOnDestroy() {
    if(this.userSub){
      this.userSub.unsubscribe();
    }
  }

  cargarDatos() {
    const user = JSON.parse(sessionStorage.getItem("USER_Data") || '{}');
    this.usadas = user.facturas_usadas || 0;
    this.maximo = user.limite_facturas || 1;
    this.quedan = this.maximo - this.usadas < 0 ? 0 : this.maximo - this.usadas;
    this.nombreTarifa = user.tarifa || 'Gratuita';
    this.porcentaje = Math.min((this.usadas / this.maximo) * 100, 100);

  }

  get strokeOffset(){
    const circuferencia = 283;
    return circuferencia - (this.porcentaje / 100) * circuferencia;
  }

  get colorEstado() {
    if (this.porcentaje < 70) return '#25c92b';
    if (this.porcentaje < 90) return '#ffeb3b';
    if (this.porcentaje < 100) return '#ffa33b';
    return '#f43636';
  }

}
