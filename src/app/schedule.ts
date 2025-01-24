import {TimeSlot} from "./timeSlot.model";

export class Schedule {
  date: string;
  timeslots: TimeSlot[] = [];

  constructor(date : any) {
     this.date = this.getDatee(date);
  }
    
  getDatee (date : Date) : string{
    if(date.toDateString.length === 11){
      return this.date;}
    else{
        let selectedDate : Date = new Date();
        let selectedDate1 = selectedDate.getTime();
        selectedDate1  = new Date((date)).getTime()+10800001; // may need setup for time zones other than EU / GMT >+4
        let selectedDate2 = new Date(selectedDate1) as Date;
        let dat = selectedDate2.toISOString();
        let da : string = dat.toString();
        return this.date = da.substring(0,10);
      }
  }
    
  updateSlot(slot: TimeSlot)  {
    for(let i = 0; i < this.timeslots.length; i++) {
      if (this.timeslots[i].slotNumber === slot.slotNumber) {
        slot = this.timeslots[i];
        slot.date = this.date; 
        //slot.time = maybe not needed and may need ENUMS... 
      }
    }
  }
}
