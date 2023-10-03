import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import { CardService } from "src/app/services/cards.service";
import { GameService } from "src/app/services/game.service";
import { getErrors } from "src/app/shared/helpers/get-message-errors";
import { mapd, mapg } from "src/app/shared/helpers/imapper";
import { Game } from "src/app/shared/models/api";
import { CreateGameRequest, LoginRequest } from "src/app/shared/models/requests-api";
import { GameViewModel } from "src/app/shared/models/viewmodel";

@Component({
  selector: "app-projects",
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.css", "../../shared/styles/style.css"],
})
export class ProjectsComponent implements OnInit {
  games: GameViewModel[] = [];

  constructor(
    private gamesService: GameService,
    private cardService: CardService,
    private appService: AppService,
    private router: Router
  ) {}

  userLogin: LoginRequest;
  openCreateGame: boolean = false;
  request: CreateGameRequest = { name: "", user: "" };

  ngOnInit() {
    this.appService.isLogged();
    this.appService.setGlobalLoading(false);
    this.getGames();
  }

  getGames() {
    this.appService.setGlobalLoading(true);
    this.appService.currentUser.subscribe(
      (user) => {
        this.userLogin = user;

        if (this.userLogin) {
          this.request.user = this.userLogin._id;

          this.gamesService.getGames(this.userLogin._id).subscribe(
            (games) => {
              this.games = games;
              if (!games) this.games = [];
            },
            (error) => {
              console.log(error);
              this.appService.setAppAlerts(getErrors(error).map((error) => ({ message: error, type: "danger" })));
            }
          );
        } else {
          this.appService.setAppAlerts([{ message: "You're logged out", type: "danger" }]);
        }
      },
      (error) => {
        console.log("errors", error);
      }
    );

    this.appService.setGlobalLoading(false);
  }

  onCreate() {
    this.openCreateGame = true;
  }

  createGame() {
    this.appService.setGlobalLoading(true);
    if (!this.request.name || this.request.name == "") {
      this.appService.setAppAlerts([{ message: "Please, provide a name", type: "danger" }]);
      return;
    }

    if (!this.request.user || this.request.user == "") {
      this.appService.setAppAlerts([{ message: "User is empty", type: "danger" }]);
      return;
    }

    this.gamesService.createGame(this.request).subscribe(
      (res) => {
        console.log("projects create game", res);
        if (!res) {
          this.appService.setAppAlerts([{ message: "Error while creating the game. Please, try again", type: "danger" }]);
        } else {
          var game: Game = mapg(res.game);

          game.decks = res.decks.map((d) => mapd(d));
          game.states = res.states;

          this.gamesService.setGame(game);
          this.router.navigate(["/games/create"]);
        }
      },
      (error) => {
        console.log(error);
        this.appService.setAppAlerts(getErrors(error).map((error) => ({ message: error, type: "danger" })));
      }
    );
    this.appService.setGlobalLoading(false);
  }

  editGame(index: number) {
    if (!this.games || 0 == this.games.length) {
      this.appService.setAppAlerts([{ message: "Game List is empty", type: "danger" }]);
      return;
    }
    if (index >= this.games.length) {
      this.appService.setAppAlerts([{ message: "Index out of games bounds", type: "danger" }]);
      return;
    }

    this.gamesService.searchGame(this.games[index]._id).subscribe(
      (res) => {
        var game: Game = mapg(res.game);

        game.decks = res.decks.map((d) => mapd(d));
        game.states = res.states;

        this.gamesService.setGame(game);
        this.router.navigate(["/games/create"]);
      },
      (error) => {
        console.log(error);
        this.appService.setAppAlerts(getErrors(error).map((error) => ({ message: error, type: "danger" })));
      }
    );
  }

  deleteGame(index: number) {
    this.appService.setAppAlerts([{ message: "Not implemented yet", type: "danger" }]);
  }
}
