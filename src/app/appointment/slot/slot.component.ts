import {Component, Input, OnInit, Output} from '@angular/core';
import {TimeSlot} from "../../timeSlot.model";
import {UserService} from "../../user.service";
import {AppointmentService} from "../../appointment.service";
import {HttpClient} from "@angular/common/http";
import {ScheduleService} from 'src/app/schedule.service';
import {Schedule} from 'src/app/schedule';
import {Appointment} from 'src/app/appointment';
import {Patient} from 'src/app/user.model';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.css']
})
export class SlotComponent implements OnInit {
  @Input() doctorName?: string;
  @Input() timeSlot!: TimeSlot;
  @Input() patient!: Patient | null;
  @Input() appointment!: Appointment;
  @Input() schedule !: Schedule;
  @Input() typeOfWork?: string;

constructor(private appointmentService: AppointmentService,
              private userService: UserService, private scheduleService: ScheduleService) {
  }

ngOnInit(): void {
  this.initAsync()
}

async initAsync() {
  this.userService.patient$.subscribe(patient =>this.patient = patient || null);
}

  makeAppointment() {
    console.log(this.schedule), console.log(this.patient), console.log(this.schedule.date)
    if (this.patient !== null && this.patient.hasAppointment !== true) {
      console.log(this.patient, 'This is patient data where we are getting underfined uid... I do not get it...')
      console.log('Appointment reservating started');
      let date = this.schedule.date;
      console.log(this.schedule.date, 'This is schedule date...')
      this.timeSlot.taken! = true;
      this.patient.hasAppointment! = true;
      this.patient.appointmentDate = date as string  +' ' + this.timeSlot.time as string;
      alert (this.patient.appointmentDate)
      this.timeSlot.taken! = true;
      this.timeSlot.typeOfWork = this.getTypeOfWork(); //default value logic embedded
      this.schedule.updateSlot(this.timeSlot);
      console.log('Timeslot updated');
      this.appointmentService.makeAppointment(this.schedule)
      this.userService.savePatient(this.patient); 

      console.log('makeAppointment called');
      console.log('Appointment reserved');
      alert('Appointment reserved')
    } else {
      alert('Patient already has an app if user field is not underfined in console log')
      console.log('patient not set or already has an appointment', this.patient);
    }

  }

  setTypeOfWork(value: string) {
    this.typeOfWork = value
  }

  getTypeOfWork() {
    if (this.typeOfWork === undefined) return 'Cleaning';
    return this.typeOfWork;
  }

  getDatee(date: Date): string {
    let selectedDate: Date = new Date();
    let selectedDate1 = selectedDate.getTime();
    selectedDate1 = new Date((date)).getTime() + 10800001; // may need setup for time zones other than EU / GMT >+4
    let selectedDate2 = new Date(selectedDate1) as Date;
    let dat = selectedDate2.toISOString();
    let da: string = dat.toString();
    return da.substring(0, 10);
  }
}


