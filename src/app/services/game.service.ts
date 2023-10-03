import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { handleError } from "../shared/helpers/http-response-handler";
import { Game } from "../shared/models/api";
import { CreateGameRequest } from "../shared/models/requests-api";
import { CreateGameResponse, GameViewModel } from "../shared/models/viewmodel";

@Injectable({
  providedIn: "root",
})
export class GameService {
  constructor(private http: HttpClient) {}

  private game = new BehaviorSubject<Game>(null);
  currentGame = this.game.asObservable();

  setGame(game: Game) {
    this.game.next(game);
  }

  getGame(): Observable<Game> {
    return this.currentGame;
  }

  searchGame(gameId: string): Observable<CreateGameResponse> {
    return this.http.post<CreateGameResponse>(`/Game/find`, { _id: gameId }).pipe(catchError(handleError));
  }
  getGames(userId: string): Observable<GameViewModel[]> {
    return this.http.post<GameViewModel[]>(`/Game/all`, { user: userId }).pipe(catchError(handleError));
  }

  createGame(game: CreateGameRequest): Observable<CreateGameResponse> {
    return this.http.post<CreateGameResponse>(`/Game`, game).pipe(catchError(handleError));
  }

  updateGame(game: Game): Observable<Game> {
    return this.http.put<Game>(`/Game`, game).pipe(catchError(handleError));
  }

  deleteGame(game: Game): Observable<Game> {
    return this.http.delete<Game>(`/Game`).pipe(catchError(handleError));
  }
}
