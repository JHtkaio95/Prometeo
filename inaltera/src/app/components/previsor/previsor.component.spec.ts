import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevisorComponent } from './previsor.component';

describe('PrevisorComponent', () => {
  let component: PrevisorComponent;
  let fixture: ComponentFixture<PrevisorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrevisorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrevisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
