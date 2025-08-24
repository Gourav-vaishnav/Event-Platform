import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateEventForm from './components/CreateEventForm';
import EventDashboard from './components/EventDashboard';
import RsvpPage from './components/RsvpPage';
import { ThemeProvider } from './components/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

const AppContent: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen">
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm transition-colors duration-300 sticky top-0 z-10">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition">
                EventFlow
              </Link>
              <ThemeToggle />
            </div>
          </nav>
        </header>
        <main className="py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateEventForm />} />
            <Route path="/dashboard/:eventId" element={<EventDashboard />} />
            <Route path="/rsvp/:eventId" element={<RsvpPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
