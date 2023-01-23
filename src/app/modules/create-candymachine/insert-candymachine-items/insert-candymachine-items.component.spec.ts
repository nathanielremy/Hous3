import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertCandymachineItemsComponent } from './insert-candymachine-items.component';

describe('InsertCandymachineItemsComponent', () => {
  let component: InsertCandymachineItemsComponent;
  let fixture: ComponentFixture<InsertCandymachineItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertCandymachineItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertCandymachineItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
