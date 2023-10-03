import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { handleError } from "../shared/helpers/http-response-handler";
import { Deck } from "../shared/models/api";
import { DeckViewModel } from "../shared/models/viewmodel";

@Injectable({
  providedIn: "root",
})
export class DeckService {
  constructor(private http: HttpClient) {}

  getDecks(gameId: string): Observable<Deck[]> {
    return this.http.get<Deck[]>(`/Deck/all/${gameId}`).pipe(catchError(handleError));
  }

  getDeck(deckId: string): Observable<Deck> {
    return this.http.get<Deck>(`/Deck/${deckId}`).pipe(catchError(handleError));
  }

  createDeck(deck: Deck): Observable<DeckViewModel> {
    return this.http.post<DeckViewModel>(`/Deck`, deck).pipe(catchError(handleError));
  }

  updateDeck(deck: Deck): Observable<DeckViewModel> {
    return this.http.put<DeckViewModel>(`/Deck`, deck).pipe(catchError(handleError));
  }

  deleteDeck(deck: Deck): Observable<Deck> {
    const url = `/Deck/${deck._id}`;
    return this.http.delete<Deck>(url).pipe(catchError(handleError));
  }
}
