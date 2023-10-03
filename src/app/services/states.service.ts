import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { handleError } from "../shared/helpers/http-response-handler";
import { State } from "../shared/models/api";

@Injectable({
  providedIn: "root",
})
export class StateService {
  constructor(private http: HttpClient) {}

  private stateId = new Subject<string>();

  setStateId(id: string) {
    this.stateId.next(id);
  }

  getStateId() {
    return this.stateId.asObservable();
  }

  getStates(gameId: string): Observable<State[]> {
    return this.http.post<State[]>(`/State/all/`, { game: gameId }).pipe(catchError(handleError));
  }

  getState(stateId: string): Observable<State> {
    return this.http.get<State>(`/State/${stateId}`).pipe(catchError(handleError));
  }

  createState(rule: State): Observable<State> {
    return this.http.post<State>(`/State/`, rule).pipe(catchError(handleError));
  }

  updateState(rule: State): Observable<State> {
    return this.http.put<State>(`/State`, rule).pipe(catchError(handleError));
  }

  deleteState(ruleId: string): Observable<State> {
    return this.http.delete<State>(`/State/${ruleId}`).pipe(catchError(handleError));
  }
}
