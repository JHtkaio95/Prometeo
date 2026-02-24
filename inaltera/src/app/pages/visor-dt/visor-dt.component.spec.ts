import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorDTComponent } from './visor-dt.component';

describe('VisorDTComponent', () => {
  let component: VisorDTComponent;
  let fixture: ComponentFixture<VisorDTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisorDTComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisorDTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
