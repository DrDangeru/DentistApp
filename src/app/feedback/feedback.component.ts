import { Component, Input, OnInit } from '@angular/core';
import { getAuth, user } from '@angular/fire/auth';
import { AngularFireAuth, } from '@angular/fire/compat/auth';
import { Database, set, get, ref } from '@angular/fire/database';
import { getDatabase } from '@firebase/database';
// import { Doctor } from '../doctor.model';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { MatInputModule } from '@angular/material/input' //MatNativeSelect
import { UserService } from '../user.service';
import { Patient } from '../user.model';
import { async } from '@firebase/util';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})

export class FeedbackComponent {
  feedbackForm: FormGroup;
  doctorr: FormControl;
  fbText: FormControl;
  fbQuality: FormControl;
  fbCustService: FormControl;
  leftFeedback : boolean; 
  patient$! : Patient;
  

  constructor(private afAuth: AngularFireAuth, private router: Router, private userService : UserService) {
    this.doctorr = new FormControl('',[Validators.required])
      this.fbText = new FormControl('',[Validators.required])
      this.fbQuality = new FormControl( 10,[ Validators.required, Validators.pattern(/^[1-9][0]?$|^10$/)]) 
      this.fbCustService = new FormControl( 10, [( Validators.required, Validators.pattern(/^[1-9][0]?$|^10$/))])
    this.feedbackForm = new FormGroup([
      this.doctorr, this.fbText, this.fbQuality, this.fbCustService])
      this.leftFeedback = this.userService.patient$.value?.leftFeedback ?? false ;
  }

  sendFeedback() {
    const auth = getAuth();
    const userEmail = auth.currentUser?.email;
    if (userEmail == null ||   this.leftFeedback === true) {
      alert ('Please login to leave Feedback!')
      return ;
    }
    const db = getDatabase();
    let dat = new Date();
    let det = dat.toString().slice(0,24); // dateTimeas unique id, user would get leftFeedback to prevent more submits
    const overallRating = this.fbQuality.value + this.fbCustService.value;
    const reference = ref(db, `/Feedback/ + ${this.doctorr.value}/ + ${overallRating} + /${det}` );

    set(reference, {
      userEmail: userEmail,
      //doctor: this.doctorr.value,
      fbText: this.fbText.value,
      fbQuality: this.fbQuality.value,
      fbCustService: this.fbCustService.value,
      overallRating : this.fbQuality.value + this.fbCustService.value,
      

    })
    this.userService.setLeftFeedback(true);
 
      console.log(this.userService.patient$.value?.leftFeedback )  // NOT saving to DB ..  user UserService to save both bool in db
    };
    

    }
  


