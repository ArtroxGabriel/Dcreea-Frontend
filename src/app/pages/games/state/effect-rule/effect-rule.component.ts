import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { getErrors } from "src/app/shared/helpers/get-message-errors";
import { Effect, EffectRule } from "src/app/shared/models/api";

@Component({
  selector: "app-effect-rule",
  templateUrl: "./effect-rule.component.html",
  styleUrls: ["./effect-rule.component.css", "../../../../shared/styles/style.css"],
})
export class EffectRuleComponent implements OnInit {
  rule: EffectRule;
  effect: Effect;
  openCreateEffect: boolean = false;
  specificEffect: boolean = false;

  selectedIndex = -1;

  @Output("saveEffectRule") ruleEmiter = new EventEmitter<EffectRule>();
  @Input() state: any;

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.clear();

    if (this.state.effectRule) this.rule = this.state.effectRule;
  }

  clear() {
    this.clearRequest();
    this.clearEffect();
  }

  clearRequest() {
    this.rule = {
      _id: null,
      label: null,
      effects: [],
    };
  }

  clearEffect() {
    this.effect =
      this.selectedIndex >= 0 && this.selectedIndex < this.rule.effects.length
        ? this.rule.effects[this.selectedIndex]
        : {
            simpleEffect: null,
            forever: false,
            statusChange: null,
            toSelf: false,
            toSpecific: null,
            turns: 0,
          };
  }

  saveRule() {
    var errors = this.isValid();
    if (errors.length > 0) {
      this.appService.setAppAlerts(errors.map((error) => ({ message: error, type: "danger" })));
      return;
    }
    this.ruleEmiter.emit(this.rule);
  }

  isValid(): string[] {
    var errors = [];
    if (!this.rule) return ["Rule is empty"];
    if (!this.rule.label || this.rule.label == "") errors.push("Label is empty");
    if (!this.rule.effects || this.rule.effects.length == 0) {
      errors.push("Effects are empty");
    } else {
      for (var i = 0; i < this.rule.effects.length; i++) {
        var s = this.rule.effects[i];
        errors = errors.concat(this.isEffectValid(s, i));
      }
    }
    return errors;
  }

  onAddEffect() {
    this.clearEffect();
    this.openCreateEffect = true;
  }

  onCancelAddEffect() {
    this.openCreateEffect = false;
  }

  addEffect() {
    var errors = this.isEffectValid(this.effect);
    if (errors.length == 0) {
      if (this.selectedIndex >= 0) {
        this.rule.effects[this.selectedIndex] = this.effect;
      } else {
        this.rule.effects.push(this.effect);
      }
    } else {
      this.appService.setAppAlerts(errors.map((error) => ({ message: error, type: "danger" })));
    }
    this.openCreateEffect = false;
  }

  isEffectValid(s: Effect, i?: number): string[] {
    var errors = [];
    if (!s) return [`Effect ${i ? "at " + i : ""} is empty`];
    if (!s.simpleEffect || s.simpleEffect == "") errors.push(`Effect description ${i ? "at " + i : ""} is empty`);
    if (s.statusChange || s.forever || s.statusChange || s.toSelf || s.toSpecific || s.turns) {
      if (!s.statusChange) errors.push(`If precise effect, status change is required ${i ? "(at " + i + ")" : ""}`);
      if (!s.forever && !s.turns) errors.push(`If precise effect, one of 'forever' or 'turns' is required ${i ? "(at " + i + ")" : ""}`);
      if (!s.toSelf && !s.toSpecific)
        errors.push(`If precise effect, one of 'toSelf' or 'toSpecific' is required ${i ? "(at " + i + ")" : ""}`);
    }
    return errors;
  }

  onEditEffect(index: number) {
    this.selectedIndex = index;
    this.clearEffect();
    this.openCreateEffect = true;
  }

  onDeleteEffect(index: number) {
    this.rule.effects = this.rule.effects.filter((r, i) => i != index);
    this.selectedIndex = -1;
    this.clearEffect();
  }
}
