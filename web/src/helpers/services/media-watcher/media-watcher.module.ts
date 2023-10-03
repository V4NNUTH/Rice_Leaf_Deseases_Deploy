import { NgModule } from '@angular/core';
import { MediaWatcherService } from 'helpers/services/media-watcher/media-watcher.service';

@NgModule({
    providers: [MediaWatcherService],
})
export class MediaWatcherModule {
    /**
     * Constructor
     */
    constructor(private _mediaWatcherService: MediaWatcherService) {}
}
