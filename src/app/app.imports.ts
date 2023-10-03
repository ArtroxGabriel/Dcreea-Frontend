import { NgModule } from "@angular/core";
import { CreateComponent } from "./pages/games/create/create.component";
import { HomeComponent } from "./pages/home/home.component";
import { GameDescriptionFormComponent } from "./pages/games/game-description-form/game-description-form.component";
import { StateComponent } from "./pages/games/state/state.component";
import { ConditionalRuleComponent } from "./pages/games/state/conditional-rule/conditional-rule.component";
import { EffectRuleComponent } from "./pages/games/state/effect-rule/effect-rule.component";
import { statementRuleComponent } from "./pages/games/state/statement-rule/statement-rule.component";
import { SummaryComponent } from "./pages/games/summary/summary.component";
import { CardsComponent } from "./pages/games/cards/cards.component";
import { CardComponent } from "./components/card/card.component";
import { DecksComponent } from "./pages/games/decks/decks.component";
import { LoginComponent } from "./pages/login/login.component";
import { EnterComponent } from "./pages/login/enter/enter.component";
import { SignInComponent } from "./pages/login/sign-in/sign-in.component";
import { ProjectsComponent } from "./pages/projects/projects.component";
import { DragComponent } from "./components/drag/drag.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HelpComponent } from "./pages/help/help.component";
import { DisclaimerComponent } from "./pages/disclaimer/disclaimer.component";

export const PageComponents = {
  CreateComponent,
  GameDescriptionFormComponent,
  StateComponent,
  ConditionalRuleComponent,
  EffectRuleComponent,
  statementRuleComponent,
  SummaryComponent,
  DecksComponent,
  CardsComponent,
  CardComponent,
  LoginComponent,
  EnterComponent,
  SignInComponent,
  ProjectsComponent,
  DragComponent,
  FooterComponent,
  HelpComponent,
  DisclaimerComponent,
};

export const Pipes = {};

export const flattenPageComponents = [
  CreateComponent,
  HomeComponent,
  GameDescriptionFormComponent,
  StateComponent,
  ConditionalRuleComponent,
  EffectRuleComponent,
  statementRuleComponent,
  SummaryComponent,
  DecksComponent,
  CardsComponent,
  CardComponent,
  LoginComponent,
  EnterComponent,
  SignInComponent,
  ProjectsComponent,
  DragComponent,
  FooterComponent,
  HelpComponent,
  DisclaimerComponent,
];

export const commonComponents = [];

@NgModule({
  declarations: [],
  exports: [],
})
export class PipeModule {}
