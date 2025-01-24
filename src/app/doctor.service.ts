import {Injectable} from '@angular/core';
import {Doctor} from './doctor.model';
import {Observable, of, } from "rxjs";
import {TimeSlot} from "./timeSlot.model";
import {Patient} from './user.model';
import {UserService} from './user.service';
import {HttpClient, HttpHandler, HttpParams, HttpRequest, HttpResponse, HttpResponseBase, HttpStatusCode} from '@angular/common/http';
import {Schedule} from "./schedule";
import { ScheduleService } from './schedule.service';
import { getDatabase, ref, set, get, child  } from '@firebase/database';
//import { firebaseApp } from '../app/app.component';

@Injectable({  providedIn: 'root' })

export class DoctorService {
//Generates Doctors and timeSlots, calls Schedule for day... 
  schedule? : Schedule;
  doctorConfig = [{name: 'Petrov', timeSlots: [10, 11, 12, 13] } , {name: 'Angelova', timeSlots: [15, 16, 17, 18] }];
  doctors: Doctor[] = [];
  timeSlots: TimeSlot[] = [];
  // user: Patient; patient$ should be used instead
  patient$? : Patient;
  date? : string;

  constructor() {
    const db = getDatabase(); // firebaseApp should be default... so possible ERROR here .. but should call running instance
    const reference = ref(db, 'Schedules/'); //repeart code from app.component.ts
    let doctors: Doctor[] = [];
    if (doctors == null || doctors.length === 0) {
      doctors = this.generateDoctors();
    }
    this.doctors = doctors;
  }

  getDoctors(): Observable<Doctor[]> {
    console.log(this.doctors);
    return of<Doctor[]>(this.doctors);
  }

  saveDoctor(doctor: Doctor) {
    for (const [index, doc] of this.doctors.entries()) {
      if (doc.doctorName === doctor.doctorName) {
        this.doctors[index] = doctor;
      }
    }
    // this.saveDoctors();
  }

  private generateDoctors(): Doctor[] {
      let doctors:Doctor[] = [];
      for (const docData of this.doctorConfig) {
      const doctor = new Doctor();
      doctor.doctorName = docData.name;
        for ( const slt of docData.timeSlots) {
        doctor.timeSlots.push(this.generateTimeSlot(Number(slt) , docData.name));
        }
       doctors.push(doctor);
    }
    return doctors;
  }

  getDatee (date : Date) : string{
    let selectedDate : Date = new Date();
    let selectedDate1 = selectedDate.getTime();
    selectedDate1  = new Date((date)).getTime()+10800001; // may need setup for time zones other than EU / GMT >+4
    let selectedDate2 = new Date(selectedDate1) as Date;
    let dat = selectedDate2.toISOString();
    let da : string = dat.toString();
    return this.date = da.substring(0,10);
  }


  generateTimeSlot(slt: number, doctorName: string): TimeSlot {
    const slot = new TimeSlot();
    slot.taken = false;
    slot.slotNumber = (Number(slt));
    slot.time = (Number(slt)) + ':00';
    slot.doctorName = doctorName;
    return slot;
  }

//   private saveDoctors() { //dont think this is needed
//     localStorage.setItem('doctors', this.doctors); //dont think this is needed
//   }
// 
}

