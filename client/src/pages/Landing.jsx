import { useNavigate } from 'react-router-dom';

const HERO_IMAGE    = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=85&auto=format&fit=crop';
const HERO_FALLBACK = 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1600&q=85&auto=format&fit=crop';

export default function Landing() {
  const nav = useNavigate();

  const features = [
    { ico: '📋', color: '#1a56db', title: 'Multi-Level Submissions',
      desc: 'Submit proposals, results, presentations and publications — each advancing through Department → Faculty → Postgraduate Board.' },
    { ico: '🤖', color: '#7c3aed', title: 'AI-Powered Scoring',
      desc: 'Every submission is automatically evaluated by AI with an instant quality score and detailed academic feedback.' },
    { ico: '📊', color: '#0891b2', title: 'Live Progress Tracking',
      desc: 'Visual dashboard showing exactly where each submission stands across all three review levels in real time.' },
    { ico: '🔔', color: '#059669', title: 'Smart Notifications',
      desc: 'Receive targeted announcements and personalised feedback directly from your assigned moderator.' },
    { ico: '✉️', color: '#d97706', title: 'Direct Messaging',
      desc: 'Message your moderator and track replies — all within your secure student portal.' },
    { ico: '🎓', color: '#dc2626', title: 'All Academic Levels',
      desc: "Tailored for Bachelor's, Master's, and PhD / Postgraduate students across every department." },
  ];

  const steps = [
    { n: '01', ico: '🏫', name: 'Department',     sub: 'Initial Review',      bg: '#eff5ff', border: '#1a56db', tc: '#1e40af' },
    { n: '02', ico: '🏛️', name: 'School Faculty', sub: 'Intermediate Review', bg: '#f0fdf4', border: '#059669', tc: '#065f46' },
    { n: '03', ico: '🎓', name: 'Postgrad Board',  sub: 'Final Approval',     bg: '#fdf4ff', border: '#7c3aed', tc: '#5b21b6' },
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'var(--font-b)', overflowX: 'hidden' }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 500,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 8px rgba(0,0,0,.07)',
        height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg,#1a56db,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, boxShadow: '0 2px 8px rgba(26,86,219,.3)' }}>🎓</div>
          <div>
            <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: '#0f172a', fontSize: '1.15rem', lineHeight: 1.1 }}>AcademiTrack</div>
            <div style={{ fontSize: '.55rem', color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase' }}>Student Progress System</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => nav('/login')}
            style={{ padding: '.45rem 1rem', borderRadius: 7, background: 'transparent', border: '1.5px solid #d1d5db', color: '#374151', fontFamily: 'var(--font-b)', fontSize: '.83rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Sign In
          </button>
          <button onClick={() => nav('/register')}
            style={{ padding: '.45rem 1rem', borderRadius: 7, background: 'linear-gradient(135deg,#1a56db,#1447b6)', color: '#fff', fontFamily: 'var(--font-b)', fontSize: '.83rem', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(26,86,219,.35)', whiteSpace: 'nowrap' }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img
          src={HERO_IMAGE}
          alt="University campus"
          onError={e => { e.currentTarget.src = HERO_FALLBACK; }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg,rgba(5,12,45,.92) 0%,rgba(8,20,65,.82) 40%,rgba(8,20,65,.5) 65%,rgba(8,20,65,.15) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: .025, backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', padding: '3rem 1.25rem' }}>
          <div style={{ maxWidth: 660, margin: '0 auto' }}>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.22)', backdropFilter: 'blur(8px)', color: 'rgba(255,255,255,.9)', fontSize: '.7rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', padding: '.4rem 1rem', borderRadius: 30, marginBottom: '1.5rem' }}>
              🏛️ Academic Progress Tracking Platform
            </div>

            <h1 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(2rem,6vw,3.8rem)', fontWeight: 700, lineHeight: 1.08, color: '#fff', marginBottom: '1.2rem', textShadow: '0 2px 20px rgba(0,0,0,.5)' }}>
              Track Every Step<br />of Your{' '}
              <span style={{ background: 'linear-gradient(90deg,#93c5fd,#a5b4fc,#c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Academic Journey
              </span>
            </h1>

            <p style={{ fontSize: 'clamp(.92rem,2.5vw,1.07rem)', color: 'rgba(255,255,255,.78)', lineHeight: 1.8, fontWeight: 300, marginBottom: '2.2rem', maxWidth: 540 }}>
              From Bachelor's to PhD — submit proposals, results, and publications. Monitor progress through{' '}
              <strong style={{ color: '#93c5fd', fontWeight: 500 }}>Department</strong>,{' '}
              <strong style={{ color: '#6ee7b7', fontWeight: 500 }}>School Faculty</strong>, and{' '}
              <strong style={{ color: '#c4b5fd', fontWeight: 500 }}>Postgraduate Board</strong>{' '}
              with AI-powered automatic scoring.
            </p>

            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <button onClick={() => nav('/register')}
                style={{ padding: '.82rem 2rem', borderRadius: 10, background: 'linear-gradient(135deg,#1a56db,#1447b6)', color: '#fff', fontFamily: 'var(--font-b)', fontWeight: 700, fontSize: '.97rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 18px rgba(26,86,219,.55)', whiteSpace: 'nowrap' }}>
                Start Tracking →
              </button>
              <button onClick={() => nav('/login')}
                style={{ padding: '.82rem 1.6rem', borderRadius: 10, background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)', color: '#fff', fontFamily: 'var(--font-b)', fontWeight: 500, fontSize: '.97rem', border: '2px solid rgba(255,255,255,.38)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Sign In
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              {[{ val: '3', label: 'Review Levels' }, { val: '4', label: 'Doc Types' }, { val: 'AI', label: 'Auto Score' }, { val: '∞', label: 'Students' }].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,.18)', borderRadius: 9, padding: '.55rem 1rem', textAlign: 'center', minWidth: 72 }}>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '.63rem', color: 'rgba(255,255,255,.6)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10, color: 'rgba(255,255,255,.45)', fontSize: '1.2rem', animation: 'bounce 2.2s ease-in-out infinite' }}>↓</div>
      </section>

      {/* ══ REVIEW JOURNEY ══ */}
      <section style={{ background: '#fff', padding: 'clamp(3rem,8vw,5.5rem) 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: '#eff5ff', color: '#1a56db', fontSize: '.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '.3rem 1rem', borderRadius: 20, marginBottom: '1rem' }}>How It Works</span>
          <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(1.7rem,4vw,2.3rem)', color: '#0f172a', marginBottom: '.5rem' }}>The Review Journey</h2>
          <p style={{ color: '#6b7280', fontSize: '.95rem', maxWidth: 480, margin: '0 auto 3rem' }}>Every submission advances through three progressive levels of academic scrutiny</p>

          {/* Steps — horizontal on desktop, vertical on mobile */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '.5rem' }}>
            {steps.map((s, i) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ background: s.bg, border: `2px solid ${s.border}`, borderRadius: 14, padding: '1.5rem 1.6rem', minWidth: 160, textAlign: 'center', boxShadow: `0 4px 20px ${s.border}20`, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: s.border, color: '#fff', fontSize: '.63rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20, letterSpacing: '1px', whiteSpace: 'nowrap' }}>STEP {s.n}</div>
                  <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>{s.ico}</div>
                  <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: s.tc, fontSize: '1rem', marginBottom: '.25rem' }}>{s.name}</div>
                  <div style={{ fontSize: '.74rem', color: '#6b7280' }}>{s.sub}</div>
                </div>
                {i < steps.length - 1 && <div style={{ color: '#cbd5e1', fontSize: '1.3rem', padding: '0 .5rem' }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section style={{ background: '#f8fafc', padding: 'clamp(3rem,8vw,5.5rem) 1.25rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ display: 'inline-block', background: '#eff5ff', color: '#1a56db', fontSize: '.7rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', padding: '.3rem 1rem', borderRadius: 20, marginBottom: '1rem' }}>Features</span>
            <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(1.7rem,4vw,2.3rem)', color: '#0f172a', marginBottom: '.5rem' }}>Everything You Need</h2>
            <p style={{ color: '#6b7280', fontSize: '.95rem', maxWidth: 440, margin: '0 auto' }}>A complete academic progress management platform</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.1rem' }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 13, padding: '1.5rem', borderTop: `3px solid ${f.color}`, boxShadow: '0 1px 4px rgba(0,0,0,.05)', transition: 'transform .2s, box-shadow .2s' }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,.1)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.05)'; }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${f.color}14`, border: `1px solid ${f.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '.9rem' }}>{f.ico}</div>
                <div style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: '#0f172a', fontSize: '1.03rem', marginBottom: '.4rem' }}>{f.title}</div>
                <div style={{ fontSize: '.85rem', color: '#6b7280', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section style={{ background: 'linear-gradient(135deg,#0f2d6b 0%,#1a56db 55%,#0891b2 100%)', padding: 'clamp(3rem,8vw,5rem) 1.25rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: .05, backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '26px 26px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 580, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', color: '#fff', marginBottom: '.9rem', fontWeight: 700 }}>Ready to Track Your Progress?</h2>
          <p style={{ color: 'rgba(255,255,255,.78)', fontSize: 'clamp(.9rem,2.5vw,1.05rem)', marginBottom: '2rem', lineHeight: 1.75 }}>Join students across all academic levels managing their journey with AcademiTrack.</p>
          <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => nav('/register')} style={{ padding: '.85rem 2.2rem', borderRadius: 9, background: '#fff', color: '#1a56db', fontFamily: 'var(--font-b)', fontWeight: 700, fontSize: '.97rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }}>Create Free Account</button>
            <button onClick={() => nav('/login')} style={{ padding: '.85rem 1.8rem', borderRadius: 9, background: 'transparent', color: '#fff', fontFamily: 'var(--font-b)', fontWeight: 500, fontSize: '.97rem', border: '2px solid rgba(255,255,255,.45)', cursor: 'pointer', whiteSpace: 'nowrap' }}>Sign In</button>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,.38)', padding: '1.8rem 1.25rem', textAlign: 'center', fontSize: '.8rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: '.4rem' }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,#1a56db,#0891b2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🎓</div>
          <span style={{ fontFamily: 'var(--font-h)', fontSize: '.95rem', color: 'rgba(255,255,255,.55)' }}>AcademiTrack</span>
        </div>
        <p>© {new Date().getFullYear()} AcademiTrack — Empowering Academic Excellence</p>
      </footer>

      <style>{`
        @keyframes bounce {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(9px); }
        }
      `}</style>
    </div>
  );
}
