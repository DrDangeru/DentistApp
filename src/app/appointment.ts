import {TimeSlot} from './timeSlot.model';

export class Appointment {
  public patientName?: string;
  public doctorName?: string;
  appointments: { patientName : string, doctorName : string, timeSlot :TimeSlot }[] = []; 
  public timeSlot?: TimeSlot;
  public date?: Date;

   constructor(public appointment: Appointment) {
   } 
}

