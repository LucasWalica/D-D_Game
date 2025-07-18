import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySelectionComponent } from './party-selection.component';

describe('PartySelectionComponent', () => {
  let component: PartySelectionComponent;
  let fixture: ComponentFixture<PartySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartySelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
