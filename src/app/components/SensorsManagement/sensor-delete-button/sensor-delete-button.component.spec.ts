import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorDeleteButtonComponent } from './sensor-delete-button.component';

describe('SensorDeleteButtonComponent', () => {
  let component: SensorDeleteButtonComponent;
  let fixture: ComponentFixture<SensorDeleteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorDeleteButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorDeleteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
