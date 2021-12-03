import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalsDialogComponent } from './terminals-dialog.component';

describe('TerminalsDialogComponent', () => {
  let component: TerminalsDialogComponent;
  let fixture: ComponentFixture<TerminalsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminalsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
