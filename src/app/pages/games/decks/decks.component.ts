import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import { CardService } from "src/app/services/cards.service";
import { DeckService } from "src/app/services/deck.service";
import { GameService } from "src/app/services/game.service";
import { StateService } from "src/app/services/states.service";
import { getErrors } from "src/app/shared/helpers/get-message-errors";
import { mapd } from "src/app/shared/helpers/imapper";
import { Card, Deck, Game } from "src/app/shared/models/api";
import { DeckViewModel } from "src/app/shared/models/viewmodel";
import { AppEnvironment } from "src/app/shared/models/app.environment";
import "@cds/core/icon/register.js";
import { ClarityIcons, plusIcon, minusIcon } from "@cds/core/icon";

ClarityIcons.addIcons(plusIcon);

@Component({
  selector: "app-decks",
  templateUrl: "./decks.component.html",
  styleUrls: [
    "./decks.component.css",
    "../../../shared/styles/style.css",
    "../../../shared/styles/cardsAndDecks.css",
    "../../../shared/styles/card.css",
  ],
})
export class DecksComponent implements OnInit {
  deckSelected: Deck;
  deckRequest: Deck;
  cardDefault: Card;
  isBack: boolean = false;
  gameId: string;
  showDeckForm: boolean = false;
  game: Game;

  @ViewChild("cardContainer") cardContainer: ElementRef;
  cardWidth: number = window.innerWidth / 4.6;

  deckIndex: number;

  constructor(
    private appService: AppService,
    private gameService: GameService,
    private stateService: StateService,
    private cardService: CardService,
    private deckService: DeckService,
    private appEnvironment: AppEnvironment,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clearDeckRequest();
    this.initCardDefault();

    this.gameService.getGame().subscribe((game) => {
      if (game !== this.game) {
        this.game = game;
        this.gameId = game._id;
        this.clearDeckRequest(0);
      }
    });
  }

  ngAfterContentInit() {
    if (this.cardContainer) this.cardWidth = this.cardContainer.nativeElement.offsetWidth / 2.2;
  }

  selectDeck(index: number) {
    if (index >= this.game.decks.length) {
      this.appService.setAppAlerts([{ message: "Invalid deck index. Please, reload the page", type: "danger" }]);
      return;
    }

    this.deckIndex = index;
    this.deckSelected = this.game.decks[this.deckIndex];
  }

  isDeckValid() {
    var errors: string[] = [];

    return errors;
  }

  saveDeck() {
    var errors = this.isDeckValid();
    if (errors.length > 0) {
      this.appService.setAppAlerts(errors.map((error) => ({ message: error, type: "danger" })));
      return;
    }

    this.appService.setGlobalLoading(true);
    this.deckSelected.game = this.game._id;

    if (this.deckIndex < 0) {
      this.deckService.createDeck(this.deckSelected).subscribe(
        (deck: DeckViewModel) => {
          this.game.decks.push(this.map(deck));
          this.gameService.setGame(this.game);
          this.appService.setAppAlerts([{ message: "Saved", type: "success" }]);
        },
        (errors: string[]) => {
          console.log("errors", errors);
          this.appService.setAppAlerts(getErrors(errors).map((error) => ({ message: error, type: "danger" })));
        }
      );
    } else {
      this.deckService.updateDeck(this.deckSelected).subscribe(
        (deck: DeckViewModel) => {
          this.game.decks[this.deckIndex] = this.deckSelected;
          this.clearDeckRequest();
          this.appService.setAppAlerts([{ message: "Saved", type: "success" }]);
        },
        (errors: string[]) => {
          console.log("errors", errors);
          this.appService.setAppAlerts(getErrors(errors).map((error) => ({ message: error, type: "danger" })));
        }
      );
    }
    this.appService.setGlobalLoading(false);
  }

  showDeletePopup = false;
  onDeleteDeck() {
    this.showDeletePopup = true;
  }

  deleteDeck() {
    if (this.game.decks.length <= 1) {
      this.appService.setAppAlerts([{ message: "You need to keep at least one deck", type: "danger" }]);
      return;
    }

    this.appService.setGlobalLoading(true);
    this.deckService.deleteDeck(this.deckSelected).subscribe(
      () => {
        this.game.decks = this.game.decks.filter((d) => d._id != this.deckSelected._id);
        this.gameService.setGame(this.game);
        this.clearDeckRequest(0);
        this.appService.setAppAlerts([{ message: "Deck deleted", type: "success" }]);
      },
      (errors: string[]) => {
        console.log("errors", errors);
        this.appService.setAppAlerts(getErrors(errors).map((error) => ({ message: error, type: "danger" })));
      }
    );
    this.showDeletePopup = false;
    this.appService.setGlobalLoading(false);
  }

  initCardDefault() {
    this.cardDefault = {
      _id: null,
      deck: null,
      repetitions: 1,
      cardFront: {
        title: "Card Title",
        art: null,
        description: "Card description",
        effect: "simple effect",
        cost: 99,
        level: 99,
        earning: 99,
      },
      cardBack: {
        title: "Card Title",
        answers: "Card answers",
        effect: "simple effect",
        cost: 99,
        level: 99,
        earning: 99,
      },
    };
  }

  clearDeckRequest(index: number = -1) {
    this.deckIndex = index;
    this.deckSelected = {
      _id: index < 0 ? null : this.game.decks[index]._id,
      game: null,
      cards: index < 0 ? [] : this.game.decks[index].cards,
      color: index < 0 ? "#6f6f7c" : this.game.decks[index].color,
      description: index < 0 ? "" : this.game.decks[index].description,
      name: index < 0 ? "" : this.game.decks[index].name,
      deckBack: {
        answers: index < 0 ? true : this.game.decks[index].deckBack.answers,
        cost: index < 0 ? true : this.game.decks[index].deckBack.cost,
        earning: index < 0 ? true : this.game.decks[index].deckBack.earning,
        effect: index < 0 ? true : this.game.decks[index].deckBack.effect,
        level: index < 0 ? true : this.game.decks[index].deckBack.level,
        title: index < 0 ? true : this.game.decks[index].deckBack.title,
      },
      deckFront: {
        description: index < 0 ? true : this.game.decks[index].deckFront.description,
        art: index < 0 ? true : this.game.decks[index].deckFront.art,
        cost: index < 0 ? true : this.game.decks[index].deckFront.cost,
        earning: index < 0 ? true : this.game.decks[index].deckFront.earning,
        effect: index < 0 ? true : this.game.decks[index].deckFront.effect,
        level: index < 0 ? true : this.game.decks[index].deckFront.level,
        title: index < 0 ? true : this.game.decks[index].deckFront.title,
      },
    };
  }

  map(deckvm: DeckViewModel, cards: Card[] = []): Deck {
    return {
      _id: deckvm._id,
      color: deckvm.color,
      description: deckvm.description,
      game: deckvm.game,
      name: deckvm.name,
      deckFront: deckvm.deckFront,
      deckBack: deckvm.deckBack,
      cards: cards,
    };
  }
}
