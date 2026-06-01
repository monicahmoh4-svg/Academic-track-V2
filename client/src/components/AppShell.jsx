import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from './Toast';

const NAV = [
  { id: 'dashboard',     ico: '📊', label: 'Dashboard',    group: 'Main' },
  { id: 'progress',      ico: '📈', label: 'My Progress',   group: 'Main' },
  { id: 'submit',        ico: '📤', label: 'Submissions',   group: 'Main' },
  { id: 'notifications', ico: '🔔', label: 'Notifications', group: 'Communication' },
  { id: 'messages',      ico: '✉️', label: 'Messages',      group: 'Communication' },
  { id: 'profile',       ico: '👤', label: 'My Profile',    group: 'Account' },
];

export default function AppShell({ active, setPanel, children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user
    ? (user.first_name[0] + user.last_name[0]).toUpperCase()
    : '??';

  const groups = [...new Set(NAV.map(n => n.group))];

  const handleNav = (id) => {
    setPanel(id);
    setSidebarOpen(false); // close on mobile after tap
  };

  const levelBadge = {
    "Bachelor's Degree":  { bg: '#dbeafe', color: '#1e40af' },
    "Master's Degree":    { bg: '#d1fae5', color: '#065f46' },
    "PhD / Postgraduate": { bg: '#ede9fe', color: '#5b21b6' },
  }[user?.academic_level] || { bg: '#f1f5f9', color: '#475569' };

  return (
    <div className="app-shell">

      {/* ── TOP BAR ── */}
      <header className="app-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Hamburger — visible on mobile only */}
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(o => !o)}
            style={{
              background: 'none', border: '1.5px solid var(--border)',
              borderRadius: 'var(--r)', padding: '6px 8px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0,
            }}
            aria-label="Toggle menu"
          >
            {[0,1,2].map(i => (
              <span key={i} style={{ display: 'block', width: 18, height: 2, background: 'var(--text3)', borderRadius: 2 }} />
            ))}
          </button>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(135deg,#1a56db,#0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 17,
            }}>🎓</div>
            <div style={{ display: 'none' }} className="brand-text">
              <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: 'var(--text)', fontSize: '1.05rem', lineHeight: 1.1 }}>AcademiTrack</div>
              <div style={{ fontSize: '.58rem', color: 'var(--text4)', letterSpacing: '2px', textTransform: 'uppercase' }}>Student Portal</div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* User chip — condensed on mobile */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', padding: '.38rem .75rem',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg,#1a56db,#0891b2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: '#fff',
            }}>{initials}</div>
            <div className="user-name-text" style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '.83rem', fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                {user?.first_name} {user?.last_name}
              </div>
              <div style={{ fontSize: '.68rem', color: levelBadge.color, background: levelBadge.bg, padding: '1px 6px', borderRadius: 8, display: 'inline-block', marginTop: 1 }}>
                {user?.academic_level?.split(' ')[0]}
              </div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { logout(); showToast('Logged out', 'info'); }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="app-body">

        {/* Overlay for mobile sidebar */}
        <div
          className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* ── SIDEBAR ── */}
        <nav className={`app-sidebar${sidebarOpen ? ' open' : ''}`}>
          {/* Brand inside sidebar on desktop */}
          <div style={{ padding: '1rem 1.3rem .5rem', borderBottom: '1px solid var(--border)', marginBottom: '.5rem' }}>
            <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: 'var(--text)', fontSize: '1rem' }}>AcademiTrack</div>
            <div style={{ fontSize: '.6rem', color: 'var(--text4)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: 2 }}>Student Portal</div>
          </div>

          {groups.map(g => (
            <div key={g}>
              <div className="slabel">{g}</div>
              {NAV.filter(n => n.group === g).map(n => (
                <div
                  key={n.id}
                  className={`sitem${active === n.id ? ' on' : ''}`}
                  onClick={() => handleNav(n.id)}
                >
                  <span className="ico">{n.ico}</span>
                  <span>{n.label}</span>
                </div>
              ))}
            </div>
          ))}

          {/* Student info at bottom */}
          <div style={{ margin: '1rem 1.1rem .5rem', padding: '.8rem .9rem', background: 'var(--primary-lt)', border: '1px solid var(--primary-md)', borderRadius: 'var(--r)', fontSize: '.78rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '.15rem' }}>{user?.academic_level}</div>
            <div style={{ color: 'var(--text2)', fontWeight: 500 }}>{user?.reg_number}</div>
            <div style={{ color: 'var(--text3)', marginTop: 1 }}>{user?.department}</div>
          </div>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <main className="app-main">
          {children}
        </main>
      </div>

      {/* Inline responsive overrides */}
      <style>{`
        @media (min-width: 768px) {
          .brand-text { display: block !important; }
          .user-name-text { display: block; }
        }
        @media (max-width: 767px) {
          .user-name-text { display: none; }
        }
      `}</style>
    </div>
  );
}
