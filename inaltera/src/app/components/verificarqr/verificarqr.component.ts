import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-verificarqr',
  standalone: true,
  imports: [MatIconModule, MatCardModule, CommonModule,
    MatProgressSpinnerModule, MatDividerModule],
  templateUrl: './verificarqr.component.html',
  styleUrl: './verificarqr.component.css'
})
export class VerificarqrComponent implements OnInit{
  hash: string | null = null;
  factura: any = null;
  cargando = true;

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.hash = this.route.snapshot.paramMap.get('hash');
    if (this.hash) {
      this.authService.obtenerFacturaPorHash(this.hash).subscribe(res => {
        this.factura = res;
        this.cargando = false;
      });
    }
  }

  verPDF() {
    window.open('http://192.168.201.22/inaltera/' + this.factura.pdf_path, '_blank');
  }

}
