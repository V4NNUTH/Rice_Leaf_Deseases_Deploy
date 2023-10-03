import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

export const appRoutes: Route[] = [

   
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        canActivate: [NoAuthGuard],
        data: {
            layout: 'empty'
        },
        loadChildren: () => import('app/main/Home/home.module').then(m => m.HomeModule),
        // canLoad: [AuthGuard]
    },
  
];
