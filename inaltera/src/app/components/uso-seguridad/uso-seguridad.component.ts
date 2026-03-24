import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BlockchainService, EstadoSeguridad } from '../../services/blockchain.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-uso-seguridad',
  standalone: true,
  imports: [MatIconModule, MatCommonModule, 
    CommonModule, MatCheckboxModule, FormsModule],
  templateUrl: './uso-seguridad.component.html',
  styleUrl: './uso-seguridad.component.css'
})
export class UsoSeguridadComponent implements OnInit{
  @Input() tipo: 'ojo' | 'banner' = 'ojo';
  @Input() mostrarCheck: boolean = false;

  @ViewChild('irisGroup', { static: false }) irisGroup!: ElementRef;

  seguridad$: Observable<EstadoSeguridad>;
  seguirRaton: boolean = false;

  constructor(
    private blockchainService: BlockchainService,
    private renderer: Renderer2  
  ) {
    this.seguridad$ = this.blockchainService.seguridad$;
  }

  ngOnInit() {
    if(this.tipo === 'banner') {
      this.blockchainService.verificarIntegridad();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.tipo === 'ojo' && this.seguirRaton && this.irisGroup) {
      const iris = this.irisGroup.nativeElement;
      const rect = iris.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;
      
      const angle = Math.atan2(event.clientY - eyeY, event.clientX - eyeX);
      const dist = 8; // Radio de movimiento
      
      const moveX = Math.cos(angle) * dist;
      const moveY = Math.sin(angle) * dist;
      
      this.renderer.setAttribute(iris, 'transform', `translate(${moveX}, ${moveY})`);
    }
  }

}
