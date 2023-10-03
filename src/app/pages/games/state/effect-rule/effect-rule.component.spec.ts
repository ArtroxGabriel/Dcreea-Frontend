import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectRuleComponent } from './effect-rule.component';

describe('EffectRuleComponent', () => {
  let component: EffectRuleComponent;
  let fixture: ComponentFixture<EffectRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EffectRuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
