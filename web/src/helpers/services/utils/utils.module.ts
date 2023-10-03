import { NgModule } from '@angular/core';
import { UtilsService } from 'helpers/services/utils/utils.service';

@NgModule({
    providers: [UtilsService],
})
export class UtilsModule {
    /**
     * Constructor
     */
    constructor(private _utilsService: UtilsService) {}
}
