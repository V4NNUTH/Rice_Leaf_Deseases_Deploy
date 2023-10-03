import { NgModule } from '@angular/core';
import { ScrollResetDirective } from 'helpers/directives/scroll-reset/scroll-reset.directive';

@NgModule({
    declarations: [ScrollResetDirective],
    exports: [ScrollResetDirective],
})
export class ScrollResetModule {}
