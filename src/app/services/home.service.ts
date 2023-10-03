import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { handleError } from "../shared/helpers/http-response-handler";
import { catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class HomeService {
    constructor(private http: HttpClient) {

    }
}
