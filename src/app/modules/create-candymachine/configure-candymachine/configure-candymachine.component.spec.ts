import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureCandymachineComponent } from './configure-candymachine.component';

describe('ConfigureCandymachineComponent', () => {
  let component: ConfigureCandymachineComponent;
  let fixture: ComponentFixture<ConfigureCandymachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureCandymachineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureCandymachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
