export enum RSVPStatus {
  Pending = 'Pending',
  Attending = 'Attending',
  Maybe = 'Maybe',
  NotAttending = 'Not Attending',
}

export interface Invitee {
  email: string;
  status: RSVPStatus;
}

export interface Event {
  id: string;
  name: string;
  datetime: string;
  location: string;
  description: string;
  invitees: Invitee[];
  views: number;
}