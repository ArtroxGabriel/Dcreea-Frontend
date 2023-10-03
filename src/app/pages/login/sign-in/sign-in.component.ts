import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import { getErrors } from "src/app/shared/helpers/get-message-errors";
import { LoginRequest } from "src/app/shared/models/requests-api";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css", "../../../shared/styles/style.css"],
})
export class SignInComponent implements OnInit {
  request: LoginRequest;
  nextRoute = "/user/projects";

  constructor(private router: Router, private appService: AppService) {}

  ngOnInit(): void {
    this.clear();
  }

  clear() {
    this.request = {
      _id: null,
      email: null,
      password: null,
    };
  }

  SignIn() {
    this.appService.SignIn(this.request).subscribe(
      (user) => {
        this.router.navigate([this.nextRoute]);
      },
      (error) => {
        console.log(error);
        this.appService.setAppAlerts(getErrors(error).map((error) => ({ message: error, type: "danger" })));
      }
    );
  }
}
