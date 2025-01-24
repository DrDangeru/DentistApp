import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppointmentComponent} from "./appointment/appointment.component";
import { AuthGuard } from './auth.guard';
import { DocsInfoComponent} from './docs-info/docs-info.component'
import { Datepicker } from './date-picker/datepick.module';
import { LoginComponent } from './login/login.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { SignupComponent } from './signup/signup.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AppointCheckComponent } from './appoint-check/appoint-check.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'datepicker',
    component: Datepicker,
    canActivate: [AuthGuard]
  },

  {
    path: 'app-appoint-check',
    component: AppointCheckComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'appointment',
    component: AppointmentComponent,
    canActivate: [AuthGuard]
  },
  
  {
    path: 'app-unauthorized',
    component: UnauthorizedComponent,

  },
  
  { 
    path: 'app-signup', 
    component: SignupComponent,
  },
    
  {
    path: 'DocsInfoComponent',
    component: DocsInfoComponent,
  },
  
  {
    path: 'app-feedback',
    component: FeedbackComponent,
    canActivate: [AuthGuard]
  }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
