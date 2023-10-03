import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import { Game, State } from "src/app/shared/models/api";
import { LoginRequest } from "src/app/shared/models/requests-api";
import { gameModel } from "src/app/pages/games/summary/model";
import { GameService } from "src/app/services/game.service";
import { StateService } from "src/app/services/states.service";
import { getErrors } from "src/app/shared/helpers/get-message-errors";
import { DragComponent } from "src/app/components/drag/drag.component";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.css", "../../../shared/styles/style.css"],
})
export class CreateComponent implements OnInit {
  constructor(
    private appService: AppService,
    private gameService: GameService,
    private stateService: StateService,
    private router: Router
  ) {}

  userLogin: LoginRequest;
  game: Game = gameModel;
  @ViewChild("drag") drag: DragComponent;

  ngOnInit(): void {
    this.appService.GetUser().subscribe((u) => {
      this.userLogin = u;
    });

    this.gameService.getGame().subscribe((u) => {
      this.game = u;
    });

    if (!this.userLogin || this.userLogin._id === "") {
      this.appService.setAppAlerts([{ message: "You are logged out", type: "danger" }]);
      this.router.navigate(["/"]);
    }

    this.drag.drawAll();
  }

  savePositions(stateIDs: string[]) {
    console.log("stateIDs", stateIDs);
    if (stateIDs) {
      // update states
      stateIDs.forEach((id) => {
        var st = this.findState(id);
        if (st) {
          this.stateService.updateState(st).subscribe(
            () => {
              this.appService.setAppAlerts([{ message: "saved", type: "success" }]);
            },
            (errors: Object) => {
              console.log("errors", errors);
              this.appService.setAppAlerts(getErrors(errors).map((err) => ({ message: "", type: "danger" })));
            }
          );
        }
      });
    }
  }

  findState(_id: string): State {
    return this.game.states.find((st) => st._id == _id);
  }
}
