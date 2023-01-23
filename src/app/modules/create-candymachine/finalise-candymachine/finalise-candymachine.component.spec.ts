import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinaliseCandymachineComponent } from './finalise-candymachine.component';

describe('FinaliseCandymachineComponent', () => {
  let component: FinaliseCandymachineComponent;
  let fixture: ComponentFixture<FinaliseCandymachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinaliseCandymachineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinaliseCandymachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
