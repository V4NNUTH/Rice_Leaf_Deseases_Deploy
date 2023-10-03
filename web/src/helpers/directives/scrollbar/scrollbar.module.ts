import { NgModule } from '@angular/core';
import { ScrollbarDirective } from 'helpers/directives/scrollbar/scrollbar.directive';

@NgModule({
    declarations: [
        ScrollbarDirective
    ],
    exports     : [
        ScrollbarDirective
    ]
})
export class ScrollbarModule
{
}
