import {Routes} from '@angular/router';

import {MainLayoutComponent} from './ui/main-layout/main-layout.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list/movie',
    pathMatch: 'full',
  }, {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./ui/main-layout/main-layout.module').then(x => x.MainLayoutModule)
      }
    ],
    data: {
      reuse: true
    }
  },
  {
    path: '**',
    redirectTo: 'list/movie'
  }
]
