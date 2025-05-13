import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateThermalCameraComponent } from './create-thermal-camera.component';

describe('CreateThermalCameraComponent', () => {
  let component: CreateThermalCameraComponent;
  let fixture: ComponentFixture<CreateThermalCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateThermalCameraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateThermalCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
