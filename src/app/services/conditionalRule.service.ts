import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { handleError } from "../shared/helpers/http-response-handler";
import { State, ConditionalRule } from "../shared/models/api";

@Injectable({
  providedIn: "root",
})
export class ConditionalRuleService {
  constructor(private http: HttpClient) {}

  getConditionalRules(stateId: string): Observable<ConditionalRule[]> {
    return this.http.get<ConditionalRule[]>(`/ConditionalRule/all/${stateId}`).pipe(catchError(handleError));
  }

  getConditionalRule(stateId: string): Observable<ConditionalRule> {
    return this.http.get<ConditionalRule>(`/ConditionalRule/${stateId}`).pipe(catchError(handleError));
  }

  createConditionalRule(stateId: string, rule: ConditionalRule): Observable<State> {
    return this.http.post<State>(`/ConditionalRule/${stateId}`, rule).pipe(catchError(handleError));
  }

  updateConditionalRule(stateId: string, rule: ConditionalRule): Observable<State> {
    return this.http.patch<State>(`/ConditionalRule/${stateId}`, rule).pipe(catchError(handleError));
  }

  deleteConditionalRule(stateId: string, rule: ConditionalRule): Observable<State> {
    return this.http.delete<State>(`/ConditionalRule/${stateId}`).pipe(catchError(handleError));
  }
}
