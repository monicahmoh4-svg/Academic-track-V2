import { createContext, useContext, useState, useEffect } from 'react';

const AdminCtx = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adm_user')); } catch { return null; }
  });

  useEffect(() => {
    // Sync admin state if token is removed externally
    const token = localStorage.getItem('adm_token');
    if (!token) setAdmin(null);
  }, []);

  const login = (token, moderator) => {
    localStorage.setItem('adm_token', token);
    localStorage.setItem('adm_user', JSON.stringify(moderator));
    setAdmin(moderator);
  };

  const logout = () => {
    localStorage.removeItem('adm_token');
    localStorage.removeItem('adm_user');
    setAdmin(null);
    window.location.href = '/admin/login';
  };

  return (
    <AdminCtx.Provider value={{ admin, login, logout }}>
      {children}
    </AdminCtx.Provider>
  );
}

export const useAdmin = () => useContext(AdminCtx);
