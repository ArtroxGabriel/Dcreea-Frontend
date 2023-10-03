
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        // Client-side or network error
        console.error('An unexpected error occurred:', error.error.message);
        return throwError([error.error.message]);
    }

    // backend error
    if (error.status == 500) {
        return throwError([error.statusText]);  
    }

    // backend error
    let errors: string[] = [];

    if (!error.error)
        errors.push("An unexpected error occurred");
    else if (Array.isArray(error.error))
        errors = error.error as string[];
    else
        Object.keys(error.error).forEach(key => {
            errors = errors.concat(error.error[key]);
        });

    return throwError(errors);
}
