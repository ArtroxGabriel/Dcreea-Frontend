import { Component } from "@angular/core";
import { AppService } from "./services/app.service";
import { AppEnvironment } from "./shared/models/app.environment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css", "./shared/styles/style.css"],
})
export class AppComponent {
  title = "DCREEA-Front";
  showGlobalLoading = false;
  confirmationModal: {
    opened?: boolean;
    title: string;
    description: string;
    confirmationCallback: () => void;
    cancellationCallback?: () => void;
  } = { opened: false, title: "", description: "", confirmationCallback: null };
  appAlerts: { message: string; type: "warning" | "danger" | "info" | "success" }[] = [];

  constructor(readonly appEnvironment: AppEnvironment, private appService: AppService) {
    this.appService.getGlobalLoading().subscribe((showGlobalLoading) => {
      this.showGlobalLoading = showGlobalLoading;
    });

    this.appService.getConfirmationModal().subscribe((params) => {
      this.confirmationModal = params;
      this.confirmationModal.opened = true;
    });

    this.appService.getAppAlerts().subscribe((alerts) => {
      if (alerts) this.appAlerts = alerts;
    });

    this.appService.getCloseAppAlertByIndex().subscribe((index) => {
      this.closeAlert(index);
    });
  }

  closeAlert(index: number) {
    if (this.appAlerts.length >= index + 1) this.appAlerts.splice(index, 1);
  }

  closeHamburger() {
    var headerHamburgerTrigger = document.getElementById("main-container") as HTMLElement;
    headerHamburgerTrigger.classList.remove("open-hamburger-menu");
    headerHamburgerTrigger.classList.remove("open-overflow-menu");
  }

  cancelModal() {
    if (this.confirmationModal.cancellationCallback) this.confirmationModal.cancellationCallback();

    this.confirmationModal.opened = false;
  }
}
