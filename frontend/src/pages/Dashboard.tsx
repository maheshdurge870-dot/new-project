import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Calendar as CalendarIcon, Award, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const data = [
  { name: 'Jan', registrations: 400 },
  { name: 'Feb', registrations: 300 },
  { name: 'Mar', registrations: 550 },
  { name: 'Apr', registrations: 450 },
  { name: 'May', registrations: 700 },
  { name: 'Jun', registrations: 650 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_programs: 12,
    total_students: 450,
    total_registrations: 890,
    active_volunteers: 45
  });

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/analytics');
        setStats(response.data);
      } catch (e) {
        console.log('Using mock stats');
      }
    };
    if (user?.role === 'ADMIN' || user?.role === 'FACULTY') {
      fetchStats();
    }
  }, [user]);

  const statCards = [
    { name: 'Total Programs', value: stats.total_programs, icon: CalendarIcon, color: 'bg-blue-500' },
    { name: 'Total Students', value: stats.total_students, icon: Users, color: 'bg-emerald-500' },
    { name: 'Registrations', value: stats.total_registrations, icon: Activity, color: 'bg-amber-500' },
    { name: 'Active Volunteers', value: stats.active_volunteers, icon: Award, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg border border-slate-100">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-slate-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-slate-900">{item.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-slate-900 mb-4">Registration Overview</h2>
        <div className="bg-white p-4 shadow rounded-lg border border-slate-100" style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
              <Area type="monotone" dataKey="registrations" stroke="#2563eb" fillOpacity={1} fill="url(#colorReg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
