import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminProvider } from './contexts/AdminContext';
import Toast from './components/Toast';
import Landing from './pages/Landing';
import { LoginPage, RegisterPage } from './pages/Auth';
import AppPage from './pages/AppPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f5ff' }}>
      <span className="spin" style={{ width: 28, height: 28, borderWidth: 3 }} />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/"         element={<Landing />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Student portal — protected */}
            <Route path="/app/*" element={<PrivateRoute><AppPage /></PrivateRoute>} />

            {/* Admin portal */}
            <Route path="/admin/login"
              element={<AdminLogin onLogin={() => window.location.replace('/admin/dashboard')} />}
            />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toast />
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
