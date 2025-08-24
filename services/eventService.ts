import { Event, RSVPStatus, Invitee } from '../types';

const EVENTS_KEY = 'events';

export const getEvents = (): Event[] => {
  const eventsJson = localStorage.getItem(EVENTS_KEY);
  return eventsJson ? JSON.parse(eventsJson) : [];
};

export const getEventById = (id: string): Event | undefined => {
  const events = getEvents();
  return events.find(event => event.id === id);
};

export const createEvent = (eventData: Omit<Event, 'id' | 'invitees' | 'views'>, inviteeEmails: string[]): Event => {
  const events = getEvents();
  const newEvent: Event = {
    ...eventData,
    id: `evt-${Date.now()}`,
    invitees: inviteeEmails.map(email => ({ email, status: RSVPStatus.Pending })),
    views: 0,
  };
  events.push(newEvent);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return newEvent;
};

export const deleteEvent = (eventId: string): void => {
  let events = getEvents();
  events = events.filter(event => event.id !== eventId);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
};

export const incrementEventView = (eventId: string): void => {
  const events = getEvents();
  const eventIndex = events.findIndex(event => event.id === eventId);
  if (eventIndex !== -1) {
    events[eventIndex].views = (events[eventIndex].views || 0) + 1;
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }
};

export const updateInviteeRsvp = (eventId: string, email: string, status: RSVPStatus): boolean => {
  const events = getEvents();
  const eventIndex = events.findIndex(event => event.id === eventId);
  if (eventIndex === -1) return false;

  const inviteeIndex = events[eventIndex].invitees.findIndex(invitee => invitee.email.toLowerCase() === email.toLowerCase());
  if (inviteeIndex === -1) return false;

  events[eventIndex].invitees[inviteeIndex].status = status;
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return true;
};