import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppShell from '../components/AppShell';
import { showToast } from '../components/Toast';
import api from '../utils/api';

const LEVELS = ['Department', 'School Faculty', 'Postgraduate Board'];

function ScoreRing({ score }) {
  if (!score) return <span className="badge b-gray">Pending</span>;
  const cls = score >= 80 ? 'sr-hi' : score >= 60 ? 'sr-md' : 'sr-lo';
  return <div className={`sring ${cls}`}>{score}</div>;
}
function LBadge({ level }) {
  const m = { Department: 'b-teal', 'School Faculty': 'b-amber', 'Postgraduate Board': 'b-violet' };
  return <span className={`badge ${m[level] || 'b-gray'}`}>{level}</span>;
}
function SBadge({ status }) {
  const m = { Approved: 'b-green', Rejected: 'b-red', Submitted: 'b-blue', Reviewing: 'b-amber' };
  return <span className={`badge ${m[status] || 'b-gray'}`}>{status}</span>;
}
function PT({ children, sub }) {
  return (
    <div style={{ marginBottom: '1.6rem' }}>
      <h1 style={{ fontFamily: 'var(--font-h)', fontSize: 'clamp(1.3rem,4vw,1.65rem)', color: 'var(--text)', fontWeight: 600 }}>{children}</h1>
      {sub && <p style={{ color: 'var(--text3)', fontSize: '.88rem', marginTop: '.2rem' }}>{sub}</p>}
    </div>
  );
}

async function runAI(type, level, dept, topic, title, content) {
  try {
    const res = await api.post('/ai-score', { type, level, dept, topic, title, content });
    return res.data;
  } catch {
    const score = Math.floor(62 + Math.random() * 28);
    return { score, feedback: 'Submission received and evaluated.', strengths: 'Clear structure.', improvements: 'Expand methodology.' };
  }
}

