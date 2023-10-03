import { Condition, Effect, Game, State, StatementRule } from "../shared/models/api";

export class ModelToText {
  stack: string[] = [];
  pipe: string[] = [];
  game: Game;

  constructor() {}

  public start(game: Game): string[] {
    this.game = game;

    var errors = this.invalid();
    if (errors.length > 0) return errors;

    var lines: string[] = [];

    this.addToPipe("Game Start");
    do {
      // getting the next state
      const stateName = this.pipe[0];
      const state = this.game.states.find((s) => s.label === stateName);

      // removing from pipe
      this.pipe.shift();
      const result = this.presentState(state);

      // updating the lines
      lines = lines.concat(result);

      // removing the first
    } while (this.pipe.length > 0);

    return lines;
  }

  /**
   *
   * @param state
   * @returns
   */
  presentState(state: State): string[] {
    this.stack.push(state.label); // se chegou aqui, então não está na pilha

    var lines: string[] = [`* '${state.label}': ${state.purpose}.`];

    if (state.label === "Game Over") return lines;

    // statement rules
    if (state.statementRules && state.statementRules.length > 0) {
      lines = lines.concat(this.writeStatementRules(state));
    }

    // effect rules
    // if (state.effectRule) {
    //   lines = lines.concat(this.writeEffectRules(state));
    // }

    // conditional rules
    if (state.conditionalRule) {
      lines = lines.concat(this.writeConditionalRule(state));
    } else {
      // transition
      lines = lines.concat(this.writeTransition(state));
    }

    return lines;
  }

  /**
   *
   * @param state
   * @returns
   */
  writeTransition(state: State): string[] {
    var lines: string[] = [];
    if (!this.stack.includes(state.transition)) {
      this.addToPipe(state.transition);
      lines.push(` Go ahead to '${state.transition}'.`);
    } else {
      lines.push(` And follows as '${state.transition}'.`);
    }
    return lines;
  }

  //////////////////////////////////

  /**
   *
   * @param state
   * @returns
   */
  writeStatementRules(state: State): string[] {
    var lines: string[] = [];

    const writeStatement = (rule: StatementRule): string => {
      if (!rule) return `[error] statement rule from state ${state.label} is empty`;
      var st = rule.me ? "me, as " + rule.me.toString() + "; " : "";
      var st = rule.to ? "in order to " + rule.to.toString() + "; " : "";
      st += rule.given ? "given that " + rule.given.toString() + "; " : "";
      st += rule.statusChange ? "" + rule.statusChange.toString() + "; " : "";
      st += "apply this to " + rule.toSelf ? "self player " : rule.toSpecific + "; ";
      st += "apply this for " + rule.forever ? " the rest of the game " : rule.turns + " turns; ";
      return st;
    };

    state.statementRules.forEach((rule) => {
      lines.push(" - " + rule.simplerDescription);
      if (rule.statusChange) {
        lines.push("   * a more detailed description: " + writeStatement(rule));
      }
    });

    return lines;
  }

  /**
   *
   * @param effect
   * @returns
   */
  writeEffect = (effect: Effect): string => {
    if (!effect) return "[error] effect is empty";
    var st = effect.simpleEffect;
    if (effect.statusChange) {
      st += `. In other words, apply '${effect.statusChange}' to `;
      st += effect.toSelf != null && effect.toSelf == true ? "self player;" : `players ${effect.toSpecific};`;
      st += ` This effect lasts for ${
        effect.forever != null && effect.forever == true ? "the rest of this game" : effect.turns + " turns."
      }`;
    }

    return st;
  };

  // writeEffectRules(state: State): string[] {
  //   var lines = [];
  //   state.effectRule.effects.forEach((effect) => {
  //     lines.push(this.writeEffect(effect));
  //   });

  //   return lines;
  // }

  /**
   *
   * @param condition
   * @returns
   */
  writeCondition(condition: Condition) {
    return ` - If ${condition.test}, Then ${this.writeEffect(condition.effectIfTrue)}. With this, go to '${condition.stateIfTrue}'`;
  }

  /**
   *
   * @param state
   * @returns
   */
  writeConditionalRule(state: State): string[] {
    var lines: string[] = [];
    var states = [];

    state.conditionalRule.conditions.forEach((condition) => {
      // - add it as priority on pipe on order
      states.unshift(condition.stateIfTrue);

      // present condition
      lines.push(this.writeCondition(condition));
    });

    // present failure
    lines.push(this.writeCondition(state.conditionalRule.failureCondition));

    // add as priority failure on pipe
    this.addAsPriority(state.conditionalRule.failureCondition.stateIfTrue);

    states.forEach((st) => {
      this.addAsPriority(st);
    });

    return lines;
  }

  ////////////////////////

  addAsPriority(stateName: string) {
    if (this.stack.includes(stateName)) return;
    this.pipe.unshift(stateName);
  }

  addToPipe(stateName: string) {
    if (this.stack.includes(stateName)) return;
    this.pipe.push(stateName);
  }

  findState(label: string): State {
    for (var i = 0; i < this.game.states.length; i++) {
      if (this.game.states[i].label == label) {
        return this.game.states[i];
      }
    }

    return null;
  }

  invalid(): string[] {
    var errors: string[] = [];

    if (!this.game) errors.push("[error] Game is Null");
    if (this.game && this.game.states.length <= 0) errors.push("[error] This game has no states");
    if (this.game && !this.findState("Game Start")) errors.push("[error] Game Start does not exist and is required");
    if (this.game && !this.findState("Game Over")) errors.push("[error] Game Over does not exist and is required");

    return errors;
  }
}
