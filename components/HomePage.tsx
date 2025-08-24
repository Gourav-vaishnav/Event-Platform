import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/eventService';
import { Event } from '../types';
import CalendarIcon from './icons/CalendarIcon';
import LocationIcon from './icons/LocationIcon';
import UsersIcon from './icons/UsersIcon';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    setEvents(getEvents());
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">My Events</h1>
        <Link
          to="/create"
          className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
        >
          + Create Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow">
          <h2 className="text-xl text-slate-600 dark:text-slate-300">No events found.</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Get started by creating your first event!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <Link key={event.id} to={`/dashboard/${event.id}`} className="block">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg hover:border-indigo-500 border border-transparent dark:hover:border-indigo-500 transition duration-300">
                <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">{event.name}</h3>
                <div className="flex items-center text-slate-500 dark:text-slate-400 mt-2">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span>{new Date(event.datetime).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-slate-500 dark:text-slate-400 mt-1">
                  <LocationIcon className="h-5 w-5 mr-2" />
                  <span>{event.location}</span>
                </div>
                 <div className="flex items-center text-slate-500 dark:text-slate-400 mt-1">
                  <UsersIcon className="h-5 w-5 mr-2" />
                  <span>{event.invitees.length} invitees</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;