import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSlotDialogComponent } from './create-slot-dialog.component';

describe('CreateSlotDialog', () => {
  let component: CreateSlotDialogComponent;
  let fixture: ComponentFixture<CreateSlotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSlotDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSlotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
