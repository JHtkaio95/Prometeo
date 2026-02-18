import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsoSuscripcionComponent } from './uso-suscripcion.component';

describe('UsoSuscripcionComponent', () => {
  let component: UsoSuscripcionComponent;
  let fixture: ComponentFixture<UsoSuscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsoSuscripcionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsoSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
