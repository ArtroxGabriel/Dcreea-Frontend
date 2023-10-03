import { Card, Condition, Effect } from "./api";

export interface CreateTransitionRuleRequest {
  label: string;
  fromState: number;
  toState: number;
}

export interface CreateConditionalRuleRequest {
  otherwise: string;
  label: string;
  conditions: Condition[];
  fromState: string;
  description: string; // serve para dizer para que esta regra serve
}

export interface CreateEffectRuleRequest {
  label: string;
  fromState: string;
  effects: Effect[];
  toState: string;
}

export interface CreateStatementRuleRequest {
  gotoState: string;
  label: string;
  me: number; // actor
  to?: string;
  given: string; // statements
  otherwise: string; // statements
  simplerDescription: string; // statements
  when: string; // statements
  then: string; // statements
  fromState: string;
}

export interface SaveCardRequest {
  title: string;
  earning: number;
  cost: number;
  level: number;
  description: string;
}

export interface SaveDeckRequest {
  name: string;
  description: string;
  color: string;
  cardFrontFields: cardFrontFields;
  cardBackFields: cardBackFields;
}

export class clickableField {
  name: string;
  checked: boolean;
  type: string;
  cardSide: string;
}

export class cardFrontFields {
  title: clickableField;
  art: clickableField;
  description: clickableField;
  effect: clickableField;
  cost: clickableField;
  level: clickableField;
  earning: clickableField;
}

export class cardBackFields {
  title: clickableField;
  answers: clickableField;
  cost: clickableField;
  level: clickableField;
  earning: clickableField;
  effect: clickableField;
}

export class cardFrontFieldsRequest {
  title: string;
  art: string;
  description: string;
  effect: string;
  cost: number;
  level: number;
  earning: number;
}

export class cardBackFieldsRequest {
  title: string;
  answers: string;
  cost: number;
  level: number;
  earning: number;
  effect: string;
}

export interface LoginRequest {
  _id: string;
  email: string;
  password: string;
}

export interface CreateGameRequest {
  name: string;
  user: string;
}

export interface SearchStatesRequest {
  game: string;
}
