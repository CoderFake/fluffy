import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalespolicyComponent } from './salespolicy.component';

describe('SalespolicyComponent', () => {
  let component: SalespolicyComponent;
  let fixture: ComponentFixture<SalespolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalespolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalespolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
