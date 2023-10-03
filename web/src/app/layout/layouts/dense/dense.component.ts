import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MediaWatcherService } from 'helpers/services/media-watcher';
import { HelpersNavigationService, NavigationComponent } from 'helpers/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'dense-layout',
    templateUrl: './dense.component.html',
    styleUrls: ['dense.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DenseLayoutComponent implements OnInit, OnDestroy {
    public isScreenSmall: boolean;
    public navigation: Navigation;
    public user: User;
    public navigationAppearance: 'default' | 'dense' = 'default';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public role: string = '';

    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _navigationService: NavigationService,
        private _mediaWatcherService: MediaWatcherService,
        private _helpersNvigationService: HelpersNavigationService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to user data
        this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: User) => {
            this.role = user.role;
        });
        // Subscribe to navigation data
        this._navigationService.navigation$.pipe(takeUntil(this._unsubscribeAll)).subscribe((navigation: Navigation) => {
            this.navigation = navigation;
        });

        // Subscribe to media changes
        this._mediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
            // Check if the screen is small
            this.isScreenSmall = !matchingAliases.includes('md');
            // Change the navigation appearance
            if (this.isScreenSmall) {
                this.navigationAppearance = this.isScreenSmall ? 'default' : 'dense';
            }
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._helpersNvigationService.getComponent<NavigationComponent>(name);
        if (navigation) navigation.toggle();
    }

    /**
     * Toggle the navigation appearance
     */
    toggleNavigationAppearance(): void {
        this.navigationAppearance = (this.navigationAppearance === 'default' ? 'dense' : 'default');
    }
}
