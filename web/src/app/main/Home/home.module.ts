import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrollbarModule } from 'helpers/directives/scrollbar';
import { SharedModule } from 'app/shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';
import { HomeComponent } from './home.component'
import {HomePreviewComponent} from './preview/preview.component'
import {HomeViewInfoComponent} from './info/info.component'
const routes: Routes = [
    {
        path:'',
        component: HomeComponent
    }
];

@NgModule({
    declarations: [
        HomeComponent,
        HomePreviewComponent,
        HomeViewInfoComponent
    ],
    imports: [
        ScrollbarModule,
        SharedModule,
        RouterModule.forChild(routes),
        TranslocoModule,
    ]
})
export class HomeModule { }
