import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormiAngularComponent } from './normi-angular.component';

describe('NormiAngularComponent', () => {
  let component: NormiAngularComponent;
  let fixture: ComponentFixture<NormiAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NormiAngularComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NormiAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
