import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermalCameraEditButtonComponent } from './thermal-camera-edit-button.component';

describe('ThermalCameraEditButtonComponent', () => {
  let component: ThermalCameraEditButtonComponent;
  let fixture: ComponentFixture<ThermalCameraEditButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThermalCameraEditButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThermalCameraEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
