import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorViewButtonComponent } from './sensor-view-button.component';

describe('SensorViewButtonComponent', () => {
  let component: SensorViewButtonComponent;
  let fixture: ComponentFixture<SensorViewButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorViewButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorViewButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
