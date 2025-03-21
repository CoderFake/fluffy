import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutFluffyComponent } from './about-fluffy.component';

describe('AboutFluffyComponent', () => {
  let component: AboutFluffyComponent;
  let fixture: ComponentFixture<AboutFluffyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutFluffyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutFluffyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
