import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalConstants } from 'app/shared/global-constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = localStorage.getItem('accessToken');

        if (token) {
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            request = request.clone({ headers });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                    if (this.router.url !== '/auth/login') {
                        // Clear token and navigate to login page
                        localStorage.clear();
                        this.router.navigate(['/auth/login']);
                    }
                }
                // Rethrow the error after handling it
                return throwError(() => error);
            })
        );
    }
}
