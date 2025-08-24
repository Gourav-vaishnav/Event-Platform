import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventById, deleteEvent } from '../services/eventService';
import { Event, Invitee, RSVPStatus } from '../types';
import RsvpChart from './RsvpChart';
import CalendarIcon from './icons/CalendarIcon';
import LocationIcon from './icons/LocationIcon';

const StatusBadge: React.FC<{ status: RSVPStatus }> = ({ status }) => {
  const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
  const statusClasses = {
    [RSVPStatus.Attending]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [RSVPStatus.Maybe]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    [RSVPStatus.NotAttending]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    [RSVPStatus.Pending]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};


const EventDashboard: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      const currentEvent = getEventById(eventId);
      setEvent(currentEvent || null);
      setConfirmDelete(false);
    }
  }, [eventId]);

  const handleDelete = () => {
    if (event) {
        deleteEvent(event.id);
        navigate('/');
    }
  };

  const rsvpLink = `${window.location.origin}${window.location.pathname}#/rsvp/${eventId}`;

  const stats = useMemo(() => {
    if (!event) return { attending: 0, maybe: 0, notAttending: 0, pending: 0, total: 0, views: 0 };
    return {
      attending: event.invitees.filter(i => i.status === RSVPStatus.Attending).length,
      maybe: event.invitees.filter(i => i.status === RSVPStatus.Maybe).length,
      notAttending: event.invitees.filter(i => i.status === RSVPStatus.NotAttending).length,
      pending: event.invitees.filter(i => i.status === RSVPStatus.Pending).length,
      total: event.invitees.length,
      views: event.views || 0,
    };
  }, [event]);

  if (!event) {
    return (
      <div className="text-center p-10">
        <h2 className="text-2xl text-slate-600 dark:text-slate-400">Event not found.</h2>
        <Link to="/" className="text-indigo-600 dark:text-indigo-400 hover:underline mt-4 inline-block">Back to My Events</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex justify-between items-start gap-4">
            <div>
                <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-2 inline-block">&larr; Back to Events</Link>
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{event.name}</h1>
            </div>
            <div className="flex-shrink-0 pt-8">
                {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-300">
                        Delete Event
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button onClick={handleDelete} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition">
                            Confirm Delete
                        </button>
                        <button onClick={() => setConfirmDelete(false)} className="text-slate-500 dark:text-slate-400 hover:underline">
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <aside className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Analytics</h2>
                    <div className="space-y-3 text-slate-600 dark:text-slate-300">
                        <div className="flex justify-between items-center"><span>RSVP Link Views:</span> <strong className="text-lg">{stats.views}</strong></div>
                        <hr className="border-slate-200 dark:border-slate-700" />
                        <div className="flex justify-between items-center"><span>Total Invited:</span> <strong className="text-lg">{stats.total}</strong></div>
                        <div className="flex justify-between items-center text-green-600 dark:text-green-400"><span>Attending:</span> <strong className="text-lg">{stats.attending}</strong></div>
                        <div className="flex justify-between items-center text-yellow-600 dark:text-yellow-400"><span>Maybe:</span> <strong className="text-lg">{stats.maybe}</strong></div>
                        <div className="flex justify-between items-center text-red-600 dark:text-red-400"><span>Not Attending:</span> <strong className="text-lg">{stats.notAttending}</strong></div>
                        <div className="flex justify-between items-center text-slate-500"><span>Pending:</span> <strong className="text-lg">{stats.pending}</strong></div>
                    </div>
                    <div className="mt-4">
                      <RsvpChart invitees={event.invitees} />
                    </div>
                </div>
            </aside>

            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Event Details</h3>
                    <div className="space-y-4">
                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                            <CalendarIcon className="h-6 w-6 mr-3 text-indigo-500 dark:text-indigo-400" />
                            <span className="text-lg">{new Date(event.datetime).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                            <LocationIcon className="h-6 w-6 mr-3 text-indigo-500 dark:text-indigo-400" />
                            <span className="text-lg">{event.location}</span>
                        </div>
                        {event.description && <p className="text-slate-700 dark:text-slate-400 pt-2 whitespace-pre-wrap">{event.description}</p>}
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">Shareable RSVP Link</h3>
                        <div className="flex items-center bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                            <input type="text" readOnly value={rsvpLink} className="flex-grow bg-transparent focus:outline-none text-indigo-700 dark:text-indigo-300"/>
                            <button onClick={() => navigator.clipboard.writeText(rsvpLink)} className="ml-2 bg-indigo-500 text-white font-semibold text-sm px-3 py-1 rounded-md hover:bg-indigo-600 transition">Copy</button>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Invitees ({stats.total})</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="p-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Email</th>
                                    <th className="p-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.invitees.map(invitee => (
                                    <tr key={invitee.email} className="border-b border-slate-100 dark:border-slate-700">
                                        <td className="p-2 text-slate-700 dark:text-slate-300">{invitee.email}</td>
                                        <td className="p-2"><StatusBadge status={invitee.status} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default EventDashboard;
