import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from 'helpers/components/alert/alert.component';
import { MaterialModule } from 'app/shared/material-module';

@NgModule({
    declarations: [
        AlertComponent
    ],
    imports     : [
        CommonModule,
        MaterialModule
    ],
    exports     : [
        AlertComponent
    ]
})
export class AlertModule
{
}
