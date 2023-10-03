import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { handleError } from "../shared/helpers/http-response-handler";
import { Card, Game } from "../shared/models/api";
import { GameService } from "./game.service";

@Injectable({
  providedIn: "root",
})
export class CardService {
  constructor(private http: HttpClient, private gameService: GameService) {}

  pullCards(game: Game) {
    if (game.decks && game.decks.length > 0) {
      if (game.decks && game.decks.length > 0 && game.decks[0].cards.length == 0) {
        for (let i = 0; i < game.decks.length; i++) {
          this.getCards(game.decks[i]._id).subscribe(
            (cards) => {
              if (cards) {
                game.decks[i].cards = cards;
                this.gameService.setGame(game);
              }
            },
            (errors: string[]) => {
              throw errors;
            }
          );
        }
      }
    }
  }

  getCards(deckId: string): Observable<Card[]> {
    return this.http.get<Card[]>(`/Card/all/${deckId}`).pipe(catchError(handleError));
  }

  getCard(deckId: string): Observable<Card> {
    return this.http.get<Card>(`/Card/${deckId}`).pipe(catchError(handleError));
  }

  createCard(card: Card): Observable<Card> {
    return this.http.post<Card>(`/Card`, card).pipe(catchError(handleError));
  }

  updateCard(card: Card): Observable<Card> {
    return this.http.put<Card>(`/Card`, card).pipe(catchError(handleError));
  }

  deleteCard(deckId: string): Observable<Card> {
    return this.http.delete<Card>(`/Card/${deckId}`).pipe(catchError(handleError));
  }
}
