import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermalCameraDeleteButtonComponent } from './thermal-camera-delete-button.component';

describe('ThermalCameraDeleteButtonComponent', () => {
  let component: ThermalCameraDeleteButtonComponent;
  let fixture: ComponentFixture<ThermalCameraDeleteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThermalCameraDeleteButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThermalCameraDeleteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
