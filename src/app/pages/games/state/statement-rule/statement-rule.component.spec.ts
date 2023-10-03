import { ComponentFixture, TestBed } from "@angular/core/testing";

import { statementRuleComponent } from "./statement-rule.component";

describe("statementRuleComponent", () => {
  let component: statementRuleComponent;
  let fixture: ComponentFixture<statementRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [statementRuleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(statementRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
