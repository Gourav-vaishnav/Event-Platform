import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById, updateInviteeRsvp, incrementEventView } from '../services/eventService';
import { Event, RSVPStatus } from '../types';
import CalendarIcon from './icons/CalendarIcon';
import LocationIcon from './icons/LocationIcon';

const RsvpPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<RSVPStatus | null>(null);
  const [viewIncremented, setViewIncremented] = useState(false);

  useEffect(() => {
    if (eventId) {
      const foundEvent = getEventById(eventId);
      setEvent(foundEvent || null);
      if (foundEvent && !viewIncremented) {
        incrementEventView(eventId);
        setViewIncremented(true);
      }
    }
  }, [eventId, viewIncremented]);

  const handleSubmit = (status: RSVPStatus) => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!event) {
        setError('Event not found.');
        return;
    }

    const isInvited = event.invitees.some(invitee => invitee.email.toLowerCase() === email.toLowerCase());
    if (!isInvited) {
        setError('This email address is not on the invite list.');
        return;
    }
    
    const success = updateInviteeRsvp(event.id, email, status);
    if (success) {
      setSubmitted(true);
      setSubmittedStatus(status);
      setError('');
    } else {
      setError('An error occurred. Please try again.');
    }
  };

  if (!event) {
    return <div className="text-center p-10 text-2xl text-slate-600 dark:text-slate-400">Event not found.</div>;
  }
  
  if (submitted) {
    return (
        <div className="max-w-lg mx-auto mt-10 p-8 bg-white dark:bg-slate-800 rounded-lg shadow-xl text-center">
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">Thank you!</h1>
            <p className="text-slate-700 dark:text-slate-300 text-lg">Your RSVP has been recorded as: <strong className="font-semibold">{submittedStatus}</strong>.</p>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight text-center">{event.name}</h1>
        <p className="text-center text-slate-500 dark:text-slate-400 mt-2">You're invited!</p>
        
        <div className="mt-6 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="flex items-start text-slate-700 dark:text-slate-300">
                <CalendarIcon className="h-6 w-6 mr-4 mt-1 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                <span className="text-lg font-medium">{new Date(event.datetime).toLocaleString()}</span>
            </div>
            <div className="flex items-start text-slate-700 dark:text-slate-300">
                <LocationIcon className="h-6 w-6 mr-4 mt-1 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                <span className="text-lg font-medium">{event.location}</span>
            </div>
             {event.description && <p className="text-slate-600 dark:text-slate-400 pt-2 whitespace-pre-wrap">{event.description}</p>}
        </div>

        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
            <h2 className="text-xl font-bold text-center text-slate-700 dark:text-slate-200">Will you attend?</h2>
            <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Confirm your email</label>
                <input 
                    type="email" 
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required 
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-slate-200" />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <button onClick={() => handleSubmit(RSVPStatus.Attending)} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105">Yes</button>
                <button onClick={() => handleSubmit(RSVPStatus.Maybe)} className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 transform hover:scale-105">Maybe</button>
                <button onClick={() => handleSubmit(RSVPStatus.NotAttending)} className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-105">No</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RsvpPage;