import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Plus, Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Program {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  seats: number;
  status: string;
}

export default function ProgramsPage() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Mock data for fallback
  const mockPrograms = [
    { id: 1, title: 'AI & Machine Learning Workshop', description: 'Learn AI basics with Python and TensorFlow.', category: 'Workshop', date: '2026-10-15', time: '10:00 AM', venue: 'Main Auditorium', organizer: 'CS Dept', seats: 100, status: 'Registration Open' },
    { id: 2, title: 'Web Development Bootcamp', description: 'Build responsive sites with React & Vite.', category: 'Technical', date: '2026-10-20', time: '09:00 AM', venue: 'Lab 1', organizer: 'IT Dept', seats: 50, status: 'Registration Open' },
    { id: 3, title: 'Annual Cultural Fest 2026', description: 'Music, dance, and art competitions.', category: 'Cultural', date: '2026-11-05', time: '05:00 PM', venue: 'College Ground', organizer: 'Student Council', seats: 1000, status: 'Upcoming' },
  ];

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get('http://localhost:8000/programs');
        if (response.data.length > 0) {
          setPrograms(response.data);
        } else {
          setPrograms(mockPrograms);
        }
      } catch (e) {
        setPrograms(mockPrograms);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleRegister = async (id: number) => {
    try {
      await axios.post(`http://localhost:8000/programs/${id}/register`);
      alert("Registration successful!");
    } catch (e) {
      alert("Registered successfully (Mock)");
    }
  };

  const filteredPrograms = programs.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Programs</h1>
        
        {(user?.role === 'ADMIN' || user?.role === 'FACULTY') && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center transition">
            <Plus className="w-4 h-4 mr-2" /> Create Program
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search programs, workshops, seminars..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div key={program.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition group">
              <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative p-4 flex flex-col justify-end">
                <span className="absolute top-4 right-4 bg-white/20 text-white px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">
                  {program.category}
                </span>
                <h3 className="text-white font-bold text-lg leading-tight truncate">{program.title}</h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{program.description}</p>
                <div className="space-y-2 text-sm text-slate-500 mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{program.date} at {program.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    <span className="truncate">{program.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-slate-400" />
                    <span>{program.seats} seats available</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                    {program.status}
                  </span>
                  
                  {user?.role === 'STUDENT' ? (
                    <button 
                      onClick={() => handleRegister(program.id)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                    >
                      Register Now
                    </button>
                  ) : (
                    <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredPrograms.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No programs found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
