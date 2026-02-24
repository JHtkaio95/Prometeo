import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorFGComponent } from './visor-fg.component';

describe('VisorFGComponent', () => {
  let component: VisorFGComponent;
  let fixture: ComponentFixture<VisorFGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisorFGComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisorFGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
