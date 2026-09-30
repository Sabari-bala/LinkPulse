import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LinksPage from './pages/LinksPage';
import CreateLinkPage from './pages/CreateLinkPage';
import LinkDetailsPage from './pages/LinkDetailsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authenticated routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/create-link" element={<CreateLinkPage />} />
        <Route path="/link-details/:id" element={<LinkDetailsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/analytics/:id" element={<AnalyticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}