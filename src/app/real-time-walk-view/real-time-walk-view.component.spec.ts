import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeWalkViewComponent } from './real-time-walk-view.component';

describe('RealTimeWalkViewComponent', () => {
  let component: RealTimeWalkViewComponent;
  let fixture: ComponentFixture<RealTimeWalkViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealTimeWalkViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealTimeWalkViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
