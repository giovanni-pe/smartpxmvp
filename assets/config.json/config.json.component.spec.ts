import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigJsonComponent } from './config.json.component';

describe('ConfigJsonComponent', () => {
  let component: ConfigJsonComponent;
  let fixture: ComponentFixture<ConfigJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigJsonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
