import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { environment as env } from 'environments/environment';
import { Router } from '@angular/router';
import { ResponseLogin } from './auth.types';

@Injectable()
export class AuthService {
    private url = env.apiUrl;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _router: Router
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    private setToken(token: string): any {
        localStorage.setItem('accessToken', token);
    }

    public getToken(): string {
        return localStorage.getItem('accessToken');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * Login
     *
     * @param credentials
     */
    login(credentials: { phone: string; password: string }): Observable<ResponseLogin> {
        return this._httpClient.post<ResponseLogin>(this.url + '/auth/login', credentials).pipe(switchMap((response: ResponseLogin) => {
            // Store the access token in the local storage
            this.setToken(response.access_token);
            // Return a new observable with the response
            return of(response);
        }));
    }

    /**
     * Logout
    */
    logout(): void {
        // Remove the access token from the local storage
        localStorage.clear();
        // Return to login page
        this._router.navigateByUrl('/auth/login');
        this._httpClient.post(this.url + '/auth/logout', {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        });
    }

    isAuthenticated(): boolean {
        const token: string = this.getToken();
        if (!token) {
            this._router.navigate(['/auth/login']);
            return false;
        } else {
            return true;
        }
    }
}
