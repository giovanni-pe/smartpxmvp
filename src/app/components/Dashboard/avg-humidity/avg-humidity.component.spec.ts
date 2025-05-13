import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgHumidityComponent } from './avg-humidity.component';

describe('AvgHumidityComponent', () => {
  let component: AvgHumidityComponent;
  let fixture: ComponentFixture<AvgHumidityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvgHumidityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvgHumidityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
