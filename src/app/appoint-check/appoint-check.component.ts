import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../user.service';
import { Observable, Observer, from } from 'rxjs';
import { Router } from '@angular/router';
import { Database, set, get, } from '@angular/fire/database';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { getDatabase, ref, onValue, update } from '@firebase/database';
import { Patient } from '../user.model';
import { AppointmentService } from '../appointment.service';

@Component({
  selector: 'app-appoint-check',
  templateUrl: './appoint-check.component.html',
  styleUrls: ['./appoint-check.component.css']
})
export class AppointCheckComponent implements OnInit {
  //user app component to show user his appointment...
  //appointmCheck = new BehaviorSubject(null);
  patient!: Patient | null;
  appDate?: string;
  id: string;
  cancellationReason: string = '';

  constructor(private userService: UserService, private appointmentService: AppointmentService) {
  }

  ngOnInit(): void {
    this.getPatient()

  }

  getPatient() {
    this.patient = this.userService.patient$.value;
  }

  async appointCheck(patient: Patient) { // return just has appointment, appointment date and time need to be added...
    console.log(' user Appointment Check', this.patient)
    if (this.patient == null) return alert('Please login to check your appointment date and time');
    console.log(this.patient, 'this is the info we afAuth/Google info we get')
    let appDate = this.patient.appointmentDate;
    console.log(appDate)
    return appDate;

  }


  async cancelApp(cancellationReason: string) {
    const db = getDatabase();
    const userRef = ref(db, '/Users/' + this.patient.uid);
    let oldAppDate = this.patient.appointmentDate;
    this.patient.appointmentDate = "";
    this.patient.hasAppointment = false;
    this.patient.cancellationReason = cancellationReason.valueOf();
    let updatedPatient = new Patient(this.patient.email, this.patient.name, this.patient.phone, this.patient.hasAppointment, 
      this.patient.leftFeedback, this.patient.uid, this.patient.appointmentDate, this.patient.cancellationReason);
      this.userService.patient$.next(updatedPatient);
    console.log(this.patient)
    console.log(updatedPatient)

    try {
      await update(userRef, updatedPatient)
    } catch (error) {
      console.log(error, 'Error while saving null appointment')
    } //erroring saving reset/delete appointment...
    console.log(updatedPatient); // deleted in patient observable but not in db and causes trouble...

    alert('Your appointment for ' + oldAppDate + ' was canceled!')
    //   alert(appDate)
    //   return appDate;
   // this.userService.patient$.next(this.patient) maybe not needed update?
  }
}
