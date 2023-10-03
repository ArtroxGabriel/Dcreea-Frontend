import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { GameService } from "src/app/services/game.service";
import { getErrors } from "src/app/shared/helpers/get-message-errors";
import { Condition, ConditionalRule, Game } from "src/app/shared/models/api";

@Component({
  selector: "app-conditional-rule",
  templateUrl: "./conditional-rule.component.html",
  styleUrls: ["./conditional-rule.component.css", "../../../../shared/styles/style.css"],
})
export class ConditionalRuleComponent implements OnInit {
  rule: ConditionalRule;
  condition: Condition;
  failureCondition: Condition;
  openCreateCondition: boolean = false;
  openFailureCondition: boolean = false;
  specificEffect: boolean = false;

  selectedIndex = -1;

  @Output("saveConditionalRule") ruleEmiter = new EventEmitter<ConditionalRule>();
  @Output("deleteCondition") deleteConditionEmiter = new EventEmitter<ConditionalRule>();
  @Input() state: any;

  @Input() game: Game;

  constructor(private appService: AppService, private gameService: GameService) {}

  ngOnInit(): void {
    this.clear();
    this.clearFailureCondition();

    if (this.state.conditionalRule) this.rule = this.state.conditionalRule;
  }

  saveRule() {
    var errors = this.isValid();
    if (errors.length > 0) {
      this.appService.setAppAlerts(errors.map((error) => ({ message: error, type: "danger" })));
      return;
    }
    this.ruleEmiter.emit(this.rule);
  }

  isConditionValid(c: Condition, i?: number): string[] {
    var errors = [];
    if (!c) errors.push(`Condition Test ${i ? "at " + i : ""} is empty`);
    if (c && !c.test) errors.push(`Condition's Test ${i ? "at " + i : ""} is empty`);
    if (c && !c.stateIfTrue) errors.push(`Condition's State ${i ? "at " + i : ""} is empty`);
    if (c && !c.effectIfTrue.simpleEffect) errors.push(`Condition's Effect ${i ? "at " + i : ""} is empty`);

    return errors;
  }

  isFailureConditionValid(c: Condition, i?: number): string[] {
    var errors = [];
    if (!c) errors.push(`Failure Condition Test ${i ? "at " + i : ""} is empty`);
    if (c && !c.test) errors.push(`Failure Condition's Test ${i ? "at " + i : ""} is empty`);
    if (c && !c.stateIfTrue) errors.push(`Failure Condition's State ${i ? "at " + i : ""} is empty`);
    if (c && !c.effectIfTrue.simpleEffect) errors.push(`Failure Condition's Effect ${i ? "at " + i : ""} is empty`);

    return errors;
  }

  isValid(): string[] {
    var errors: string[] = [];
    if (!this.rule) errors.push("Rule is null");
    if (this.rule && (!this.rule.label || this.rule.label == "")) errors.push("Rule's Label is empty");

    if (this.rule && (!this.rule.conditions || this.rule.conditions.length == 0)) {
      errors.push("Conditions is empty");
    } else {
      for (var i = 0; i < this.rule.conditions.length; i++) {
        var c = this.rule.conditions[i];
        errors = errors.concat(this.isConditionValid(c, i));
      }
    }

    errors = errors.concat(this.isFailureConditionValid(this.rule.failureCondition));

    return errors;
  }

  onAddCondition() {
    this.selectedIndex = -1;
    this.clearCondition();
    this.openCreateCondition = true;
  }

  onAddFailureCondition() {
    this.openFailureCondition = true;
    this.clearFailureCondition();
  }

  onEditFailureCondition() {
    this.failureCondition = this.rule.failureCondition;
    this.openFailureCondition = true;
  }

  onEditCondition(index: number) {
    this.selectedIndex = index;
    this.clearCondition();
    this.openCreateCondition = true;
  }

  onDeleteCondition(index: number) {
    this.rule.conditions = this.rule.conditions.filter((r, i) => i != index);
    this.selectedIndex = -1;
    this.clearCondition();
    this.deleteConditionEmiter.emit(this.rule);
  }

  ////////////////

  addCondition() {
    var errors = this.isConditionValid(this.condition);
    if (errors.length == 0) {
      if (this.selectedIndex >= 0) {
        this.rule.conditions[this.selectedIndex] = this.condition;
      } else {
        this.rule.conditions.push(this.condition);
      }
      this.openCreateCondition = false;
    } else {
      this.appService.setAppAlerts(errors.map((error) => ({ message: error, type: "danger" })));
    }
  }

  addFailureCondition() {
    var errors = this.isConditionValid(this.failureCondition);
    if (errors && errors.length == 0) {
      this.rule.failureCondition = this.failureCondition;
      this.openFailureCondition = false;
    } else {
      this.appService.setAppAlerts(errors.map((error) => ({ message: error, type: "danger" })));
    }
  }

  clear() {
    this.clearRequest();
    this.clearCondition();
  }

  clearRequest() {
    this.rule = {
      _id: null,
      conditions: [],
      failureCondition: null,
      label: null,
    };
  }

  clearCondition() {
    this.condition =
      this.selectedIndex >= 0 && this.selectedIndex < this.rule.conditions.length
        ? this.rule.conditions[this.selectedIndex]
        : {
            effectIfTrue: {
              turns: 1,
              simpleEffect: null,
              forever: false,
              statusChange: null,
              toSelf: false,
              toSpecific: null,
            },
            stateIfTrue: "",
            test: "", // statement fact
          };
  }

  clearFailureCondition() {
    this.failureCondition = {
      effectIfTrue: {
        turns: 1,
        simpleEffect: null,
        forever: false,
        statusChange: null,
        toSelf: false,
        toSpecific: null,
      },
      stateIfTrue: "",
      test: "", // statement fact
    };
  }

  printEffect(c: Condition): string {
    c.effectIfTrue;
    c.stateIfTrue;
    c.test;
    return "";
  }
}
