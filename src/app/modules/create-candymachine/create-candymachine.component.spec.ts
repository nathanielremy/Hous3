import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCandymachineComponent } from './create-candymachine.component';

describe('CreateCandymachineComponent', () => {
  let component: CreateCandymachineComponent;
  let fixture: ComponentFixture<CreateCandymachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCandymachineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCandymachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
