'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number|null>(null);
  const [cycle, setCycle] = useState<'monthly'|'annual'>('monthly');

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background:'#07080f', color:'#e8eaf0',
      fontFamily:"'Inter',-apple-system,sans-serif", overflowX:'hidden' }}>

      {/* NAVBAR */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:100,
        height:60,
        background: scrolled ? 'rgba(7,8,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        display:'flex', alignItems:'center',
        padding:'0 40px', justifyContent:'space-between',
        transition:'all 0.3s',
      }}>
        <div style={{
          fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:22,
          background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        }}>
          TasksDone
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:32 }}>
          {['Features','Pricing','FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              color:'rgba(255,255,255,0.6)', textDecoration:'none',
              fontSize:14, fontWeight:500, transition:'color 0.2s',
            }}
            onMouseEnter={e=>(e.currentTarget.style.color='white')}
            onMouseLeave={e=>(e.currentTarget.style.color='rgba(255,255,255,0.6)')}>
              {item}
            </a>
          ))}
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <button onClick={()=>router.push('/login')} style={{
            padding:'8px 18px', borderRadius:8,
            background:'transparent',
            border:'1px solid rgba(255,255,255,0.15)',
            color:'rgba(255,255,255,0.8)', fontSize:14,
            fontWeight:500, cursor:'pointer', transition:'all 0.2s',
          }}>Sign in</button>
          <button onClick={()=>router.push('/register')} style={{
            padding:'8px 18px', borderRadius:8,
            background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            border:'none', color:'white', fontSize:14,
            fontWeight:600, cursor:'pointer',
            boxShadow:'0 4px 16px rgba(99,102,241,0.35)',
          }}>Start free →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        textAlign:'center', padding:'120px 20px 80px',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', width:800, height:600, borderRadius:'50%',
          background:'radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)',
          top:'10%', left:'50%', transform:'translateX(-50%)',
          pointerEvents:'none',
        }} />

        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          background:'rgba(99,102,241,0.10)',
          border:'1px solid rgba(99,102,241,0.25)',
          borderRadius:100, padding:'6px 16px',
          fontSize:13, color:'#818cf8', fontWeight:500,
          marginBottom:28, animation:'fadeUp 0.6s ease both',
        }}>
          <span style={{ width:7, height:7, borderRadius:'50%',
            background:'#22c55e', animation:'pulse 2s infinite' }} />
          Built for marketing agencies
        </div>

        <h1 style={{
          fontFamily:"'Outfit',sans-serif",
          fontSize:'clamp(42px,7vw,82px)',
          fontWeight:800, lineHeight:1.05,
          letterSpacing:'-0.03em', marginBottom:24,
          animation:'fadeUp 0.6s 0.1s ease both',
        }}>
          Get more done.<br/>
          <span style={{
            background:'linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>Tasks. Done.</span>
        </h1>

        <p style={{
          fontSize:18, color:'rgba(255,255,255,0.55)',
          maxWidth:520, lineHeight:1.7, marginBottom:40,
          animation:'fadeUp 0.6s 0.2s ease both',
        }}>
          The all-in-one OS for marketing agencies.
          Replace Trello, ClickUp, Notion, Slack, and Harvest
          with one platform.
        </p>

        <div style={{
          display:'flex', gap:12, marginBottom:16,
          flexWrap:'wrap', justifyContent:'center',
          animation:'fadeUp 0.6s 0.3s ease both',
        }}>
          <button onClick={()=>router.push('/register')} style={{
            padding:'14px 32px', borderRadius:10, border:'none',
            background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color:'white', fontSize:16, fontWeight:700,
            cursor:'pointer', transition:'all 0.2s',
            boxShadow:'0 8px 32px rgba(99,102,241,0.35)',
          }}
          onMouseEnter={e=>{
            e.currentTarget.style.transform='translateY(-2px)';
            e.currentTarget.style.boxShadow='0 12px 40px rgba(99,102,241,0.5)';
          }}
          onMouseLeave={e=>{
            e.currentTarget.style.transform='none';
            e.currentTarget.style.boxShadow='0 8px 32px rgba(99,102,241,0.35)';
          }}>
            Start for free →
          </button>
          <button onClick={()=>router.push('/login')} style={{
            padding:'14px 32px', borderRadius:10,
            background:'transparent',
            border:'1px solid rgba(255,255,255,0.15)',
            color:'rgba(255,255,255,0.8)', fontSize:16,
            fontWeight:600, cursor:'pointer',
          }}>
            Sign in to workspace
          </button>
        </div>

        <p style={{ fontSize:13, color:'rgba(255,255,255,0.3)',
          animation:'fadeUp 0.6s 0.4s ease both' }}>
          Free 14-day trial · No credit card · Cancel anytime
        </p>

        {/* App mockup */}
        <div style={{
          marginTop:60, width:'100%', maxWidth:860,
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:16, overflow:'hidden',
          boxShadow:'0 0 80px rgba(99,102,241,0.15), 0 40px 80px rgba(0,0,0,0.5)',
          animation:'fadeUp 0.8s 0.5s ease both',
        }}>
          <div style={{ background:'#111318', padding:'10px 16px',
            display:'flex', alignItems:'center', gap:8,
            borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display:'flex', gap:6 }}>
              {['#ff5f57','#ffbd2e','#28c840'].map(c=>(
                <div key={c} style={{ width:12, height:12,
                  borderRadius:'50%', background:c }} />
              ))}
            </div>
            <div style={{ flex:1, background:'rgba(255,255,255,0.05)',
              borderRadius:6, padding:'4px 12px',
              fontSize:12, color:'rgba(255,255,255,0.3)',
              textAlign:'center' }}>
              app.tasksdone.cloud/dashboard
            </div>
          </div>
          <div style={{ background:'#0c0d1a', padding:20 }}>
            <div style={{ display:'grid',
              gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
              {[
                { label:'Active Projects', value:'12', color:'#6366f1' },
                { label:'Open Tasks',      value:'48', color:'#8b5cf6' },
                { label:'Due Today',       value:'5',  color:'#f59e0b' },
                { label:'Team Online',     value:'8',  color:'#22c55e' },
              ].map(s=>(
                <div key={s.label} style={{
                  background:`${s.color}15`,
                  border:`1px solid ${s.color}25`,
                  borderRadius:10, padding:'14px 16px',
                }}>
                  <div style={{ fontSize:11, color:s.color, fontWeight:600,
                    textTransform:'uppercase', letterSpacing:'0.5px',
                    marginBottom:6 }}>{s.label}</div>
                  <div style={{ fontSize:28, fontWeight:800,
                    color:'white' }}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'grid',
              gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
              {[
                { col:'To Do',       color:'#6b7280',
                  tasks:['Design banner','Write copy','Research'] },
                { col:'In Progress', color:'#6366f1',
                  tasks:['Social campaign','FB Ads'] },
                { col:'In Review',   color:'#f59e0b',
                  tasks:['Monthly report'] },
                { col:'Done',        color:'#22c55e',
                  tasks:['Presentation','Brand guide'] },
              ].map(col=>(
                <div key={col.col} style={{
                  background:'#111318',
                  border:'1px solid rgba(255,255,255,0.06)',
                  borderRadius:10, padding:10,
                }}>
                  <div style={{ display:'flex', alignItems:'center',
                    gap:6, marginBottom:8 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%',
                      background:col.color }} />
                    <span style={{ fontSize:11, fontWeight:600,
                      color:col.color }}>{col.col}</span>
                  </div>
                  {col.tasks.map(t=>(
                    <div key={t} style={{
                      background:'rgba(255,255,255,0.04)',
                      border:'1px solid rgba(255,255,255,0.06)',
                      borderLeft:`2px solid ${col.color}`,
                      borderRadius:6, padding:'7px 9px', marginBottom:6,
                      fontSize:11, color:'rgba(255,255,255,0.7)',
                    }}>{t}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div style={{
        borderTop:'1px solid rgba(255,255,255,0.06)',
        borderBottom:'1px solid rgba(255,255,255,0.06)',
        padding:'32px 20px',
        display:'flex', justifyContent:'center',
        gap:80, flexWrap:'wrap',
      }}>
        {[
          { value:'2,400+', label:'Agencies worldwide',  color:'#6366f1' },
          { value:'98%',    label:'Satisfaction rate',   color:'#22c55e' },
          { value:'6 tools',label:'Replaced on average', color:'#8b5cf6' },
          { value:'4.9 ★',  label:'Average rating',      color:'#f59e0b' },
        ].map(s=>(
          <div key={s.label} style={{ textAlign:'center' }}>
            <div style={{ fontSize:32, fontWeight:800,
              color:s.color, marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:13,
              color:'rgba(255,255,255,0.4)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section id="features" style={{
        padding:'100px 20px',
        maxWidth:1100, margin:'0 auto',
      }}>
        <div className="reveal" style={{ textAlign:'center', marginBottom:60 }}>
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:'2px',
            textTransform:'uppercase', color:'#6366f1', marginBottom:12 }}>
            Everything you need
          </div>
          <h2 style={{
            fontFamily:"'Outfit',sans-serif",
            fontSize:'clamp(28px,4vw,44px)',
            fontWeight:800, letterSpacing:'-0.02em', marginBottom:16,
          }}>
            Built for agencies, not generic teams
          </h2>
        </div>

        <div style={{ display:'grid',
          gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
          {[
            { icon:'✅', title:'Task Management',      color:'#6366f1',
              desc:'Kanban, List, Calendar, Timeline views.' },
            { icon:'📅', title:'Content Calendar',    color:'#8b5cf6',
              desc:'Plan content across all platforms.' },
            { icon:'📈', title:'Ad Campaign Tracker', color:'#ec4899',
              desc:'Track ROAS, CTR, CPC across all ad platforms.' },
            { icon:'💬', title:'Team Chat',            color:'#06b6d4',
              desc:'Real-time messaging with channels and DMs.' },
            { icon:'⏱️', title:'Time Tracking',        color:'#10b981',
              desc:'One-click timers and billable hours.' },
            { icon:'✨', title:'AI Intelligence',     color:'#f59e0b',
              desc:'Competitor analysis and campaign ideas.' },
            { icon:'🧾', title:'Invoices',             color:'#6366f1',
              desc:'Create invoices and track payments.' },
            { icon:'👥', title:'Client Portal',       color:'#8b5cf6',
              desc:'Clients track progress and approve work.' },
            { icon:'🎨', title:'Design Hub',          color:'#ec4899',
              desc:'Upload designs, get feedback, manage versions.' },
          ].map((f,i)=>(
            <div key={f.title} className="reveal" style={{
              background:'#111318',
              border:'1px solid rgba(255,255,255,0.06)',
              borderRadius:14, padding:24, transition:'all 0.2s',
            }}
            onMouseEnter={e=>{
              e.currentTarget.style.borderColor=`${f.color}40`;
              e.currentTarget.style.transform='translateY(-4px)';
              e.currentTarget.style.boxShadow=`0 8px 32px ${f.color}15`;
            }}
            onMouseLeave={e=>{
              e.currentTarget.style.borderColor='rgba(255,255,255,0.06)';
              e.currentTarget.style.transform='none';
              e.currentTarget.style.boxShadow='none';
            }}>
              <div style={{ width:44, height:44, borderRadius:10,
                background:`${f.color}20`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:22, marginBottom:14 }}>{f.icon}</div>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>
                {f.title}
              </h3>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)',
                lineHeight:1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{
        padding:'100px 20px', maxWidth:960,
        margin:'0 auto', textAlign:'center',
      }}>
        <div className="reveal" style={{ marginBottom:48 }}>
          <div style={{ fontSize:12, fontWeight:700, letterSpacing:'2px',
            textTransform:'uppercase', color:'#6366f1', marginBottom:12 }}>
            Pricing
          </div>
          <h2 style={{
            fontFamily:"'Outfit',sans-serif",
            fontSize:'clamp(26px,3.5vw,40px)',
            fontWeight:800, letterSpacing:'-0.02em', marginBottom:16,
          }}>Simple, honest pricing</h2>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:15 }}>
            No hidden fees. No per-seat surprises.
          </p>
        </div>

        {/* Toggle */}
        <div className="reveal" style={{
          display:'inline-flex', alignItems:'center', gap:12,
          marginBottom:40, background:'#111318',
          border:'1px solid rgba(255,255,255,0.08)',
          borderRadius:100, padding:'6px 20px',
        }}>
          <span style={{ fontSize:13,
            color: cycle==='monthly' ? 'white' : 'rgba(255,255,255,0.4)',
            fontWeight: cycle==='monthly' ? 600 : 400 }}>Monthly</span>
          <div onClick={()=>setCycle(c=>c==='monthly'?'annual':'monthly')}
            style={{ width:40, height:22, borderRadius:11,
              background: cycle==='annual'
                ? '#6366f1' : 'rgba(255,255,255,0.15)',
              position:'relative', cursor:'pointer', transition:'background 0.2s',
            }}>
            <div style={{ position:'absolute', top:2,
              left: cycle==='annual' ? 20 : 2,
              width:18, height:18, borderRadius:'50%',
              background:'white', transition:'left 0.2s',
            }} />
          </div>
          <span style={{ fontSize:13,
            color: cycle==='annual' ? 'white' : 'rgba(255,255,255,0.4)',
            fontWeight: cycle==='annual' ? 600 : 400 }}>Annual</span>
          <span style={{ fontSize:11, fontWeight:700, color:'#22c55e',
            background:'rgba(34,197,94,0.15)',
            padding:'2px 8px', borderRadius:100 }}>Save 17%</span>
        </div>

        <div className="reveal" style={{
          display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16,
        }}>
          {[
            {
              id:'free', name:'Free', monthly:0, annual:0,
              storage:'1 GB', fileLimit:'10 MB/file',
              highlight:false, badge:null as string|null,
              features:['5 clients','3 team members','3 projects',
                        'Basic Kanban','1 GB storage','Community support'],
            },
            {
              id:'pro', name:'Pro', monthly:18, annual:15,
              storage:'20 GB', fileLimit:'100 MB/file',
              highlight:true, badge:'Most Popular' as string|null,
              features:['Unlimited clients','15 team members','All views',
                        'Content calendar','Time tracking & invoices',
                        'Client portal','50 AI requests/mo',
                        '20 GB storage','Priority support'],
            },
            {
              id:'agency', name:'Agency', monthly:38, annual:32,
              storage:'100 GB', fileLimit:'500 MB/file',
              highlight:false, badge:'Best Value' as string|null,
              features:['Everything in Pro','Unlimited team members',
                        'Unlimited AI requests','White-label branding',
                        'Public API + Webhooks','100 GB storage',
                        'Dedicated support'],
            },
          ].map(plan=>{
            const price = cycle==='annual' ? plan.annual : plan.monthly;
            return (
              <div key={plan.id} style={{
                background: plan.highlight
                  ? 'rgba(99,102,241,0.08)' : '#111318',
                border:`1px solid ${plan.highlight
                  ? '#6366f1' : 'rgba(255,255,255,0.06)'}`,
                borderRadius:16, padding:28, position:'relative',
                boxShadow: plan.highlight
                  ? '0 0 40px rgba(99,102,241,0.12)' : 'none',
              }}>
                {plan.badge && (
                  <div style={{
                    position:'absolute', top:-12, left:'50%',
                    transform:'translateX(-50%)',
                    background: plan.highlight
                      ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                      : 'linear-gradient(135deg,#f59e0b,#ef4444)',
                    color:'white', fontSize:10, fontWeight:700,
                    padding:'4px 14px', borderRadius:100,
                    whiteSpace:'nowrap',
                  }}>{plan.badge}</div>
                )}

                <div style={{ fontSize:16, fontWeight:700, marginBottom:16 }}>
                  {plan.name}
                </div>

                <div style={{ marginBottom:8 }}>
                  <span style={{ fontSize:38, fontWeight:900 }}>${price}</span>
                  <span style={{ color:'rgba(255,255,255,0.4)', fontSize:14 }}>
                    {price===0 ? ' forever' : '/mo'}
                  </span>
                </div>

                {cycle==='annual' && price>0 && (
                  <div style={{ fontSize:12, color:'#22c55e', marginBottom:8 }}>
                    Billed ${price*12}/year
                  </div>
                )}

                <div style={{
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:8, padding:'8px 12px', marginBottom:20,
                  fontSize:12, color:'rgba(255,255,255,0.6)',
                  display:'flex', alignItems:'center', gap:6,
                }}>
                  💾 <strong style={{ color:'white' }}>{plan.storage}</strong>
                  · {plan.fileLimit} max
                </div>

                <ul style={{ listStyle:'none', padding:0,
                  display:'flex', flexDirection:'column', gap:8,
                  marginBottom:24, textAlign:'left' }}>
                  {plan.features.map(f=>(
                    <li key={f} style={{ display:'flex', gap:8,
                      fontSize:13, color:'rgba(255,255,255,0.6)',
                      alignItems:'flex-start' }}>
                      <span style={{ color:'#22c55e', flexShrink:0,
                        marginTop:1 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button onClick={()=>router.push('/register')} style={{
                  width:'100%', padding:'11px',
                  borderRadius:8, border:'none', fontSize:14,
                  fontWeight:600, cursor:'pointer', transition:'all 0.2s',
                  background: plan.highlight
                    ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                    : 'rgba(255,255,255,0.07)',
                  color: plan.highlight ? 'white' : 'rgba(255,255,255,0.7)',
                  boxShadow: plan.highlight
                    ? '0 4px 16px rgba(99,102,241,0.3)' : 'none',
                }}>
                  {plan.id==='free'
                    ? 'Start for free'
                    : `Start ${plan.name} trial →`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{
        padding:'80px 20px', maxWidth:680, margin:'0 auto',
      }}>
        <div className="reveal" style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{
            fontFamily:"'Outfit',sans-serif",
            fontSize:'clamp(26px,3.5vw,40px)',
            fontWeight:800, letterSpacing:'-0.02em',
          }}>Frequently asked questions</h2>
        </div>

        <div className="reveal">
          {[
            { q:'Is TasksDone really free to start?',
              a:'Yes! The Free plan is free forever. No credit card required. You get 5 clients, 3 projects, and 1GB storage.' },
            { q:'Can I upgrade or downgrade anytime?',
              a:'Absolutely. Upgrades take effect immediately. Downgrades take effect at the end of your billing period.' },
            { q:'What happens to my files if I downgrade?',
              a:'Your files stay safe. You just cannot upload new files until you are under the storage limit.' },
            { q:'How does the Client Portal work?',
              a:'Each client gets a unique login to see only their projects, approve deliverables, and view invoices.' },
            { q:'Do you have a mobile app?',
              a:'The web app is fully responsive and works great on mobile. A native app is on our roadmap.' },
            { q:'How does AI competitor analysis work?',
              a:'Enter your brand, industry, and up to 5 competitors. Our AI analyzes them and gives you a full SWOT report with quick wins.' },
          ].map((item,i)=>(
            <div key={i} style={{
              borderBottom:'1px solid rgba(255,255,255,0.07)',
            }}>
              <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{
                width:'100%', display:'flex',
                justifyContent:'space-between', alignItems:'center',
                padding:'18px 0', background:'none', border:'none',
                color:'white', fontSize:15, fontWeight:500,
                cursor:'pointer', textAlign:'left',
              }}>
                {item.q}
                <span style={{ fontSize:20, color:'rgba(255,255,255,0.4)',
                  transform: faqOpen===i ? 'rotate(180deg)' : 'none',
                  transition:'transform 0.2s', flexShrink:0, marginLeft:16,
                }}>⌄</span>
              </button>
              {faqOpen===i && (
                <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)',
                  lineHeight:1.7, paddingBottom:18,
                  animation:'fadeUp 0.2s ease' }}>
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding:'100px 20px', textAlign:'center',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', inset:0,
          background:'radial-gradient(ellipse at center,rgba(99,102,241,0.12) 0%,transparent 70%)',
          pointerEvents:'none' }} />
        <div className="reveal">
          <h2 style={{
            fontFamily:"'Outfit',sans-serif",
            fontSize:'clamp(30px,5vw,56px)',
            fontWeight:800, letterSpacing:'-0.03em', marginBottom:16,
          }}>Ready to get things done?</h2>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:16,
            marginBottom:36 }}>
            Join 2,400+ agencies already using TasksDone
          </p>
          <button onClick={()=>router.push('/register')} style={{
            padding:'16px 40px', borderRadius:12, border:'none',
            background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
            color:'white', fontSize:18, fontWeight:700,
            cursor:'pointer', transition:'all 0.2s',
            boxShadow:'0 8px 40px rgba(99,102,241,0.4)',
          }}
          onMouseEnter={e=>{
            e.currentTarget.style.transform='translateY(-3px)';
            e.currentTarget.style.boxShadow='0 16px 50px rgba(99,102,241,0.5)';
          }}
          onMouseLeave={e=>{
            e.currentTarget.style.transform='none';
            e.currentTarget.style.boxShadow='0 8px 40px rgba(99,102,241,0.4)';
          }}>
            Start for free →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding:'40px', borderTop:'1px solid rgba(255,255,255,0.06)',
        display:'flex', alignItems:'center',
        justifyContent:'space-between', flexWrap:'wrap', gap:16,
      }}>
        <div style={{
          fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:20,
          background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        }}>TasksDone</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.3)' }}>
          © 2025 TasksDone · Built for marketing agencies
        </div>
        <div style={{ display:'flex', gap:20 }}>
          {['Privacy','Terms','Support'].map(l=>(
            <a key={l} href="#" style={{ fontSize:13,
              color:'rgba(255,255,255,0.35)', textDecoration:'none',
            }}>{l}</a>
          ))}
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.5; transform:scale(1.4); }
        }
        .reveal {
          opacity:0; transform:translateY(24px);
          transition:opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal.visible { opacity:1; transform:translateY(0); }
        @media (max-width:768px) {
          nav > div:nth-child(2) { display:none !important; }
        }
      `}</style>
    </div>
  );
}
