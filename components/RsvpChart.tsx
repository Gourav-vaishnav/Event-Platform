import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Invitee, RSVPStatus } from '../types';
import { useTheme } from './ThemeContext';

interface RsvpChartProps {
  invitees: Invitee[];
}

const RsvpChart: React.FC<RsvpChartProps> = ({ invitees }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#e2e8f0' : '#334155';

  const data = [
    { name: 'Attending', value: invitees.filter(i => i.status === RSVPStatus.Attending).length },
    { name: 'Maybe', value: invitees.filter(i => i.status === RSVPStatus.Maybe).length },
    { name: 'Not Attending', value: invitees.filter(i => i.status === RSVPStatus.NotAttending).length },
    { name: 'Pending', value: invitees.filter(i => i.status === RSVPStatus.Pending).length },
  ].filter(d => d.value > 0);

  const COLORS = {
    [RSVPStatus.Attending]: '#10B981', // Emerald 500
    [RSVPStatus.Maybe]: '#F59E0B',      // Amber 500
    [RSVPStatus.NotAttending]: '#EF4444', // Red 500
    [RSVPStatus.Pending]: '#6B7280',     // Gray 500
  };

  if (invitees.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
        <p className="text-slate-500 dark:text-slate-400">No invitees yet.</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as RSVPStatus]} />
          ))}
        </Pie>
        <Tooltip
            contentStyle={{
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
            }}
        />
        <Legend wrapperStyle={{ color: textColor }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default RsvpChart;
