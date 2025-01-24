import {
  Component, OnInit, Input, ElementRef, ViewChild, Directive,
  AfterViewInit, AfterContentInit, Renderer2
} from '@angular/core';
import { Appointment } from '../appointment';
import { TimeSlot } from '../timeSlot.model';
import { Doctor } from '../doctor.model';
import { Patient } from '../user.model';
import { async, asyncScheduler, Observable } from "rxjs";
import { AppointmentService } from "../appointment.service";
import { DoctorService } from "../doctor.service";
import { UserService } from "../user.service";
import { Schedule } from '../schedule';
import { ScheduleService } from '../schedule.service';
import { Router } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';

// @Directive({selector: 'sched'})
// class Sched{}

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})

export class AppointmentComponent implements OnInit {  //AfterContentInit , AfterViewInit
  @Input() doctorName?: any;
  @Input() timeSlot?: TimeSlot;
  @Input() patient?: Patient;
  @Input() schedule?: Schedule;
  @Input() date?: Date;
  @Input() typeOfWork?: string;
  old_date?: Date;
  viewDate!: string;

  appointments: { date: string, patientName: string, doctorName: string, timeSlot: TimeSlot }[] = [];
  patient$?: Patient | null;
  doctors: Observable<Doctor[]>;

  constructor(private scheduleService: ScheduleService,
    private doctorService: DoctorService,
    private userService: UserService) {
    this.doctors = this.doctorService.getDoctors();
    this.userService.patient$.subscribe(patient => this.patient = patient!)
  }

  ngOnInit(): void {
    this.initAsync(); // probably does not update schedule date
  }

  async initAsync() {
    this.userService.patient$.subscribe(patient => this.patient = patient!) // cleaner but makes no diff
    console.log(this.patient);
    if (this.patient !== null && this.patient?.hasAppointment === false) {
      this.scheduleService.date$.subscribe(date => this.date = date!)
      this.scheduleService.getScheduleByDate(this.date!)
        .then(schedule => {
          this.schedule = schedule;
          this.viewDate = this.schedule!.date;
          console.log(this.viewDate)
          window.document.getElementById('appointmentTable')!.scrollIntoView();
          console.log(schedule);

        })
    }
    else {
      alert('You already have reserved an appointment');
      return;
    }
  }

  scrollIntoView(): boolean {
    if (!this.schedule) return false;

    if (!this.old_date || this.schedule.getDatee(this.old_date!) != this.schedule.getDatee(this.date!)) {
      console.log('loaded')
      window.document.getElementById('appointmentTable')!.scrollIntoView();
      this.old_date = this.date;
      return true;
    }
    return false;
  }
}