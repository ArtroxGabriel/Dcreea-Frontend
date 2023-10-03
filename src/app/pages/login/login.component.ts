import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { AppService } from "src/app/services/app.service";
import { GameService } from "src/app/services/game.service";
import { LoginRequest } from "src/app/shared/models/requests-api";
import { EnterComponent } from "./enter/enter.component";
import { SignInComponent } from "./sign-in/sign-in.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  isLogged: boolean = false;

  constructor(private cookieService: CookieService, private appService: AppService, private router: Router) {}

  ngOnInit(): void {
    var userLogin: LoginRequest;
    this.appService.GetUser().subscribe((u) => {
      userLogin = u;
    });

    if (userLogin && userLogin._id !== "") {
      this.router.navigate(["/user/projects"]);
    }
  }
}
