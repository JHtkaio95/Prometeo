import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [MatButtonModule, MatCommonModule, MatIconModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  isLogin: boolean = true;
  isRegistro: boolean = false;

  cambiarAuth(num: number) {
    if(num == 0) {
      if(!this.isLogin){
        this.isLogin = true;
      }

      if(this.isRegistro) {
        this.isRegistro = false;
      }
    } else if (num == 1) {
      if(this.isLogin){
        this.isLogin = false;
      }

      if(!this.isRegistro) {
        this.isRegistro = true;
      }
    }
  }

}
