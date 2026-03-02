import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarqrComponent } from './verificarqr.component';

describe('VerificarqrComponent', () => {
  let component: VerificarqrComponent;
  let fixture: ComponentFixture<VerificarqrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarqrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerificarqrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
