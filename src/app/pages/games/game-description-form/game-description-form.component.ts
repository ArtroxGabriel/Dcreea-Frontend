import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { Router } from "@angular/router";
import { GameService } from "src/app/services/game.service";
import { getErrors } from "src/app/shared/helpers/get-message-errors";
import { Game } from "src/app/shared/models/api";

@Component({
  selector: "app-game-description-form",
  templateUrl: "./game-description-form.component.html",
  styleUrls: ["./game-description-form.component.css", "../../../shared/styles/style.css"],
})
export class GameDescriptionFormComponent implements OnInit {
  game: Game;

  constructor(private gameService: GameService, private appService: AppService, private router: Router) {}
  nextRoute = "/user/projects";

  ngOnInit(): void {
    this.clear();
    this.init();
  }

  init() {
    this.gameService.getGame().subscribe((game) => {
      this.game = game;
    });
  }

  saveGame() {
    this.appService.setGlobalLoading(true);
    var errors = this.isValid();
    if (errors.length > 0) {
      this.appService.setAppAlerts(errors.map((error) => ({ message: error, type: "danger" })));
      return;
    }

    this.gameService.updateGame(this.game).subscribe(
      (game) => {
        this.game = game;
        this.appService.setGlobalLoading(false);
        this.appService.setAppAlerts([{ message: "Saved", type: "success" }]);
      },
      (erros: string[]) => {
        this.appService.setGlobalLoading(false);
        this.appService.setAppAlerts(getErrors(erros).map((error) => ({ message: error, type: "danger" })));
      }
    );
    this.router.navigate([this.nextRoute]);
  }

  isValid(): string[] {
    var errors: string[] = [];
    if (!this.game) return ["Game is empty"];
    Object.keys(this.game).forEach((key) => {
      if (!Array.isArray(this.game[key])) {
        if (typeof this.game[key] === "string" && (!this.game[key] || this.game[key] === "")) {
          errors.push(`${key} is empty`);
        }

        if (typeof this.game[key] === "number" && (!this.game[key] || this.game[key] <= 0)) {
          errors.push(`${key} must be a positive number`);
        }
      }
    });

    return errors;
  }

  clear() {
    this.game = {
      _id: this.game ? this.game._id : null,
      audience: "",
      name: "",
      description: "",
      knowledgeField: "",
      maxNumberPlayers: 0,
      minNumberPlayers: 0,
      requirements: "",
      roles: [],
      user: "",
      tokens: [],
      simplyGameplay: "",
      decks: [],
      states: [],
      authors: [],
    };
  }
}
