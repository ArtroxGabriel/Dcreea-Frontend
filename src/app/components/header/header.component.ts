import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { AppEnvironment } from "src/app/shared/models/app.environment";
import { ClarityIcons, employeeIcon } from "@cds/core/icon";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css", "../../shared/styles/style.css"],
})
export class HeaderComponent implements OnInit {
  activeMenu: number = -1;
  userLogin;

  constructor(readonly appEnvironment: AppEnvironment, private appService: AppService, private routeService: Router) {}

  ngOnInit() {
    ClarityIcons.addIcons(employeeIcon);
    this.appService.setGlobalLoading(true);
    this.appService.currentUser.subscribe(
      (user) => {
        this.userLogin = user;
        this.appService.setGlobalLoading(false);
      },
      (error) => {
        console.log("errors", error);
        this.appService.setGlobalLoading(false);
      }
    );
  }

  closeHamburger() {
    var headerHamburgerTrigger = document.getElementById("main-container") as HTMLElement;
    headerHamburgerTrigger.classList.remove("open-hamburger-menu");
    headerHamburgerTrigger.classList.remove("open-overflow-menu");
  }

  logout() {
    window.location.reload();
  }

  goToProjects() {
    this.routeService.navigateByUrl("/user/projects");
  }
}
