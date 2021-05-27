import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';
// import { AuthGuard } from '../services/auth.guard';


const rutasHijas = [
  { 
    path: '', 
    component: DashboardComponent,
    children: dashboardRoutes,
    // canActivate: [AuthGuard]
  },
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(rutasHijas)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutesModule { }
