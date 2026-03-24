import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-visor-fg',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MatIconModule],
  templateUrl: './visor-fg.component.html',
  styleUrl: './visor-fg.component.css'
})
export class VisorFGComponent {

  constructor(
    private authService: AuthService
  ){}

  esVerificado(): boolean {
    return this.authService.isVerified();
  }

}
