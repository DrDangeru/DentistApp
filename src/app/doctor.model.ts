import {TimeSlot} from "./timeSlot.model";

export class Doctor extends TimeSlot {
  // doctorName: string; should use doctorName from TimeSlot, dont like it 2x here
  email?: string;
  specialty?: string;
  timeSlots: TimeSlot[] = [];
}
