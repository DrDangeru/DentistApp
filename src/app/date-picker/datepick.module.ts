import {Component, Input} from "@angular/core";
import {ScheduleService} from "../schedule.service";
import {MatDatepickerModule, MatDatepickerInputEvent} from '@angular/material/datepicker';
import {UntypedFormControl} from "@angular/forms/";
import { UserService } from "../user.service";
import { Patient } from "../user.model";
import { DoctorService } from "../doctor.service";
import { Router } from "@angular/router";
import { Schedule } from "../schedule";
import { authState, onAuthStateChanged, getAuth} from '@angular/fire/auth';

@Component({
  selector: 'datepicker',
  templateUrl: './datepick.module.html',
  styleUrls: ['./datepicker.css']
})

export class Datepicker {

  date? : UntypedFormControl;
  dateString? : string;
  selectedDate?: Date;
  events: string[] = [];
  schedule? : Schedule;
  isAuth! : boolean;

  constructor(private scheduleService: ScheduleService, private userService : UserService, 
    private doctorService : DoctorService,  private router : Router) {
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }

  dateFilter(date: Date|null): boolean {
    let dateNow = new Date();
    if (date === null || dateNow > date) return false;
    let day = date.getDay();
    return (day != 0 && day != 6);
  }

  handleDate($event : any){
    console.log('this is In maybe',$event);
    let selectedDate : Date = new Date($event.value);
    let selectedDate1 = selectedDate.getTime();
    selectedDate1  = new Date(($event.value)).getTime()+10800001; // may need setup for time zones other than EU / GMT >+4
    let selectedDate2 = new Date(selectedDate1) as Date;
    this.selectedDate = selectedDate2;
    this.scheduleService.date$.next(selectedDate2);
    console.log( selectedDate2);
  }


  async goToSchedule(selectedDate:Date){
    console.log('starting goToSchedule');
    this.isAuth = this.userService.isAuth();
    if(this.isAuth){
        selectedDate= new Date(selectedDate);
        selectedDate.setDate(selectedDate.getDate() + 10800001); // 1 day earlier other wise
        this.scheduleService.getScheduleByDate(selectedDate).then
        (schedule => schedule = this.scheduleService.schedule!). // not sure how to fix
        catch(err => console.log(err,'Error occured!'))
      console.log('should be goint ToSchedule', selectedDate);
      }
      else {
        alert('Please login to reserve appointment');
        this.router.navigate(['login']);
      }
    };
  }




