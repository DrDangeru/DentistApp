import { Injectable, Input } from '@angular/core';
import { Schedule } from './schedule';
import { BehaviorSubject, of } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { get, getDatabase, ref, child, onValue } from '@firebase/database';
import { AppComponent } from './app.component';
import { firebaseApp$ } from '@angular/fire/app';
import { DoctorService } from './doctor.service';
import { PropertyRead } from '@angular/compiler';

@Injectable({ providedIn: 'root' })
// Searches and returns Schedule for given Date and generates empty sched

export class ScheduleService {
  date!: string;
  schedule?: Schedule;
  date$ = new BehaviorSubject<Date | null>(null);
  constructor(private doctorService: DoctorService) { }

  getSched(date: string) {
    const db = getDatabase();
    const schedRef = ref(db, "Schedules/" + this.date);
    onValue(schedRef, (snapshot) => {
      const data = snapshot.val()
        .then((snapshot: any) => {
          if (snapshot.exists()) {
            console.log(snapshot.toJSON())
            this.schedule = Object.assign(new Schedule(date), snapshot.toJSON); //snapshot.val()
          } else {
            this.generateEmptySchedule(date)!
            snapshot.exportVal().then
            this.schedule = Object.assign(new Schedule(date), snapshot.exportVal());
            console.log("New Schedule Created with ", date);
          }
        }).catch((error: any) => {
          console.error(error);
        });
    })
  }


  getDatee(date: Date): string {
    let selectedDate: Date = new Date();
    let selectedDate1 = selectedDate.getTime();
    selectedDate1 = new Date((date)).getTime() + 10800001; // may need setup for time zones other than EU / GMT >+4
    let selectedDate2 = new Date(selectedDate1) as Date;
    let dat = selectedDate2.toISOString();
    let da: string = dat.toString();
    return this.date = da.substring(0, 10);
  }

  getSchedule() {
    return this.getSched(this.date); //think it should update like that without Observable
  }

  async getScheduleByDate(date: Date): Promise<Schedule> {
    console.log('get schedule by date');
    console.log(date);
    let scheduleForDay: Promise<Schedule>;
    const db = getDatabase();
    console.log("Schedules/" + this.getDatee(date));
    const reference = ref(db, "Schedules/" + this.getDatee(date)); //note for 17th
    const snapshot = await get(reference);
    if (snapshot.exists()) {
      console.log('log is' + snapshot.val());
      scheduleForDay = new Promise<Schedule>(function (resolve, reject) {
        console.log(snapshot.val().schedule);
        const schedule = new Schedule(date);
        Object.assign(schedule, snapshot.val().schedule)
        resolve(schedule);
      });
    } else {
      console.log("No data available and generating Schedule!")
      const schedule = await this.generateEmptySchedule(date);
      scheduleForDay = new Promise<Schedule>(function (resolve, reject) {
        resolve(schedule);

      })
    }

    return scheduleForDay;
  }


  async generateEmptySchedule(date: Date | string) {
    this.date = this.getDatee(date as Date);
    let schedule = new Schedule(date);
    console.log('entered function - generateEmptySchedule', date, this.date)
    let doctors = this.doctorService.doctors;

    for (let i = 0; i < doctors.length; i++) {
      let doctor = doctors[i];
      for (let j = 0; j < doctor.timeSlots.length; j++) {
        schedule.timeslots.push(doctor.timeSlots[j]);
      }
    }

    console.log(schedule);
    return schedule;

  }

}





