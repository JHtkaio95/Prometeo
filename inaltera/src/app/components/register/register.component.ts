import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatButtonModule, MatCommonModule, MatIconModule,
    CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  emailRegi!:string;
  passwordRegi!: string;
  confirm!: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  ngOnInit() {
    this.limpiarCampos();
  }

  

  registrar(){
    if(this.passwordRegi === this.confirm){
      this.authService.createUser(this.emailRegi, this.passwordRegi).subscribe(
        data => {
          this.router.navigateByUrl("auth");
        },
        error => {
          console.log(error, "Error al enviar datos");
        }
      );
    } else {
      window.alert("Las contraseñas no cohinciden");
    }
  }

  limpiarCampos(){
    this.emailRegi = "";
    this.passwordRegi = "";
    this.confirm = "";
  }

}
