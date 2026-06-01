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
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f0f5ff' }}>
      <span style={{ display:'inline-block', width:28, height:28, border:'3px solid #bfdbfe', borderTopColor:'#1a56db', borderRadius:'50%', animation:'sp .65s linear infinite' }} />
      <style>{`@keyframes sp { to { transform: rotate(360deg); } }`}</style>
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
            {/* Public */}
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
