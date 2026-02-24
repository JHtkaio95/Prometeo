import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorRGComponent } from './visor-rg.component';

describe('VisorRGComponent', () => {
  let component: VisorRGComponent;
  let fixture: ComponentFixture<VisorRGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisorRGComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisorRGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
