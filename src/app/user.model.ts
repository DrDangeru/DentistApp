export interface User {
  name: string;
  email: string;
  phone: string;
  hasAppointment: boolean;
  //password: string;
  uid : string;
  leftFeedback : boolean ;
}

export class Patient implements User {
  uid: string;
  email: string;
  name: string; // was not using it, guess messing with user creating/init
  phone: string;
  hasAppointment: boolean = false;
  leftFeedback : boolean = false;
  appointmentDate? : string ;
  cancellationReason: string = '';

  constructor(email: string, name: string, phone: string, hasAppointment:boolean, leftFeedback:boolean,
     uid:string, appointmentDate : string, cancellationReason? : string ) {
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.hasAppointment = hasAppointment;
    this.leftFeedback = leftFeedback;
    this.uid = uid;
    this.appointmentDate = appointmentDate;
    this.cancellationReason = cancellationReason || ' ';
  }

}