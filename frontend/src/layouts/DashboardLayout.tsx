import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Calendar, Users, FileText, 
  Settings, LogOut, Menu, Bell, CheckSquare, 
  MapPin, Award, MessageSquare
} from 'lucide-react';
import AIChatAssistant from '../components/AIChatAssistant';

export default function DashboardLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const getNavigation = () => {
    const baseNav = [
      { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
      { name: 'Programs', href: '/app/programs', icon: Calendar },
    ];
    
    if (user.role === 'ADMIN' || user.role === 'FACULTY') {
      return [
        ...baseNav,
        { name: 'Registrations', href: '/app/registrations', icon: Users },
        { name: 'Venues', href: '/app/venues', icon: MapPin },
        { name: 'Volunteers', href: '/app/volunteers', icon: CheckSquare },
        { name: 'Certificates', href: '/app/certificates', icon: Award },
        { name: 'Analytics', href: '/app/analytics', icon: FileText },
      ];
    }
    
    if (user.role === 'STUDENT') {
      return [
        ...baseNav,
        { name: 'My Schedule', href: '/app/schedule', icon: MapPin },
        { name: 'My Certificates', href: '/app/certificates', icon: Award },
        { name: 'Feedback', href: '/app/feedback', icon: MessageSquare },
      ];
    }
    
    return baseNav;
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-slate-200 bg-white">
        <div className="flex-1 flex flex-col min-h-0 pt-5 pb-4">
          <div className="flex items-center flex-shrink-0 px-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-slate-900">CampusEvent</span>
          </div>
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <item.icon className={`${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'} mr-3 flex-shrink-0 h-5 w-5`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-slate-200 p-4">
          <div className="flex items-center w-full">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-700">{user.name}</p>
              <p className="text-xs font-medium text-slate-500 group-hover:text-slate-700">{user.role}</p>
            </div>
            <button onClick={logout} className="ml-auto text-slate-400 hover:text-slate-500">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:pl-64">
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 flex-shrink-0 flex h-16 md:hidden">
          <button
            type="button"
            className="px-4 border-r border-slate-200 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex justify-between px-4 sm:px-6">
            <div className="flex-1 flex items-center">
              <span className="text-lg font-bold text-slate-900">CampusEvent</span>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="bg-white p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
        
        {/* Floating AI Assistant */}
        <AIChatAssistant />
      </div>
    </div>
  );
}
