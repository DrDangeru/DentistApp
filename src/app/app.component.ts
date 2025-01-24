import {Component, Input, OnInit, Output} from '@angular/core';
import {UserService} from "./user.service";
import {Router} from "@angular/router";
import {AppointmentService} from "./appointment.service";
import {BehaviorSubject, Subject, pipe} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Patient} from './user.model';
import {initializeApp} from '@firebase/app';
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut // , onAuthStateChanged
} from '@firebase/auth';
import {getDatabase, ref, set} from '@firebase/database';
import {AppointmentComponent} from './appointment/appointment.component';
import {Schedule} from './schedule';
// import { ScheduleService } from './schedule.service';
import {environment} from 'src/environments/environment.prod';
import {FirebaseApp} from '@angular/fire/app';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {OAuthCredential} from 'firebase/auth';
import {OidcSecurityService, LogLevel} from 'angular-auth-oidc-client';
import {appCheckInstance$} from '@angular/fire/app-check';
import {defaultAppCheckInstanceFactory} from '@angular/fire/app-check/app-check.module';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'dentist3';
  isAuth: boolean = false;

  constructor(private userService: UserService,
              private router: Router, public afAuth: AngularFireAuth, public oidcSecurityService: OidcSecurityService) {
    const firebase = initializeApp(environment.firebase, 'dentist3');
    const db = getDatabase(firebase);

    this.userService.patient$.subscribe(patient => this.isAuth = patient !== null)
  }

  //   user data has following format
  //   {
  // "sub": "110730235375613124041",
  // "name": "Test Testermann",
  // "given_name": "Test",
  // "family_name": "Testermann",
  // "picture": "https://lh3.googleusercontent.com/a/ALm5wu1LWxhxehTA0_RP2LCIZ7e0q-OD144U0WK5T0pJ=s96-c",
  // "email": "ttestermann2@gmail.com",
  // "email_verified": true,
  // "locale": "en"
  // }
  ngOnInit() {
    this.afAuth.onAuthStateChanged((user: any) => {
      console.log('LOGIN USER', user);
      if (this.isAuth === true || user === null) return; // should no mess with if auth with other method I think...
      else {
        const patient = new Patient(
          user.email, user.name, "", false, false,
          user.uid, user.appointmentDate);
        this.userService.getUserStatus2(patient); // not saving new user to db // use same function, you pass User/Patient, no need for two functions
        console.log('AfAuth USER', patient) //not setting patient$
      }
    })

    if (this.oidcSecurityService.getAuthenticationResult() === null) return;
    else {
      this.oidcSecurityService.checkAuth().subscribe(({isAuthenticated, userData, idToken}) => {
        console.log(isAuthenticated, userData, idToken);
        if (!isAuthenticated) return;
        const patient = new Patient(
          userData.email, userData.name, "", false, false,
          userData.sub, userData.appointmentDate);
        this.userService.getUserStatus2(patient);
        console.log('OIDC USER Log proc', patient)
      })
    }
  }

//search where new patient without uid or sub
  login() {
    this.oidcSecurityService.authorize();
    const token = this.oidcSecurityService.getAccessToken()
      .subscribe({
        next(token) {
        },
        error(msg) {
          console.log('Error Getting Location: ', msg);
        }
      })
  }

  async logout() {
    this.isAuth = false;
    this.userService.patient$.next(null);
    await this.afAuth.signOut();
    await this.oidcSecurityService.logoff();
    alert('Logged out')
  }

}


