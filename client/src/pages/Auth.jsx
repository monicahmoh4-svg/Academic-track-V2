import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/Toast';
import api from '../utils/api';

function AuthWrap({ children, title, sub, wide }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#eff5ff 0%,#f0f9ff 50%,#f5f3ff 100%)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '2rem 1rem',
      overflowY: 'auto',
    }}>
      <div style={{ width: '100%', maxWidth: wide ? 540 : 460, paddingTop: '1rem', paddingBottom: '2rem' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{ width: 52, height: 52, borderRadius: 13, background: 'linear-gradient(135deg,#1a56db,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto .8rem', boxShadow: '0 4px 14px rgba(26,86,219,.35)' }}>🎓</div>
          <h1 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(1.5rem,4vw,1.8rem)', color: '#111827', marginBottom: '.2rem' }}>{title}</h1>
          <p style={{ color: '#6b7280', fontSize: '.88rem' }}>{sub}</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 18, padding: 'clamp(1.4rem,5vw,2.2rem)', boxShadow: '0 8px 32px rgba(0,0,0,.09)' }}>
          {children}
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.1rem', fontSize: '.8rem', color: '#9ca3af' }}>
          <Link to="/" style={{ color: '#6b7280' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF]       = useState({ regNumber: '', password: '' });
  const [err, setErr]   = useState('');
  const [loading, setL] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!f.regNumber || !f.password) { setErr('Both fields are required.'); return; }
    setL(true);
    try {
      const res = await api.post('/auth/login', f);
      login(res.data.token, res.data.student);
      showToast(`Welcome back, ${res.data.student.first_name}!`, 'success');
      nav('/app');
    } catch (e) {
      setErr(e.response?.data?.error || 'Login failed. Please try again.');
    } finally { setL(false); }
  };

  return (
    <AuthWrap title="Welcome Back" sub="Sign in to your student portal">
      <form onSubmit={submit}>
        <div className="fg">
          <label>Registration Number</label>
          <input type="text" placeholder="e.g. REG/2024/001"
            value={f.regNumber} onChange={e => setF(p => ({ ...p, regNumber: e.target.value }))} />
        </div>
        <div className="fg">
          <label>Password</label>
          <input type="password" placeholder="Your password"
            value={f.password} onChange={e => setF(p => ({ ...p, password: e.target.value }))} />
        </div>
        {err && <div className="err-box">{err}</div>}
        <button type="submit" className="btn btn-primary btn-block btn-lg"
          style={{ marginTop: '.3rem', boxShadow: '0 2px 10px rgba(26,86,219,.35)' }} disabled={loading}>
          {loading ? <><span className="spin" />&nbsp;Signing in…</> : 'Sign In →'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '.86rem', color: '#6b7280' }}>
        No account yet?&nbsp;<Link to="/register" style={{ color: '#1a56db', fontWeight: 500 }}>Register here</Link>
      </div>
    </AuthWrap>
  );
}

export function RegisterPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({
    firstName: '', lastName: '', regNumber: '', phone: '', email: '',
    academicLevel: '', department: '', researchTopic: '', password: '', password2: '',
  });
  const [err, setErr]   = useState('');
  const [loading, setL] = useState(false);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    const req = ['firstName','lastName','regNumber','phone','email','academicLevel','department','password'];
    if (req.some(k => !f[k])) { setErr('Please complete all required fields.'); return; }
    if (f.password !== f.password2) { setErr('Passwords do not match.'); return; }
    if (f.password.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    setL(true);
    try {
      const res = await api.post('/auth/register', f);
      login(res.data.token, res.data.student);
      showToast('Account created!', 'success');
      nav('/app');
    } catch (e) {
      setErr(e.response?.data?.error || 'Registration failed. Please try again.');
    } finally { setL(false); }
  };

  return (
    <AuthWrap title="Create Account" sub="Join AcademiTrack — Student Portal" wide>
      <form onSubmit={submit}>
        <div className="fgrid">
          <div className="fg">
            <label>First Name *</label>
            <input type="text" placeholder="First name" value={f.firstName} onChange={set('firstName')} />
          </div>
          <div className="fg">
            <label>Last Name *</label>
            <input type="text" placeholder="Last name" value={f.lastName} onChange={set('lastName')} />
          </div>
          <div className="fg full">
            <label>Registration Number *</label>
            <input type="text" placeholder="e.g. REG/2024/001" value={f.regNumber} onChange={set('regNumber')} />
          </div>
          <div className="fg full">
            <label>Phone Number *</label>
            <input type="tel" placeholder="+254 700 000 000" value={f.phone} onChange={set('phone')} />
          </div>
          <div className="fg full">
            <label>Email Address *</label>
            <input type="email" placeholder="you@university.edu" value={f.email} onChange={set('email')} />
          </div>
          <div className="fg full">
            <label>Academic Level *</label>
            <select value={f.academicLevel} onChange={set('academicLevel')}>
              <option value="">— Select level —</option>
              <option>Bachelor's Degree</option>
              <option>Master's Degree</option>
              <option>PhD / Postgraduate</option>
            </select>
          </div>
          <div className="fg full">
            <label>Department *</label>
            <input type="text" placeholder="e.g. Computer Science" value={f.department} onChange={set('department')} />
          </div>
          <div className="fg full">
            <label>Research Topic <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#9ca3af' }}>(optional)</span></label>
            <input type="text" placeholder="Your research area" value={f.researchTopic} onChange={set('researchTopic')} />
          </div>
          <div className="fg">
            <label>Password *</label>
            <input type="password" placeholder="Min 6 characters" value={f.password} onChange={set('password')} />
          </div>
          <div className="fg">
            <label>Confirm Password *</label>
            <input type="password" placeholder="Repeat password" value={f.password2} onChange={set('password2')} />
          </div>
        </div>
        {err && <div className="err-box">{err}</div>}
        <button type="submit" className="btn btn-primary btn-block btn-lg"
          style={{ marginTop: '.3rem', boxShadow: '0 2px 10px rgba(26,86,219,.35)' }} disabled={loading}>
          {loading ? <><span className="spin" />&nbsp;Creating account…</> : 'Create Account →'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '.86rem', color: '#6b7280' }}>
        Already registered?&nbsp;<Link to="/login" style={{ color: '#1a56db', fontWeight: 500 }}>Sign in here</Link>
      </div>
    </AuthWrap>
  );
}
