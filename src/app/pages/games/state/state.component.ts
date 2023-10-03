import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { GameService } from "src/app/services/game.service";
import { StateService } from "src/app/services/states.service";
import { getErrors } from "src/app/shared/helpers/get-message-errors";
import { ConditionalRule, EffectRule, Game, State, StatementRule } from "src/app/shared/models/api";
import "@cds/core/icon/register.js";
import { ClarityIcons, plusIcon, minusIcon } from "@cds/core/icon";

@Component({
  selector: "app-state",
  templateUrl: "./state.component.html",
  styleUrls: ["./state.component.css", "../../../shared/styles/style.css"],
})
export class StateComponent implements OnInit {
  showStatementForm: boolean = false;
  showConditionalForm: boolean = false;
  showTransitionForm: boolean = false;
  showEffectForm: boolean = false;
  show: boolean = false;
  showStateForm: boolean = false;
  showDeletePopup: boolean = false;
  isConditionalRule: boolean = false;
  addNewSTRule: boolean = false;
  OperationLabel: string = "Create New ";

  game: Game; // = gameModel;

  gameId: string;

  conditionalRuleRequest: ConditionalRule;
  effectRuleRequest: EffectRule;
  statementRuleRequest: StatementRule;

  stateSelected: State;

  stateIndex: number = -1;

  constructor(private appService: AppService, private stateService: StateService, private gameService: GameService) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(plusIcon);
    ClarityIcons.addIcons(minusIcon);
    this.gameService.getGame().subscribe((game) => {
      this.game = game;
      this.gameId = game._id;
    });

