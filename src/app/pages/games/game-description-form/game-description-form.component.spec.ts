import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameDescriptionFormComponent } from './game-description-form.component';

describe('GameDescriptionFormComponent', () => {
  let component: GameDescriptionFormComponent;
  let fixture: ComponentFixture<GameDescriptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameDescriptionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameDescriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