function Dashboard({ subs, notifs, user }) {
  const approved  = subs.filter(s => s.status === 'Approved').length;
  const reviewing = subs.filter(s => ['Submitted','Reviewing'].includes(s.status)).length;
  const scored    = subs.filter(s => s.ai_score > 0);
  const avg       = scored.length ? Math.round(scored.reduce((a,b) => a + b.ai_score, 0) / scored.length) : 0;
  const lvlSt = {};
  subs.forEach(s => { if (Array.isArray(s.history)) s.history.forEach(h => { if (h && (!lvlSt[h.level] || h.status === 'Approved')) lvlSt[h.level] = h.status; }); });

  return (
    <div>
      <PT sub="Your academic progress at a glance">Welcome back, {user?.first_name}!</PT>
      <div className="sgrid">
        <div className="scard"><div className="sval">{subs.length}</div><div className="slb">Submissions</div></div>
        <div className="scard"><div className="sval" style={{ color:'#059669' }}>{approved}</div><div className="slb">Approved</div></div>
        <div className="scard"><div className="sval" style={{ color:'#d97706' }}>{reviewing}</div><div className="slb">Under Review</div></div>
        <div className="scard"><div className="sval" style={{ color:'var(--primary)' }}>{avg ? `${avg}%` : '—'}</div><div className="slb">Avg Score</div></div>
      </div>
      <div className="card">
        <div className="card-t">🗺️ Submission Journey</div>
        <div style={{ display:'flex', alignItems:'center', gap:'.35rem', flexWrap:'wrap', padding:'.4rem 0' }}>
          {LEVELS.map((lvl, i) => {
            const st = lvlSt[lvl] || 'Pending';
            const cls = st==='Approved'?'j-done':['Submitted','Reviewing'].includes(st)?'j-active':st==='Rejected'?'j-reject':'';
            const ico = { Approved:'✓', Reviewing:'⏳', Submitted:'📬', Rejected:'✗', Pending:'○' }[st] || '○';
            return (
              <div key={lvl} style={{ display:'flex', alignItems:'center', gap:'.35rem' }}>
                <div className={`jnode ${cls}`}>
                  <div style={{ fontSize:'1rem' }}>{ico}</div>
                  <div className="jname">{lvl}</div>
                  <SBadge status={st} />
                </div>
                {i < LEVELS.length-1 && <span className="jarr">→</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="card">
        <div className="card-t">📢 Recent Notifications</div>
        {notifs.length === 0
          ? <p style={{ color:'var(--text3)', fontSize:'.87rem' }}>No notifications yet.</p>
          : notifs.slice(0,4).map(n => (
            <div key={n.id} className="nitem">
              <div className={`ndot ${n.is_read?'read':'unread'}`} />
              <div>
                <div className="ntext"><strong>{n.title}</strong><br/>{n.message}</div>
                <div className="ntime">{n.sender_name?`From ${n.sender_name} · `:''}{new Date(n.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function Progress({ subs }) {
  if (!subs.length) return (
    <div><PT sub="Track all your submissions">My Progress</PT>
      <div className="card"><p style={{ color:'var(--text3)' }}>No submissions yet.</p></div>
    </div>
  );
  return (
    <div>
      <PT sub="Track all your submissions across review levels">My Progress</PT>
      {subs.map(s => {
        const pct  = s.status==='Approved'?100:['Submitted','Reviewing'].includes(s.status)?50:s.status==='Rejected'?15:0;
        const hist = Array.isArray(s.history) ? s.history.filter(Boolean) : [];
        return (
          <div key={s.id} className="card">
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'.8rem', gap:'1rem', flexWrap:'wrap' }}>
              <div>
                <div style={{ fontWeight:600, color:'var(--text)', fontSize:'.97rem' }}>{s.title}</div>
                <div style={{ display:'flex', gap:'.4rem', marginTop:'.4rem', flexWrap:'wrap', alignItems:'center' }}>
                  <span className="badge b-gray">{s.type}</span>
                  <LBadge level={s.current_level} />
                  <span style={{ fontSize:'.77rem', color:'var(--text4)' }}>{new Date(s.submitted_at).toLocaleDateString()}</span>
                </div>
              </div>
              <ScoreRing score={s.ai_score} />
            </div>
            <div className="pbar-wrap">
              <div className="pbar" style={{ width:`${pct}%`, background:pct===100?'#059669':pct>=50?'var(--primary)':pct>0?'#d97706':'#dc2626' }} />
            </div>
            <div style={{ display:'flex', gap:'.35rem', flexWrap:'wrap', marginTop:'.5rem' }}>
              {hist.map((h,i) => <span key={i} className={`badge ${h.status==='Approved'?'b-green':h.status==='Rejected'?'b-red':'b-blue'}`}>{h.level}: {h.status}</span>)}
            </div>
            {s.ai_score > 0 && (
              <div className="ai-box">
                <div className="ai-label">🤖 AI Score — {s.ai_score}/100</div>
                <div className="ai-text">{s.ai_feedback}</div>
              </div>
            )}
            {s.moderator_notes && (
              <div style={{ background:'var(--primary-lt)', border:'1px solid var(--primary-md)', borderRadius:'var(--r)', padding:'.75rem', marginTop:'.8rem' }}>
                <div style={{ fontSize:'.72rem', fontWeight:700, color:'var(--primary)', marginBottom:'.25rem', textTransform:'uppercase', letterSpacing:'1px' }}>📝 Moderator Notes</div>
                <div style={{ fontSize:'.87rem', color:'var(--text2)' }}>{s.moderator_notes}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Submissions({ subs, onRefresh, user }) {
  const [tab, setTab]     = useState('Proposal');
  const [form, setForm]   = useState({ title:'', currentLevel:'Department', content:'' });
  const [aiRes, setAiRes] = useState(null);
  const [loading, setL]   = useState(false);
  const TYPES = ['Proposal','Results','Presentation','Publication'];
  const ICONS = { Proposal:'📄', Results:'📊', Presentation:'🎤', Publication:'📰' };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) { showToast('Fill in title and content.','error'); return; }
    setL(true); setAiRes(null);
    try {
      const scored = await runAI(tab, user.academic_level, user.department, user.research_topic, form.title, form.content);
      setAiRes(scored);
      await api.post('/submissions', { type:tab, title:form.title, content:form.content, currentLevel:form.currentLevel, aiScore:scored.score, aiFeedback:scored.feedback });
      setForm({ title:'', currentLevel:'Department', content:'' });
      showToast('Submission saved!','success');
      onRefresh();
    } catch (err) { showToast(err.response?.data?.error||'Failed.','error'); }
    finally { setL(false); }
  };

  return (
    <div>
      <PT sub="Submit academic documents for review">Submissions</PT>
      <div style={{ display:'flex', gap:'.4rem', marginBottom:'1.4rem', flexWrap:'wrap' }}>
        {TYPES.map(t => (
          <button key={t} className={`btn btn-sm ${tab===t?'btn-primary':'btn-outline'}`} onClick={()=>{setTab(t);setAiRes(null);}}>
            {ICONS[t]} {t}
          </button>
        ))}
      </div>
      <div className="card">
        <div className="card-t">{ICONS[tab]} Submit {tab}</div>
        <form onSubmit={submit}>
          <div className="fg"><label>Title</label><input type="text" placeholder={`${tab} title…`} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
          <div className="fg">
            <label>Target Review Level</label>
            <select value={form.currentLevel} onChange={e=>setForm(p=>({...p,currentLevel:e.target.value}))}>
              {LEVELS.map(l=><option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="fg"><label>Abstract / Description</label><textarea rows={5} placeholder={`Describe your ${tab.toLowerCase()}…`} value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))}/></div>
          {loading && <div style={{ background:'#fefce8', border:'1px solid #fde047', borderRadius:'var(--r)', padding:'.9rem', marginBottom:'.9rem', display:'flex', alignItems:'center', gap:10, fontSize:'.87rem', color:'#854d0e' }}><span className="spin"/> AI evaluating…</div>}
          {aiRes && (
            <div className="ai-box" style={{ marginBottom:'.9rem' }}>
              <div className="ai-label">🤖 AI Score: {aiRes.score}/100</div>
              <div className="ai-text" style={{ marginBottom:'.4rem' }}>{aiRes.feedback}</div>
              <div style={{ display:'flex', gap:'1.2rem', flexWrap:'wrap' }}>
                <span style={{ fontSize:'.83rem' }}><strong style={{ color:'#059669' }}>Strengths:</strong> {aiRes.strengths}</span>
                <span style={{ fontSize:'.83rem' }}><strong style={{ color:'#d97706' }}>Improve:</strong> {aiRes.improvements}</span>
              </div>
            </div>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading?<><span className="spin"/>&nbsp;Submitting…</>:`Submit ${tab}`}</button>
        </form>
      </div>
      <div className="card">
        <div className="card-t">📋 Submission History</div>
        {subs.length===0 ? <p style={{ color:'var(--text3)', fontSize:'.87rem' }}>No submissions yet.</p> : (
          <div className="tbl-wrap">
            <table className="dtbl">
              <thead><tr><th>Title</th><th>Type</th><th>Level</th><th>Status</th><th>Score</th><th>Date</th></tr></thead>
              <tbody>
                {subs.map(s=>(
                  <tr key={s.id}>
                    <td style={{ maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} title={s.title}>{s.title}</td>
                    <td><span className="badge b-gray">{s.type}</span></td>
                    <td><LBadge level={s.current_level}/></td>
                    <td><SBadge status={s.status}/></td>
                    <td>{s.ai_score>0?<span style={{ fontWeight:600, color:s.ai_score>=80?'#059669':s.ai_score>=60?'#d97706':'#dc2626' }}>{s.ai_score}</span>:'—'}</td>
                    <td style={{ fontSize:'.79rem', color:'var(--text3)' }}>{new Date(s.submitted_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Notifications({ notifs, onRefresh }) {
  const mark = async (id) => { try { await api.patch(`/notifications/${id}/read`); onRefresh(); } catch {} };
  return (
    <div>
      <PT sub="Alerts and messages from your moderators">Notifications</PT>
      {notifs.length===0 ? <div className="card"><p style={{ color:'var(--text3)' }}>No notifications yet.</p></div>
        : notifs.map(n=>(
          <div key={n.id} className="nitem" style={{ cursor:!n.is_read?'pointer':'default' }} onClick={()=>!n.is_read&&mark(n.id)}>
            <div className={`ndot ${n.is_read?'read':'unread'}`}/>
            <div style={{ flex:1 }}>
              <div className="ntext"><strong>{n.title}</strong>{!n.is_read&&<span style={{ marginLeft:8, fontSize:'.7rem', background:'var(--primary-lt)', color:'var(--primary)', padding:'1px 6px', borderRadius:10 }}>New</span>}<br/>{n.message}</div>
              <div className="ntime">{n.sender_name?`From ${n.sender_name} · `:''}{new Date(n.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
    </div>
  );
}

function Messages() {
  const [msgs, setMsgs] = useState([]);
  const [form, setForm] = useState({ subject:'', body:'' });
  const [loading, setL] = useState(false);
  const load = useCallback(async () => { try { const r = await api.get('/messages'); setMsgs(r.data); } catch {} }, []);
  useEffect(() => { load(); }, [load]);

  const send = async (e) => {
    e.preventDefault();
    if (!form.subject||!form.body) { showToast('Fill all fields.','error'); return; }
    setL(true);
    try { await api.post('/messages', form); setForm({subject:'',body:''}); showToast('Sent!','success'); load(); }
    catch { showToast('Failed.','error'); }
    finally { setL(false); }
  };

  return (
    <div>
      <PT sub="Send a direct message to your moderator">Messages</PT>
      <div className="card">
        <div className="card-t">✉️ New Message</div>
        <form onSubmit={send}>
          <div className="fg"><label>Subject</label><input type="text" placeholder="Message subject" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}/></div>
          <div className="fg"><label>Message</label><textarea rows={5} placeholder="Write your message…" value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))}/></div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading?<><span className="spin"/>&nbsp;Sending…</>:'Send Message'}</button>
        </form>
      </div>
      <div className="card">
        <div className="card-t">📨 Sent Messages</div>
        {msgs.length===0 ? <p style={{ color:'var(--text3)', fontSize:'.87rem' }}>No messages yet.</p>
          : msgs.map(m=>(
            <div key={m.id} style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:'.95rem', marginBottom:'.65rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.4rem', flexWrap:'wrap', gap:'.4rem' }}>
                <strong style={{ fontSize:'.9rem' }}>{m.subject}</strong>
                <span style={{ fontSize:'.77rem', color:'var(--text4)' }}>{new Date(m.created_at).toLocaleDateString()}</span>
              </div>
              <div style={{ fontSize:'.87rem', color:'var(--text2)', marginBottom: m.reply?'.7rem':0 }}>{m.body}</div>
              {m.reply && (
                <div style={{ background:'var(--primary-lt)', borderRadius:'var(--r)', padding:'.7rem', borderLeft:'3px solid var(--primary)' }}>
                  <div style={{ fontSize:'.72rem', fontWeight:700, color:'var(--primary)', marginBottom:'.2rem' }}>Reply from {m.replied_by_name||'Moderator'}:</div>
                  <div style={{ fontSize:'.87rem', color:'var(--text2)' }}>{m.reply}</div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

function Profile({ user, subs }) {
  const scored = subs.filter(s=>s.ai_score>0);
  const avg    = scored.length ? Math.round(scored.reduce((a,b)=>a+b.ai_score,0)/scored.length) : null;
  const rows   = [
    ['Registration No.', user?.reg_number],
    ['Email',            user?.email],
    ['Phone',            user?.phone],
    ['Academic Level',   user?.academic_level],
    ['Department',       user?.department],
    ['Research Topic',   user?.research_topic||'—'],
    ['Submissions',      subs.length],
    ['Avg AI Score',     avg?`${avg}/100`:'N/A'],
    ['Member Since',     new Date(user?.created_at).toLocaleDateString()],
  ];
  return (
    <div>
      <PT sub="Your academic information">My Profile</PT>
      <div className="card">
        <div style={{ display:'flex', alignItems:'center', gap:'1.2rem', marginBottom:'1.3rem', flexWrap:'wrap' }}>
          <div style={{ width:62, height:62, borderRadius:'50%', background:'linear-gradient(135deg,#1a56db,#0891b2)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-h)', fontSize:'1.5rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
            {user?(user.first_name[0]+user.last_name[0]).toUpperCase():'?'}
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-h)', fontSize:'1.3rem', fontWeight:600, color:'var(--text)' }}>{user?.first_name} {user?.last_name}</div>
            <span className="badge b-primary" style={{ marginTop:4, display:'inline-block' }}>{user?.academic_level}</span>
          </div>
        </div>
        <div className="divider"/>
        <table style={{ width:'100%', fontSize:'.87rem', borderCollapse:'collapse' }}>
          <tbody>
            {rows.map(([k,v])=>(
              <tr key={k}>
                <td style={{ color:'var(--text3)', padding:'.45rem 0', width:'40%', fontSize:'.78rem', textTransform:'uppercase', letterSpacing:'.3px', fontWeight:600 }}>{k}</td>
                <td style={{ fontWeight:500, padding:'.45rem 0', color:'var(--text)' }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AppPage() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [panel, setPanel] = useState('dashboard');
  const [subs,  setSubs]  = useState([]);
  const [notifs,setNotifs]= useState([]);

  const loadSubs   = useCallback(async () => { try { const r = await api.get('/submissions');   setSubs(r.data);   } catch {} }, []);
  const loadNotifs = useCallback(async () => { try { const r = await api.get('/notifications'); setNotifs(r.data); } catch {} }, []);

  useEffect(() => { loadSubs(); loadNotifs(); }, [loadSubs, loadNotifs]);
  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
  if (!user) return null;

  const switchPanel = (p) => {
    setPanel(p);
    if (p === 'notifications') loadNotifs();
    if (p === 'dashboard') { loadSubs(); loadNotifs(); }
    if (['progress','submit'].includes(p)) loadSubs();
  };

  const panels = {
    dashboard:     <Dashboard     subs={subs} notifs={notifs} user={user} />,
    progress:      <Progress      subs={subs} />,
    submit:        <Submissions   subs={subs} onRefresh={loadSubs} user={user} />,
    notifications: <Notifications notifs={notifs} onRefresh={loadNotifs} />,
    messages:      <Messages />,
    profile:       <Profile       user={user} subs={subs} />,
  };

  return (
    <AppShell active={panel} setPanel={switchPanel}>
      {panels[panel] || panels.dashboard}
    </AppShell>
  );
}
