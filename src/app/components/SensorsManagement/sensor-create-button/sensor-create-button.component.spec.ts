import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorCreateButtonComponent } from './sensor-create-button.component';

describe('SensorCreateButtonComponent', () => {
  let component: SensorCreateButtonComponent;
  let fixture: ComponentFixture<SensorCreateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorCreateButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorCreateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
