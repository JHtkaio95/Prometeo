import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../modelos/auth-modelo';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, MatCommonModule, MatIconModule,
    CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  emailLogi!: string;
  passwordLogi!: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit() {
    this.limpiarCampos();
  }

  hacerLogin(){
    this.authService.loginUser(this.emailLogi, this.passwordLogi).subscribe(
      data => {
        this.router.navigateByUrl("panel");
      },
      error => {
        console.log(error, "Error al enviar datos");
      });
  }

  limpiarCampos(){
    this.emailLogi = "";
    this.passwordLogi = "";
  }
}
