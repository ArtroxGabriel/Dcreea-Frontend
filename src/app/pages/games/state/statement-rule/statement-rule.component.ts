import { Component, OnInit, AfterContentInit, EventEmitter, Output, Input } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { StateService } from "src/app/services/states.service";
import { getErrors } from "src/app/shared/helpers/get-message-errors";
import { State, StatementRule } from "src/app/shared/models/api";

@Component({
  selector: "app-statement-rule",
  templateUrl: "./statement-rule.component.html",
  styleUrls: ["./statement-rule.component.css", "../../../../shared/styles/style.css"],
})
export class statementRuleComponent implements OnInit, AfterContentInit {
  rule: StatementRule;
  rules: StatementRule[];
  states: State[];

  gameId: string;
  stateId: string;

  specificStatement: boolean = false;
  showDeletePopup: boolean = false;

  selectedRuleIndex: number = -1;

  @Output("saveStatementRule") ruleEmiter = new EventEmitter<StatementRule>();
  @Output("deleteStatementRule") deleteEmiter = new EventEmitter<number>();

  @Input() state: any;
  @Input() addNewRule: any;

  turnsText: number;

  constructor(private appService: AppService, private stateService: StateService) {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.clear();
    this.turnsText = this.rule.turns ? this.rule.turns : 0;
  }

  clear() {
    this.clearRequest();
    this.clearStates();
  }

  clearStates() {
    this.states = [];
  }

  clearRequest() {
    this.rule = {
      _id: null,
      label: null,
      simplerDescription: null,
      toSelf: null,
      turns: null,
      toSpecific: null,
    };
  }

  loadStates() {
    this.stateService.getStates(this.gameId).subscribe(
      (states) => {
        console.log("states", states);
        this.states = states;
      },
      (errors: string[]) => {
        console.log("errou", errors);
        this.appService.setAppAlerts(getErrors(errors).map((error) => ({ message: error, type: "danger" })));
      }
    );
  }

  saveRule() {
    var errors = this.isValid();
    if (errors) {
      this.appService.setAppAlerts(errors.map((error) => ({ message: error, type: "danger" })));
      return;
    }
    this.ruleEmiter.emit(this.rule);
    this.clear();
  }

  isValid(): string[] {
    var errors: string[] = [];
    if (!this.rule) {
      return ["Empty rule"];
    }

    if (this.isEmpty(this.rule.label)) {
      errors.push("Invalid label");
    }

    if (this.isEmpty(this.rule.simplerDescription)) {
      errors.push("Invalid Description");
    }

    if (this.specificStatement && this.isEmpty(this.rule.statusChange)) {
      errors.push("If precise description is enabled, at least status change is required");
    }

    return errors.length > 0 ? errors : null;
  }

  isEmpty(st) {
    return !st || st === "";
  }

  printWhenConditions(when: any[]): string {
    return "";
  }

  onEdit(index) {
    this.rule = this.state.statementRules[index];
  }

  deleteRule() {
    this.deleteEmiter.emit(this.selectedRuleIndex);
    this.showDeletePopup = false;
  }

  onDelete(index) {
    this.showDeletePopup = true;
    this.selectedRuleIndex = index;
  }
}
