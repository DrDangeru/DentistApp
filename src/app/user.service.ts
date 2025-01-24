import { Injectable, NgZone } from '@angular/core';
import { Patient, User } from './user.model';
import { BehaviorSubject, isObservable, of, Subject, Subscriber, Subscription } from 'rxjs';
import { Observable, Observer, from } from 'rxjs';
import { Router } from '@angular/router';
import { initializeApp } from '@firebase/app';
import { Database, set, get, } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { getDatabase, ref, onValue, update } from '@firebase/database';
import { authInstance$, user } from '@angular/fire/auth';
import { AuthModule, LogLevel, OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({ providedIn: 'root' })
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

export class UserService {
  patient$: BehaviorSubject<Patient | null> = new BehaviorSubject<Patient | null>(null);
  userEmail?: string;
  name? : string;
  userPhone?: string;
  userId?: string;
  hasAppointment?: boolean;
  leftFeedback?: boolean;
  appointmentDate? : string;
  patient! : Patient;

  constructor(private router: Router, public afAuth: AngularFireAuth, public ngZone: NgZone, public oidcSecurityService: OidcSecurityService) { }

  isAuth(): boolean {
    const user = this.patient$.value;
    if (!user) { return false }
    else return true;
  }

  async getUserStatus2(user: Patient) { //
    if (user === null) return;
    console.log(user, 'this is the info we Google get')
    try {
      const db = getDatabase();
      const userRef = ref(db, '/Users/' + user.uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const userdb = snapshot.val();
        this.getPatientFromDb(userdb);
        console.log(user, "in the IF statement")
      }
      else {
        this.initUser(user)
        console.log(user, "in the ELSE statement")
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  public getPatientFromDb(userdb: any) { // slightly janky.. how to improve... not loading hasApp and leftFb and appDate on init.. guess this code to blame
   
    this.patient$.next(new Patient(
      "" + userdb.email, "" + userdb.name, "" + userdb.phone, userdb.hasAppointment ?? false, userdb.leftFeedback ?? false, // may not have with man reg  userdb.displayName
      "" + userdb.uid, "" + userdb.appointmentDate // was userId
    ));
    this.patient$.subscribe(patient => this.patient = patient!);
    // if (this.userId != userdb.uid) {
    //   this.userId = userdb.uid;
    // } else {this.userId = userdb.uid;
    // this.userEmail = userdb.email,
    // this.name = userdb.name;
    //   this.userPhone = userdb.phone,
    //   this.leftFeedback = userdb.leftFeedback ?? false
    // this.hasAppointment = userdb.hasAppointment ?? false;
    // this.appointmentDate = userdb.appointmentDate ;
    // }
  }

  async savePatient(patient: Patient){ //save changes commited to patient obsrvbl..
    const db = getDatabase();
    const reference = ref(db, `/Users/` + `${patient?.uid}/`);
    try{
    await update(reference, patient);
    }
    catch { console.error();}
    this.patient$.next(patient);
  }

  async signIn(email: string, password: string) {
    const user = await this.afAuth.signInWithEmailAndPassword(email, password);
    this.patient$.next(new Patient(
      "" + user.user?.email, user.user?.displayName + "", user.user?.phoneNumber + "",
      false, false, user.user?.uid + "", "")); //Firebase uses uid... we save userId in db... user is not saving to db
    this.router.navigate(['/']);
    console.log(this.patient$)
  }

  async forgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  async setLeftFeedback(value: boolean) {
    const patient = this.patient$.value;
    patient!.leftFeedback = value;
    const db = getDatabase();
    const reference = ref(db, `/Users/` + `${patient?.uid}/`);
    set(reference, patient)
    this.patient$.next(patient);
  }

  signOut() {
   this.oidcSecurityService.logoff();
   this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['DocsInfoComponent']);
    });
  }

  // mixing concerns, update patient loads from db OR updates patient :) savePatient now saves all data to db, this would be init patient
  async initUser(user: Patient) {  // this should just take patient and write to db so all stuff is saved/loaded even later added vars to ensure consist
    console.log('updating User status', user) // concerns of overwriting should be handled in other comps... this just read user/init user with all data
    const db = getDatabase();
    const userRef = ref(db, '/Users/' + user.uid); 
    console.log(user)
    this.patient = user;
    const snapshot = await get(userRef);
    if (snapshot.exists()) { //on login, need to fill missing fields /appoints, fb and so on.. should 
    
      this.getPatientFromDb(snapshot.val());
      this.patient$.next(this.patient); // think this is too late of init... 
    } else {
      this.patient = new Patient(
        user.email,
        user.name,
        user.phone,
        user.hasAppointment,
        user.leftFeedback,
        user.uid,
        user.appointmentDate + '',
        user.cancellationReason
      );
      this.patient$.next(this.patient);
      try {
        if (this.patient.name === undefined) // patient name was not generated on obj gen and this may have been the error...
        this.patient.name = 'defined'
        console.log('updating patient', this.patient, userRef)
        await set(userRef, this.patient); // like this code: sets both Patient and db fields atomically :), fancy word for one func
      } catch (e) {
        console.log(e)
      }
      console.log('saved in db');
    }
   this.patient$.next(this.patient);
  }
}



