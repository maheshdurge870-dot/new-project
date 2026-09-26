import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import ProgramsPage from './pages/ProgramsPage';
import VenuesPage from './pages/VenuesPage';
import CertificatesPage from './pages/CertificatesPage';
import GenericPage from './pages/GenericPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="programs" element={<ProgramsPage />} />
            <Route path="venues" element={<VenuesPage />} />
            <Route path="certificates" element={<CertificatesPage />} />
            <Route path="registrations" element={<GenericPage title="Registrations Management" />} />
            <Route path="volunteers" element={<GenericPage title="Volunteers Management" />} />
            <Route path="analytics" element={<GenericPage title="Analytics & Reports" />} />
            <Route path="schedule" element={<GenericPage title="My Schedule" />} />
            <Route path="feedback" element={<GenericPage title="Feedback" />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
