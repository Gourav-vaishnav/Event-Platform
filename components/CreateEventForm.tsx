import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../services/eventService';

const CreateEventForm: React.FC = () => {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [invitees, setInvitees] = useState<string[]>([]);
  const [currentInvitee, setCurrentInvitee] = useState('');
  const navigate = useNavigate();

  const handleAddInvitee = () => {
    if (currentInvitee && !invitees.includes(currentInvitee) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentInvitee)) {
      setInvitees([...invitees, currentInvitee]);
      setCurrentInvitee('');
    }
  };

  const handleRemoveInvitee = (emailToRemove: string) => {
    setInvitees(invitees.filter(email => email !== emailToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !datetime || !location) return;
    const newEvent = createEvent({ name, datetime, location, description }, invitees);
    navigate(`/dashboard/${newEvent.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Create a New Event</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Event Name</label>
          <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="datetime" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Date & Time</label>
            <input type="datetime-local" id="datetime" value={datetime} onChange={e => setDatetime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
            <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200" />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200"></textarea>
        </div>
        <div>
          <label htmlFor="invitees" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Invitees</label>
          <div className="flex mt-1">
            <input type="email" id="invitees" value={currentInvitee} onChange={e => setCurrentInvitee(e.target.value)} placeholder="invitee@example.com" className="flex-grow px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 dark:text-slate-200" />
            <button type="button" onClick={handleAddInvitee} className="bg-indigo-500 text-white font-semibold px-4 py-2 rounded-r-md hover:bg-indigo-600 transition">Add</button>
          </div>
          <ul className="mt-2 space-y-1">
            {invitees.map(email => (
              <li key={email} className="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-2 rounded">
                <span className="text-sm text-slate-600 dark:text-slate-300">{email}</span>
                <button type="button" onClick={() => handleRemoveInvitee(email)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEventForm;