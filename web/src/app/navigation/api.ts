import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { NavigationItem } from 'helpers/components/navigation';
import { NavigationApiService } from 'helpers/navigation-api';
import { defaultNavigation } from 'app/navigation/navigation';

@Injectable({
    providedIn: 'root',
})
export class Navigation {
    private readonly _defaultNavigation: NavigationItem[] = defaultNavigation;
    constructor(private _navigationApiService: NavigationApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._navigationApiService.onGet('api/common/navigation').reply(() =>
            // Return the response
            [
                200,
                {
                    default: cloneDeep(this._defaultNavigation),
                },
            ]
        );
    }
}
