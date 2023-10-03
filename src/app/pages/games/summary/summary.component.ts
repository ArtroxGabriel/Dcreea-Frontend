import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CardComponent } from "src/app/components/card/card.component";
import { AppService } from "src/app/services/app.service";
import { GameService } from "src/app/services/game.service";
import { Card, Game } from "src/app/shared/models/api";
import { ModelToText } from "src/app/user-stories/model2text";
import html2PDF from "jspdf-html2canvas";
import { CardService } from "src/app/services/cards.service";
import { getErrors } from "src/app/shared/helpers/get-message-errors";
import { DragComponent } from "src/app/components/drag/drag.component";

@Component({
  selector: "app-summary",
  templateUrl: "./summary.component.html",
  styleUrls: [
    "./summary.component.css",
    "../../../shared/styles/style.css",
    "../../../shared/styles/cardsAndDecks.css",
    "../../../shared/styles/card.css",
  ],
})
export class SummaryComponent implements OnInit {
  game: Game;
  ruleLines: string[] = [];
  cardDefault: Card;
  isBack: boolean = false;
  modelErrors: string[] = [];
  @ViewChild("printable") page: ElementRef;
  @ViewChild("cardsToPrint") cards: ElementRef;
  @ViewChild("drag") drag: DragComponent;

  width: number = window.innerWidth;

  cardWidth: number = 250;
  marginBetwCards: number = 15;
  marginLeft: number = 0;
  cardHeight: number;

  constructor(private appService: AppService, private gameService: GameService, private cardService: CardService) {}

  ngOnInit(): void {
    this.gameService.getGame().subscribe((game) => {
      if (game !== this.game) {
        this.game = game;
        this.initCards();
      }
    });

    const model2text = new ModelToText();
    this.ruleLines = model2text.start(this.game);

    this.ruleLines.forEach((line) => {
      if (line.includes("[error]")) {
        this.modelErrors.push(line);
      }
    });

    if (this.modelErrors.length > 0) {
      this.appService.setAppAlerts(this.modelErrors.map((error) => ({ message: error, type: "danger" })));
    }

    this.cardDefault = {
      _id: null,
      deck: null,
      repetitions: 1,
      cardFront: {
        title: "Card Title",
        art: null,
        description: "Card description",
        effect: "Card effect",
        cost: 99,
        level: 99,
        earning: 99,
      },
      cardBack: {
        title: "Card Title",
        answers: "Card answers",
        effect: "Card effect",
        cost: 99,
        level: 99,
        earning: 99,
      },
    };

    this.drag.drawAll();
  }

  initCards() {
    this.appService.setGlobalLoading(true);

    try {
      this.cardService.pullCards(this.game);
    } catch (errors) {
      console.log("errors", errors);
      this.appService.setAppAlerts(getErrors(errors).map((error) => ({ message: error, type: "danger" })));
    }

    this.appService.setGlobalLoading(false);
  }

  async downloadPDF() {
    if (!this.page || !this.cards) {
      this.appService.setAppAlerts([{ message: "Error while checking the print page, please try again", type: "danger" }]);
      return;
    }

    this.appService.setGlobalLoading(true);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    const todaystr = dd + "-" + mm + "-" + yyyy;

    try {
      await html2PDF(this.page.nativeElement, {
        jsPDF: {
          format: "a4",
        },
        output: `[${todaystr}] Game Manual - ${this.game.name}.pdf`,
      });

      this.appService.setAppAlerts([{ message: "Game Manual created", type: "success" }]);

      await html2PDF(this.cards.nativeElement, {
        jsPDF: {
          format: "a4",
        },
        imageType: "image/jpeg",
        output: `[${todaystr}] Cards - ${this.game.name}.pdf`,
      });

      this.appService.setAppAlerts([{ message: "Cards PDF created", type: "success" }]);
    } catch (error) {
      console.log("errror while pdf", error);
      this.appService.setAppAlerts([{ message: "Error while creating PDF. Please try again", type: "danger" }]);
    } finally {
      this.appService.setGlobalLoading(false);
    }
  }

  savePositions(stateIDs: string[]) {}

  range(m: number) {
    var res: number[] = [];
    for (let i = 0; i < m; i++) {
      res.push(i);
    }

    return res;
  }
}
