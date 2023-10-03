import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { ClarityModule } from "@clr/angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainModule } from "./shared/shared.module";
import { HeaderComponent } from "./components/header/header.component";
import { AppRouting } from "./app.routing";

import { AppService } from "./services/app.service";
import { AppEnvironment } from "./shared/models/app.environment";
import { HomeService } from "./services/home.service";
import { FormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";

export function init_app(homeService: HomeService, appEnvironment: AppEnvironment) {
  return async () => {
    await delay(1);
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [BrowserModule, ClarityModule, BrowserAnimationsModule, MainModule, FormsModule, AppRouting],
  exports: [ClarityModule],
  bootstrap: [AppComponent],
  providers: [
    AppService,
    CookieService,
    AppEnvironment,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [HomeService, AppEnvironment],
      multi: true,
    },
  ],
})
export class AppModule {
  constructor() {}
}
