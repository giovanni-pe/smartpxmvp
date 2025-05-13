import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorEditButtonComponent } from './sensor-edit-button.component';

describe('SensorEditButtonComponent', () => {
  let component: SensorEditButtonComponent;
  let fixture: ComponentFixture<SensorEditButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorEditButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
