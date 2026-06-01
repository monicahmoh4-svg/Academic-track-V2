import { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';

export default function AdminLogin({ onLogin }) {
  const { login } = useAdmin();
  const [f, setF]         = useState({ username: '', password: '' });
  const [err, setErr]     = useState('');
  const [loading, setL]   = useState(false);
  const [showPw, setShowPw] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!f.username || !f.password) { setErr('Both fields are required.'); return; }
    setL(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || 'Invalid credentials.'); return; }
      login(data.token, data.moderator);
      if (onLogin) onLogin();
    } catch {
      setErr('Connection error. Please try again.');
    } finally { setL(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: '#f0f5ff', fontFamily: 'var(--font-b)',
    }}>
      {/* Left panel — branding */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg,#0f2d6b 0%,#1a56db 60%,#0891b2 100%)',
        padding: '3rem', color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:-60, width:260, height:260, borderRadius:'50%', background:'rgba(255,255,255,.05)', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:2, textAlign:'center', maxWidth:340 }}>
          <div style={{ width:80, height:80, borderRadius:20, background:'rgba(255,255,255,.15)', border:'2px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:38, margin:'0 auto 1.5rem' }}>🛡️</div>
          <h1 style={{ fontFamily:'var(--font-h)', fontSize:'2.1rem', fontWeight:700, color:'#fff', marginBottom:'.7rem' }}>Admin Portal</h1>
          <p style={{ fontSize:'.95rem', color:'rgba(255,255,255,.75)', lineHeight:1.7, marginBottom:'2.5rem' }}>
            Secure access for authorised moderators. Manage students, review submissions, and control AcademiTrack.
          </p>
          {['👥 Manage all students','📤 Review & score submissions','🔔 Send notifications','✉️ Reply to student messages','👮 Manage moderator accounts'].map((item,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'.6rem', textAlign:'left' }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#93c5fd', flexShrink:0 }} />
              <span style={{ fontSize:'.9rem', color:'rgba(255,255,255,.8)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width:'100%', maxWidth:460,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'3rem 2.5rem', background:'#fff',
        boxShadow:'-4px 0 30px rgba(0,0,0,.08)',
      }}>
        <div style={{ width:'100%', maxWidth:360 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'1.8rem' }}>
            <div style={{ width:36, height:36, borderRadius:9, background:'linear-gradient(135deg,#1a56db,#0891b2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🎓</div>
            <span style={{ fontFamily:'var(--font-h)', fontWeight:700, fontSize:'1.1rem', color:'#111827' }}>AcademiTrack</span>
          </div>
          <h2 style={{ fontFamily:'var(--font-h)', fontSize:'1.75rem', color:'#111827', marginBottom:'.3rem' }}>Sign In</h2>
          <p style={{ fontSize:'.88rem', color:'#6b7280', marginBottom:'1.8rem' }}>Enter your admin credentials to continue</p>

          <form onSubmit={submit}>
            <div style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', fontSize:'.75rem', fontWeight:700, color:'#475569', marginBottom:'.36rem', letterSpacing:'.5px', textTransform:'uppercase' }}>Admin Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={f.username}
                onChange={e => setF(p => ({ ...p, username: e.target.value }))}
                autoComplete="username"
                autoFocus
                style={{ width:'100%', background:'#fff', border:'1.5px solid #cbd5e1', borderRadius:8, padding:'.68rem 1rem', color:'#0f172a', fontFamily:'var(--font-b)', fontSize:'.9rem', outline:'none' }}
                onFocus={e => e.target.style.borderColor='#1a56db'}
                onBlur={e => e.target.style.borderColor='#cbd5e1'}
              />
            </div>
            <div style={{ marginBottom:'1.2rem' }}>
              <label style={{ display:'block', fontSize:'.75rem', fontWeight:700, color:'#475569', marginBottom:'.36rem', letterSpacing:'.5px', textTransform:'uppercase' }}>Password</label>
              <div style={{ position:'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={f.password}
                  onChange={e => setF(p => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                  style={{ width:'100%', background:'#fff', border:'1.5px solid #cbd5e1', borderRadius:8, padding:'.68rem 2.8rem .68rem 1rem', color:'#0f172a', fontFamily:'var(--font-b)', fontSize:'.9rem', outline:'none' }}
                  onFocus={e => e.target.style.borderColor='#1a56db'}
                  onBlur={e => e.target.style.borderColor='#cbd5e1'}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:'1rem', color:'#9ca3af' }}
                  tabIndex={-1}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {err && (
              <div style={{ background:'#fee2e2', border:'1px solid #fca5a5', borderRadius:8, padding:'.62rem .95rem', color:'#991b1b', fontSize:'.83rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:8 }}>
                ⚠️ {err}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ width:'100%', padding:'.85rem', borderRadius:10, background:'linear-gradient(135deg,#1a56db,#1447b6)', color:'#fff', fontFamily:'var(--font-b)', fontSize:'.97rem', fontWeight:600, border:'none', cursor:'pointer', boxShadow:'0 4px 14px rgba(26,86,219,.4)', display:'flex', alignItems:'center', justifyContent:'center', gap:8, opacity:loading?.7:1 }}>
              {loading ? (
                <>
                  <span style={{ display:'inline-block', width:15, height:15, border:'2px solid rgba(255,255,255,.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'sp .65s linear infinite' }} />
                  Verifying…
                </>
              ) : 'Access Admin Portal →'}
            </button>
          </form>

          {/* Credentials hint */}
          <div style={{ marginTop:'1.8rem', padding:'1rem 1.1rem', background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:10, fontSize:'.8rem', lineHeight:1.75 }}>
            <div style={{ fontWeight:700, color:'#0369a1', marginBottom:'.45rem', fontSize:'.82rem' }}>🔑 Default Credentials</div>
            <div style={{ color:'#0c4a6e' }}>Username: <code style={{ background:'#e0f2fe', padding:'2px 7px', borderRadius:5, fontWeight:700, fontFamily:'monospace' }}>superadmin</code></div>
            <div style={{ color:'#0c4a6e', marginTop:'.3rem' }}>Password: <code style={{ background:'#e0f2fe', padding:'2px 7px', borderRadius:5, fontWeight:700, fontFamily:'monospace' }}>superadmin123</code></div>
            <div style={{ marginTop:'.65rem', color:'#dc2626', fontWeight:600, fontSize:'.75rem' }}>⚠️ Change after first login</div>
          </div>

          <div style={{ textAlign:'center', marginTop:'1.2rem', fontSize:'.77rem', color:'#9ca3af' }}>
            Restricted access — authorised personnel only
          </div>
        </div>
      </div>

      <style>{`@keyframes sp { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
