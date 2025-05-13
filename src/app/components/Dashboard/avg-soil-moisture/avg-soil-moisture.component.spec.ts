import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgSoilMoistureComponent } from './avg-soil-moisture.component';

describe('AvgSoilMoistureComponent', () => {
  let component: AvgSoilMoistureComponent;
  let fixture: ComponentFixture<AvgSoilMoistureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvgSoilMoistureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvgSoilMoistureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
