import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import { Card, Deck } from "src/app/shared/models/api";
import "@cds/core/icon/register.js";
import { ClarityIcons, cogIcon, plusIcon } from "@cds/core/icon";
import { templatesImg } from "src/app/shared/models/images";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: [
    "./card.component.css",
    "../../shared/styles/style.css",
    "../../shared/styles/cardsAndDecks.css",
    "../../shared/styles/card.css",
  ],
})
export class CardComponent implements OnInit {
  constructor(private appService: AppService, private router: Router) {}

  @Input("deck") d: Deck;
  @Input("card") card: Card;
  @Input("back") back: boolean;
  @Input("cardWidth") cardWidth: number = 250;
  @Input("marginBetwCards") marginBetwCards: number = 15;
  @Input("marginLeft") marginLeft: number = 0;
  @Input("rotate") rotate: any = null;
  @Input("showImageForm") showImageForm: any = null;
  cardHeight: number;
  showPopup = false;
  images = templatesImg;

  ngOnInit(): void {
    this.cardHeight = this.cardWidth * 1.72;
    ClarityIcons.addIcons(cogIcon);
    ClarityIcons.addIcons(plusIcon);
  }

  ngAfterContentInit() {
    this.cardHeight = this.cardWidth * 1.72;
  }

  showImagePopup() {
    this.showPopup = true;
  }

  selectImage(img: string, id: string) {
    this.updateCss(id);
    this.card.cardFront.art = img;
  }

  done() {
    this.showPopup = false;
  }

  updateCss(id: string) {
    document.getElementById(id).setAttribute("class", "imgClicked");
  }
}
