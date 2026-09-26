import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ArrowRight, CheckCircle2, Users, GraduationCap, LayoutDashboard } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <CalendarDays className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-slate-900">CampusEvent</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium">Log in</Link>
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Manage Every College</span>{' '}
                  <span className="block text-blue-600 xl:inline">Program in One Place.</span>
                </h1>
                <p className="mt-3 text-base text-slate-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Plan events, register students, manage volunteers, track attendance and issue certificates with CampusEvent. The ultimate college program management system.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                      Explore Programs <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-slate-50">
          <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center border-l border-slate-100">
             <div className="grid grid-cols-2 gap-4 p-8 w-full max-w-lg">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transform -rotate-2 hover:rotate-0 transition">
                  <Users className="h-10 w-10 text-blue-500 mb-2" />
                  <span className="text-2xl font-bold text-slate-900">500+</span>
                  <span className="text-sm text-slate-500">Students Active</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transform translate-y-4 hover:translate-y-0 transition">
                  <LayoutDashboard className="h-10 w-10 text-emerald-500 mb-2" />
                  <span className="text-2xl font-bold text-slate-900">50+</span>
                  <span className="text-sm text-slate-500">Programs Hosted</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transform rotate-2 hover:rotate-0 transition">
                  <GraduationCap className="h-10 w-10 text-purple-500 mb-2" />
                  <span className="text-2xl font-bold text-slate-900">1.2k</span>
                  <span className="text-sm text-slate-500">Certificates Issued</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center transform -translate-y-4 hover:-translate-y-0 transition">
                  <CheckCircle2 className="h-10 w-10 text-amber-500 mb-2" />
                  <span className="text-2xl font-bold text-slate-900">95%</span>
                  <span className="text-sm text-slate-500">Attendance Tracking</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
