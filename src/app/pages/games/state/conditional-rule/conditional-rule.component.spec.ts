import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionalRuleComponent } from './conditional-rule.component';

describe('ConditionalRuleComponent', () => {
  let component: ConditionalRuleComponent;
  let fixture: ComponentFixture<ConditionalRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConditionalRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionalRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
