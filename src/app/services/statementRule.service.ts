import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { handleError } from "../shared/helpers/http-response-handler";
import { State, StatementRule } from "../shared/models/api";

@Injectable({
  providedIn: "root",
})
export class StatementRuleService {
  constructor(private http: HttpClient) {}

  getStatementRules(stateId: string): Observable<StatementRule[]> {
    return this.http.get<StatementRule[]>(`/StatementRule/all/${stateId}`).pipe(catchError(handleError));
  }

  getStatementRule(ruleId: string): Observable<StatementRule> {
    return this.http.get<StatementRule>(`/StatementRule/${ruleId}`).pipe(catchError(handleError));
  }

  createStatementRule(stateId: string, rule: StatementRule): Observable<State> {
    return this.http.post<State>(`/StatementRule/${stateId}`, rule).pipe(catchError(handleError));
  }

  updateStatementRule(stateId: string, rule: StatementRule): Observable<State> {
    return this.http.patch<State>(`/StatementRule/${stateId}`, rule).pipe(catchError(handleError));
  }

  deleteStatementRule(stateId: string, rule: StatementRule): Observable<State> {
    return this.http.delete<State>(`/StatementRule/${stateId}`).pipe(catchError(handleError));
  }
}
