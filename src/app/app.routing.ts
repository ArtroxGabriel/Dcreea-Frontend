import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DisclaimerComponent } from "./pages/disclaimer/disclaimer.component";
import { CreateComponent } from "./pages/games/create/create.component";
import { HelpComponent } from "./pages/help/help.component";
import { HomeComponent } from "./pages/home/home.component";
import { ProjectsComponent } from "./pages/projects/projects.component";

export const ROUTES: Routes = [
  { path: "", component: HomeComponent },
  { path: "home", component: HomeComponent },
  { path: "help", component: HelpComponent },
  { path: "disclaimer", component: DisclaimerComponent },
  { path: "user/projects", component: ProjectsComponent },
  { path: "games/create", component: CreateComponent },
];

export const AppRouting: ModuleWithProviders<RouterModule> = RouterModule.forRoot(ROUTES);
