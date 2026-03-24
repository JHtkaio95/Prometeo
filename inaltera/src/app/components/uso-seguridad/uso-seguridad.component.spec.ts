import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoSeguridadComponent } from './uso-seguridad.component';

describe('UsoSeguridadComponent', () => {
  let component: UsoSeguridadComponent;
  let fixture: ComponentFixture<UsoSeguridadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsoSeguridadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsoSeguridadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
