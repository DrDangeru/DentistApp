import {Component, OnInit, Output, Input, Pipe, PipeTransform} from '@angular/core';
import {FormsModule, Validators, FormBuilder, FormControl, FormGroup, FormArray} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {UntypedFormBuilder, AbstractControl} from '@angular/forms';
import {Patient, User} from '../user.model';
import {Router} from '@angular/router';
import {BehaviorSubject, Subject, Subscription, timestamp} from 'rxjs';
import {UserService} from '../user.service';
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential} from 'firebase/auth';
import {getDatabase, set, ref, child} from '@firebase/database';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {__param, __values} from 'tslib';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  password: FormControl;
  email: FormControl;
  phone: FormControl;
  db = getDatabase();
  signupForm: FormGroup;
  consent : FormControl;

  start: Date;
  constructor(public formBuilder: FormBuilder, public afAuth: AngularFireAuth, private router: Router,
              private userService: UserService) {

    this.start = new Date();
    this.password = new FormControl('', [Validators.required, Validators.minLength(9)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.phone = new FormControl('', [Validators.required, Validators.minLength(10)]);
    this.consent = new FormControl('', [Validators.required,]);


    this.signupForm = new FormGroup([
      this.email, this.password, this.phone, this.consent
    ]);
  }

  get getControl() {
    return this.signupForm.controls;
  }

  ngOnInit() {}

  createUser() {
    if (!this.signupForm.valid) {
      alert('please fill out form');
      return;
    }
    alert("email: " + this.email.value + "\npassword: " + this.password.value + "\nphone: " + this.phone.value);
    console.log("create  user called");
    this.afAuth.createUserWithEmailAndPassword(this.email.value, this.password.value)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User data", user);
        this.router.navigate(['DocsInfoComponent'])
        try {
          this.writeUserData(userCredential.user?.uid, userCredential.user?.email, this.phone.value);
        } catch (error) {
          console.log('Error with db write of user', error )
        }

      })
      .then(() =>
        alert('Created user!!'))
      .catch
    console.error(Error);
    console.log(console.error())
     // alert('There was an error. Please try again!')
  }

  writeUserData(uid : string | any, email : string | any, phone : string | any) {
    const db = getDatabase();
    set(ref(db, 'Users/' + uid), {
      userId: uid,
      email: email,
      phone : phone,
      hasAppointment: false
    });
  }


}
