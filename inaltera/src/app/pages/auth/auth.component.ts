import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { User } from '../../modelos/auth-modelo';


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [MatButtonModule, MatCommonModule, MatIconModule,
    CommonModule, FormsModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ){}


}
