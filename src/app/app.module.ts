import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DocsInfoComponent} from './docs-info/docs-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule, MatButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { AppointmentComponent } from './appointment/appointment.component';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { SlotComponent } from './appointment/slot/slot.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {HttpClientModule} from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { Datepicker } from './date-picker/datepick.module';
import {  FirebaseApp, initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
// was bugging out, commented out node_modules/@angular/fire/compat/firestore/interfaces.d.ts:29:33
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import {LoginComponent } from '../app/login/login.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { SignupComponent } from './signup/signup.component';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './user.service';
import { OAuthCredential } from 'firebase/auth';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
// import { AuthConfigModule,  } from './auth/auth-config.module';
import {MatCheckboxModule } from '@angular/material/checkbox';
import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {MatRadioModule} from "@angular/material/radio";
import { AppointCheckComponent } from './appoint-check/appoint-check.component';


@NgModule({
  declarations: [
    AppComponent,
    DocsInfoComponent,
    AppointmentComponent,
    SlotComponent,
    Datepicker,
    LoginComponent,
    FeedbackComponent,
    SignupComponent,
    UnauthorizedComponent,
    AppointCheckComponent
  ],

  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AuthModule.forRoot({
      config: {
        authority: environment.auth.authority,
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: environment.auth.clientId,
        scope: environment.auth.scope,
        responseType: 'id_token token',
        silentRenew: true,
        useRefreshToken: true,
        logLevel: LogLevel.Debug,
      }
    }),
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    HttpClientModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AngularFireAuthModule,
    // AngularFirestoreModule, // firestore  was bugging out, commented out node_modules/@angular/fire/compat/firestore/interfaces.d.ts:29:33
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    // AuthConfigModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule
  ],

  providers:  [UserService],
  bootstrap:  [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
}