    this.clear();
  }

  onEdit(index: number) {
    this.stateSelected = this.game.states[index];
    this.stateIndex = index;
    this.isConditionalRule = this.stateSelected.conditionalRule != null;
    this.OperationLabel = "Edit ";
  }

  canIDelete = false;

  onDelete(index: number) {
    this.showDeletePopup = true;
    this.stateSelected = this.game.states[index];

    var deps = this.getStateDependencies();

    if (deps.length > 0) {
      this.canIDelete = false;
    } else {
      this.canIDelete = true;
    }
  }

  deleteState() {
    if (this.stateSelected.label === "Game Start" || this.stateSelected.label === "Game Over") {
      this.appService.setAppAlerts([{ message: "You can't delete Game Start or Game Over", type: "danger" }]);
      return;
    }
    //...
    this.appService.setGlobalLoading(true);
    this.stateService.deleteState(this.stateSelected._id).subscribe(
      () => {
        this.game.states = this.game.states.filter((st) => st._id != this.stateSelected._id);
        this.gameService.setGame(this.game);
        this.clear();
        this.appService.setAppAlerts([{ message: "State deleted", type: "success" }]);
      },
      (errors: string[]) => {
        console.log("errors when create", errors);
        this.appService.setAppAlerts(getErrors(errors).map((error) => ({ message: error, type: "danger" })));
      }
    );
    this.appService.setGlobalLoading(false);
  }

  getStateDependencies(): string[] {
    var dependentStates: string[] = [];

    this.game.states.forEach((st) => {
      if (st.conditionalRule) {
        st.conditionalRule.conditions.forEach((c) => {
          if (c.stateIfTrue === this.stateSelected.label) {
            dependentStates.push(st.label);
          }
        });
      } else if (st.transition == this.stateSelected.label) {
        dependentStates.push(st.label);
      }
    });

    return dependentStates;
  }

  //////////////////

  isStateValid() {
    var errors: string[] = [];

    if (!this.stateSelected) {
      return ["No data to save"];
    }

    if (!this.stateSelected.transition && !this.stateSelected.conditionalRule) {
      errors.push("Please, create a transition or a conditional rule to this state");
    }

    if (this.stateSelected.label === "Game Start" || this.stateSelected.label === "Game Over") {
      errors.push("You can't create or edit neither states 'Game Start' or 'Game Over'");
    }

    return errors.length > 0 ? errors : null;
  }

  saveState(clear: boolean = true) {
    var errors = this.isStateValid();
    if (errors) {
      this.appService.setAppAlerts(errors.map((error) => ({ message: error, type: "danger" })));
      return;
    }

    this.appService.setGlobalLoading(true);

    if (this.stateIndex >= 0) {
      // update
      this.stateService.updateState(this.stateSelected).subscribe(
        (res) => {
          if (res) {
            this.game.states[this.stateIndex] = res;
            if (clear) this.clearRequest();
            this.appService.setAppAlerts([{ message: "State Updated", type: "success" }]);
          }
        },
        (errors: string[]) => {
          console.log("errors when create", errors);
          this.appService.setAppAlerts(getErrors(errors).map((error) => ({ message: error, type: "danger" })));
        }
      );
    } else {
      //save

      this.stateService.createState(this.stateSelected).subscribe(
        (res) => {
          if (res) {
            this.game.states.push(res);
            this.clearRequest();
            this.appService.setAppAlerts([{ message: "State Created", type: "success" }]);
          }
        },
        (errors: string[]) => {
          console.log("errors when create", errors);
          this.appService.setAppAlerts(getErrors(errors).map((error) => ({ message: error, type: "danger" })));
        }
      );
    }

    this.OperationLabel = "Create New ";
    this.appService.setGlobalLoading(false);
  }

  onSaveStatementRule(rule: StatementRule) {
    this.stateSelected.statementRules.push(rule);
    this.appService.setAppAlerts([{ message: "Rule added to state", type: "success" }]);
    this.saveState(false);
  }

  onSaveConditionalRule(rule: ConditionalRule) {
    this.stateSelected.transition = null;
    this.stateSelected.conditionalRule = rule;
    this.saveState(false);
  }

  onDeleteCondition(rule: ConditionalRule) {
    this.stateSelected.conditionalRule = rule;
    this.saveState(false);
  }

  addSTRule() {
    this.addNewSTRule = true;
  }

  dellSTRule() {
    this.addNewSTRule = false;
  }

  onDeleteStatementRule(index: number) {
    if (this.stateSelected.statementRules && index >= this.stateSelected.statementRules.length) {
      this.appService.setAppAlerts([{ message: "Wrong index", type: "danger" }]);
      return;
    }

    this.stateSelected.statementRules = this.stateSelected.statementRules.filter((res, i) => i != index);
    this.appService.setAppAlerts([{ message: "Rule deleted from state", type: "success" }]);
  }

  onSaveTransitionRule() {
    this.stateSelected.conditionalRule = null;
    this.appService.setAppAlerts([{ message: "Rule added to state", type: "success" }]);
  }

  //////////////////////////

  mockNewState(index?: number) {
    var state: State = {
      _id: null,
      game: this.game._id,
      color: "#707070",
      purpose: index >= 0 && index < this.game.states.length ? this.game.states[index].purpose : "",
      label: index >= 0 && index < this.game.states.length ? this.game.states[index].label : "",
      conditionalRule: index >= 0 && index < this.game.states.length ? this.game.states[index].conditionalRule : null,
      statementRules: index >= 0 && index < this.game.states.length ? this.game.states[index].statementRules : [],
      transition: index >= 0 && index < this.game.states.length ? this.game.states[index].transition : null,
      width: 160,
      height: 80,
      x: 30,
      y: 30,
    };
    return state;
  }

  ////////////////////////////

  showStatementRule() {
    this.hideAllRules();
    this.showStatementForm = true;
  }

  showEffectRule() {
    this.hideAllRules();
    this.showEffectForm = true;
  }

  showConditionalRule() {
    this.hideAllRules();
    this.showConditionalForm = true;
  }

  showTransitionRule() {
    this.hideAllRules();
    this.showTransitionForm = true;
  }

  hideAll() {
    this.hideAllRules();
    this.show = false;
    this.showStateForm = false;
    this.showDeletePopup = false;
  }

  hideAllRules() {
    this.showStatementForm = false;
    this.showConditionalForm = false;
    this.showTransitionForm = false;
    this.showEffectForm = false;
  }

  clearRequest() {
    this.stateSelected = this.mockNewState();
    this.stateIndex = -1;
    this.OperationLabel = "Create New ";
    this.isConditionalRule = false;
  }

  clear() {
    this.clearRequest();
    this.hideAll();
  }
}
