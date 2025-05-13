import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsManagementComponent } from './sensors-management.component';

describe('SensorsManagementComponent', () => {
  let component: SensorsManagementComponent;
  let fixture: ComponentFixture<SensorsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensorsManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SensorsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
