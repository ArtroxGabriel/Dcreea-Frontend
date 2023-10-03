import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";
import { handleError } from "../shared/helpers/http-response-handler";
import { LoginRequest } from "../shared/models/requests-api";
import { Router } from "@angular/router";

type AppAlertType = "warning" | "danger" | "info" | "success";
export type AppAlert = { message: string; type: AppAlertType };

@Injectable({ providedIn: "root" })
export class AppService {
  private _globalLoading = new Subject<boolean>();
  private _confirmationModal = new Subject<{
    title: string;
    description: string;
    confirmationCallback: () => void;
    cancellationCallback?: () => void;
  }>();
  private _appAlerts = new Subject<AppAlert[]>();
  private _closeAppAlertByIndex = new Subject<number>();

  private user = new BehaviorSubject<LoginRequest>(null);
  currentUser = this.user.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  setAppAlerts(alerts: AppAlert[], timeoutMs = 2500) {
    if (!alerts) return;

    this._appAlerts.next(alerts);

    if (alerts.length === 1) setTimeout(() => {
      this.closeAppAlerts();
      this.setGlobalLoading(false)
    }, timeoutMs);
  }

  closeAppAlert(index: number) {
    this._closeAppAlertByIndex.next(index);
  }

  closeAppAlerts() {
    this._appAlerts.next([]);
  }

  getAppAlerts() {
    return this._appAlerts.asObservable();
  }

  getCloseAppAlertByIndex() {
    return this._closeAppAlertByIndex.asObservable();
  }

  getGlobalLoading() {
    return this._globalLoading.asObservable();
  }

  setGlobalLoading(show: boolean) {
    this._globalLoading.next(show);
  }

  getConfirmationModal() {
    return this._confirmationModal.asObservable();
  }

  setConfirmationModal(param: { title: string; description: string; confirmationCallback: () => void; cancellationCallback?: () => void }) {
    this._confirmationModal.next(param);
  }

  ////////////////////////////////////

  GetUser(): Observable<LoginRequest> {
    return this.currentUser;
  }

  SetUser(user: LoginRequest): void {
    this.user.next(user);
  }

  isLogged() {
    this.currentUser
      .subscribe((u) => {
        if (!u || u._id === "") {
          this.setAppAlerts([{ message: "You are logged out", type: "danger" }]);
          this.router.navigate(["/"]);
        }
      })
      .unsubscribe();
  }

  LogIn(loginRequest: LoginRequest) {
    return this.http.post<LoginRequest>(`/login`, loginRequest).pipe(catchError(handleError));
  }

  SignIn(signRequest: LoginRequest) {
    return this.http.post<LoginRequest>(`/signup`, signRequest).pipe(catchError(handleError));
  }
}
