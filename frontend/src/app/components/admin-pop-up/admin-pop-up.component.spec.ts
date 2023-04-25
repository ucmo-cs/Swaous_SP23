import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPopUpComponent } from './admin-pop-up.component';

describe('AdminPopUpComponent', () => {
  let component: AdminPopUpComponent;
  let fixture: ComponentFixture<AdminPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
