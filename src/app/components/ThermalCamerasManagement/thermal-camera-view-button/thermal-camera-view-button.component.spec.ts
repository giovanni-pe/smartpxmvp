import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermalCameraViewButtonComponent } from './thermal-camera-view-button.component';

describe('ThermalCameraViewButtonComponent', () => {
  let component: ThermalCameraViewButtonComponent;
  let fixture: ComponentFixture<ThermalCameraViewButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThermalCameraViewButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThermalCameraViewButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
