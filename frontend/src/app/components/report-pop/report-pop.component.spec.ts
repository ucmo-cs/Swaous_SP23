import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPopComponent } from './report-pop.component';

describe('ReportPopComponent', () => {
  let component: ReportPopComponent;
  let fixture: ComponentFixture<ReportPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportPopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
