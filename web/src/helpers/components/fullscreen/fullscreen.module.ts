import { NgModule } from '@angular/core';
import { FullscreenComponent } from 'helpers/components/fullscreen/fullscreen.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared/material-module';

@NgModule({
    declarations: [
        FullscreenComponent
    ],
    imports     : [
        MaterialModule,
        CommonModule
    ],
    exports     : [
        FullscreenComponent
    ]
})
export class FullscreenModule
{
}
