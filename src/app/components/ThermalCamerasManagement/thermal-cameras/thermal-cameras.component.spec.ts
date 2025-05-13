import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermalCamerasComponent } from './thermal-cameras.component';

describe('ThermalCamerasComponent', () => {
  let component: ThermalCamerasComponent;
  let fixture: ComponentFixture<ThermalCamerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThermalCamerasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThermalCamerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
