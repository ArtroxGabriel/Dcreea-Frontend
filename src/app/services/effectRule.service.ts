import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { handleError } from "../shared/helpers/http-response-handler";
import { State, EffectRule } from "../shared/models/api";

@Injectable({
  providedIn: "root",
})
export class EffectRuleService {
  constructor(private http: HttpClient) {}

  getEffectRules(stateId: string): Observable<EffectRule[]> {
    return this.http.get<EffectRule[]>(`/EffectRule/all/${stateId}`).pipe(catchError(handleError));
  }

  getEffectRule(ruleId: string): Observable<EffectRule> {
    return this.http.get<EffectRule>(`/EffectRule/${ruleId}`).pipe(catchError(handleError));
  }

  createEffectRule(stateId: string, rule: EffectRule): Observable<State> {
    return this.http.post<State>(`/EffectRule/${stateId}`, rule).pipe(catchError(handleError));
  }

  updateEffectRule(stateId: string, rule: EffectRule): Observable<State> {
    return this.http.patch<State>(`/EffectRule/${stateId}`, rule).pipe(catchError(handleError));
  }

  deleteEffectRule(stateId: string, rule: EffectRule): Observable<State> {
    return this.http.delete<State>(`/EffectRule/${stateId}`).pipe(catchError(handleError));
  }
}
