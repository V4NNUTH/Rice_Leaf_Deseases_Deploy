import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/core/user/user.types';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { GlobalConstants } from 'app/shared/global-constants';
import { UserService } from 'app/core/user/user.service';
import jwt_decode from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
    private token: string;
    constructor(
        private _authService: AuthService,
        private _userService: UserService,
        private _snackbarService: SnackbarService,
        private _router: Router
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Can activate
    // -----------------------------------------------------------------------------------------------------
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let expectedRoleArray = route.data;
        const role: string[] = expectedRoleArray.expectedRole;
        this.token = this._authService.getToken();
        var tokenPayload: User;
        try {
            tokenPayload = jwt_decode(this.token);
            this._userService.user = tokenPayload;
        } catch {
            localStorage.clear();
            this._router.navigate(['/auth/login']);
        }
        let checkRole = false;
        for (let i = 0; i < role.length; i++) {
            if (role[i] == tokenPayload.role) {
                checkRole = true;
            }
        }
        if (tokenPayload.role == 'Staff' || tokenPayload.role == 'Admin') {
            if (this._authService.isAuthenticated() && checkRole) {
                return of(true);
            }
            this._snackbarService.openSnackBar(GlobalConstants.unauthorized, GlobalConstants.error);
            this._router.navigate(['/dashboard']);
            return of(false);
        }
        else {
            this._router.navigate(['/auth/login']);
            localStorage.clear();
            return of(false);
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Can loading
    // -----------------------------------------------------------------------------------------------------
    canLoad(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let check: boolean = this._authService.isAuthenticated();
        if (check) {
            return of(true);
        }
        localStorage.clear();
        this._router.navigateByUrl('/auth/login');
        return of(false);
    }
}
