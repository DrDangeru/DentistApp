import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
// import {HttpClient, HttpHeaders} from "@angular/common/http";
import {DoctorService} from "./doctor.service";
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule';
import { UserService } from './user.service';
import { Patient } from './user.model';
import { getDatabase, ref, set, update } from '@firebase/database';
import { AppointmentComponent } from './appointment/appointment.component';
import { user } from '@angular/fire/auth';
import { throws } from 'assert';
import { TimeSlot } from './timeSlot.model';

@Injectable({  providedIn: 'root'})

export class AppointmentService {
  email! : string;
  phone! : string;
  leftFeedback! : boolean;
  userId! : string;
  uid! : string;
  hasAppointment! : boolean;
  patient! : Patient;
  appointmentDate? : string;
  
 
  constructor(private doctorService: DoctorService, private scheduleService : ScheduleService, 
   private userService : UserService ) {
    this.initAsinc();
  } 

  async initAsinc(){
    this.userService.patient$.subscribe( patient =>this.patient! = patient!)
}
//Rigth now Appointment service just adds appointment to db. *****************
  makeAppointment(schedule: Schedule): void { // slot comp get all slots info, puts in sched and sends here 
      const db = getDatabase();
      let date = schedule.date;
      console.log(date, 'this is date') // reports it correctly
      // let time:any =  schedule.timeslots.findIndex((value: TimeSlot, index: any, obj: TimeSlot[]) => { value.patientEmail == this.patient.email })
      // alert(time), console.log(time); works in fiddle.. not here -1 fiddle 0.. but slot has the data so just read
      // this.patient.appointmentDate  = schedule.date + ' ' + time as string; should be correctly saved in slot..
      alert(this.patient.appointmentDate ) , console.log(this.patient.appointmentDate, 'this is appDate' );
      const reference = ref(db, `/Schedules/` + date);//`${date}`
      try {update(reference, {schedule}) }
      catch (error){ console.log(error)};
      let userId = this.patient.uid;
      console.log(userId, 'this is userId if conv worked');
      console.log(this.patient) // works upto here
      this.userService.patient$.next(this.patient)
      try { set(ref(db, `/Users/` +  userId  ), { // update worked better, just testing...
       ...this.patient
      }),alert('Saved appointment to db');
      } 
      catch (error) {
        alert( error)
        alert('Error saving to db')
        console.log(error)
      }
    
    } 
  }

