import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenhouseCountDisplayComponent } from './greenhouse-count-display.component';

describe('GreenhouseCountDisplayComponent', () => {
  let component: GreenhouseCountDisplayComponent;
  let fixture: ComponentFixture<GreenhouseCountDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GreenhouseCountDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GreenhouseCountDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
