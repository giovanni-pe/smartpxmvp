import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgTemperatureComponent } from './avg-temperature.component';

describe('AvgTemperatureComponent', () => {
  let component: AvgTemperatureComponent;
  let fixture: ComponentFixture<AvgTemperatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvgTemperatureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvgTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
