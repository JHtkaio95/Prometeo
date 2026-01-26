import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../modelos/auth-modelo';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [MatButtonModule, MatCommonModule, MatIconModule,
    CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  @ViewChild('registroForm') registroForm!: NgForm;

  isLogin: boolean = true;
  isRegistro: boolean = false;
  emailLogi!: string;
  emailRegi!:string;
  passwordLogi!: string;
  passwordRegi!: string;
  confirm!: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  hacerLogin(){
    this.authService.loginUser(this.emailLogi, this.passwordLogi).subscribe(
      data => {
        this.router.navigateByUrl("/panel");
      },
      error => {
        console.log(error, "Error al enviar datos");
      });
  }

  registrar(){
    if(this.passwordRegi === this.confirm){
      this.authService.createUser(this.emailRegi, this.passwordRegi).subscribe(
        data => {
          this.isLogin = true;
          this.isRegistro = false;
          this.router.navigateByUrl("/auth");
        },
        error => {
          console.log(error, "Error al enviar datos");
        }
      );
    } else {
      window.alert("Las contraseñas no cohinciden");
    }
  }

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

    this.limpiarCampos();
  }

  limpiarCampos(){

    this.emailLogi = "";
    this.emailRegi = "";
    this.passwordLogi = "";
    this.passwordRegi = "";
    this.confirm = "";
  }

}
