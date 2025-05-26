import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkerDashboardComponent } from './walker-dashboard.component';

describe('WalkerDashboardComponent', () => {
  let component: WalkerDashboardComponent;
  let fixture: ComponentFixture<WalkerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalkerDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WalkerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
