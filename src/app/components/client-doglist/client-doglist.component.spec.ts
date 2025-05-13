import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDoglistComponent } from './client-doglist.component';

describe('ClientDoglistComponent', () => {
  let component: ClientDoglistComponent;
  let fixture: ComponentFixture<ClientDoglistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDoglistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientDoglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
