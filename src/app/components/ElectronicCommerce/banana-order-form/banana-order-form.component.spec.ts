import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BananaOrderFormComponent } from './banana-order-form.component';

describe('BananaOrderFormComponent', () => {
  let component: BananaOrderFormComponent;
  let fixture: ComponentFixture<BananaOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BananaOrderFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BananaOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
