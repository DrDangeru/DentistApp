// import { getFirestore, collection, getDocs } from '@firebase/firestore';
import { getDatabase } from '@firebase/database';
import { Component, Input, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {FormControl, FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { OAuthCredential } from 'firebase/auth';
import {UserService} from "../user.service";
import { OidcSecurityService, OpenIdConfigLoader, } from 'angular-auth-oidc-client';


@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class  LoginComponent {
  email : FormControl;
  password : FormControl;
  signInForm : FormGroup;

  constructor( private afAuth : AngularFireAuth, private router : Router,  private userService: UserService, 
    public oidcSecurityService : OidcSecurityService ){
      this.email = new FormControl('',[Validators.required,Validators.email]),
      this.password = new FormControl('',[Validators.required]),
      this.signInForm = new FormGroup([
      this.email, this.password])
  }

loginEmailPassword(email : FormControl, password: FormControl  ) {
    try {
      this.afAuth.signInWithEmailAndPassword(email.value, password.value)
      alert('Logged In')
      this.router.navigate(['DocsInfoComponent']);
    } catch (error) {
      console.log(error);
      alert("Error occurued! Please, check your email and password.");
      alert("You can register for free if you dont have and account by clicking register")
    }
}

  signInGoogle(){
    let userToken;
    this.oidcSecurityService.authorize();
    const token = this.oidcSecurityService.getAccessToken()
    .subscribe({
      next(token) {  // want to call getUserStatus tok keep current stuff working possibly
         userToken= token;
      },
      error(msg) {
        console.log('Error Getting Token: ', msg); // was Error Getting location...
        
      }
    });
    // this.userService.getUserStatus(userToken)
        }
      
  signIn() {
    this.loginEmailPassword(this.email, this.password)
  }

  forgotPassword() { //sends the email with a verify link, but workee.?
    alert('Please enter the email form with the email for which the password reset will be done.')
    this.afAuth.sendPasswordResetEmail(
      this.email.value )
      .then(function() {
        alert('Please check you email for a password reset link and click that!')
        // Password reset email sent.
      })
      .catch(function(error) {
        // Error occurred. Inspect error.code.
      });
  }
}
