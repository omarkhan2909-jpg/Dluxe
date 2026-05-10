'use client'
import { useState, useEffect } from 'react'

const VALID_USERS = [
  { id: 'dluxe', password: 'Dubai2026' },
  { id: 'omar',  password: 'Admin@123' },
]

const STATUS_CFG = {
  blocked:    { label:'Blocked',     dot:'#DC2626', badge:'#FEF2F2', badgeText:'#DC2626', badgeBorder:'#FECACA' },
  inprogress: { label:'In Progress', dot:'#2563EB', badge:'#EFF6FF', badgeText:'#2563EB', badgeBorder:'#BFDBFE' },
  completed:  { label:'Completed',   dot:'#16A34A', badge:'#F0FDF4', badgeText:'#16A34A', badgeBorder:'#BBF7D0' },
  planned:    { label:'Planned',     dot:'#9CA3AF', badge:'#F9FAFB', badgeText:'#6B7280', badgeBorder:'#E5E7EB' },
}

const mono = { fontFamily:"'Open Sans',sans-serif" }
const serif = { fontFamily:"'Open Sans',sans-serif" }

function fmtDate(s){ return new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) }

function TimelineBar({ startDate, endDate, status }){
  const start=new Date(startDate), end=new Date(endDate), now=new Date()
  const total=end-start, elapsed=Math.min(Math.max(now-start,0),total)
  const pct=total>0?Math.round((elapsed/total)*100):0
  const daysLeft=Math.max(0,Math.ceil((end-now)/86400000))
  const color=status==='completed'?'#16A34A':status==='blocked'?'#DC2626':'#2563EB'
  return(
    <div style={{marginTop:12}}>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#6B7280',marginBottom:5,...mono}}>
        <span>Start: {fmtDate(startDate)}</span><span>Deadline: {fmtDate(endDate)}</span>
      </div>
      <div style={{background:'#F3F4F6',borderRadius:99,height:7,overflow:'hidden'}}>
        <div style={{height:'100%',borderRadius:99,background:color,width:`${status==='completed'?100:pct}%`,transition:'width .4s'}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#9CA3AF',marginTop:4,...mono}}>
        <span>{status==='completed'?'Done':status==='blocked'?'Waiting on access':status==='inprogress'?`${pct}% elapsed`:'Not started'}</span>
        <span style={{color:daysLeft<=2&&status!=='completed'?'#DC2626':'#9CA3AF'}}>
          {status==='completed'?'✓ Complete':`${daysLeft} day${daysLeft===1?'':'s'} remaining`}
        </span>
      </div>
    </div>
  )
}

function LoginGate({ onLogin }){
  const [id,setId]=useState(''), [pw,setPw]=useState('')
  const [error,setError]=useState(''), [shake,setShake]=useState(false)
  const attempt=()=>{
    const match=VALID_USERS.find(u=>u.id===id.trim()&&u.password===pw)
    if(match){onLogin()}
    else{setError('Invalid ID or password.');setShake(true);setTimeout(()=>setShake(false),450)}
  }
  return(
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#0F0F14',padding:24}}>
      <div className={shake?'login-box shake':'login-box'}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:28}}>
          <img src="/dluxe-logo.png" alt="Dluxe" style={{height:38,objectFit:'contain'}}/>
        </div>
        <p style={{fontSize:11,color:'rgba(255,255,255,0.35)',textAlign:'center',marginBottom:28,lineHeight:1.7,...mono}}>
          Enter your credentials to access the project dashboard
        </p>
        <div className="login-field">
          <label className="login-label">User ID</label>
          <input className="login-input" type="text" placeholder="Enter your ID" value={id}
            onChange={e=>setId(e.target.value)} onKeyDown={e=>e.key==='Enter'&&attempt()} autoComplete="username"/>
        </div>
        <div className="login-field">
          <label className="login-label">Password</label>
          <input className="login-input" type="password" placeholder="••••••••" value={pw}
            onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&attempt()} autoComplete="current-password"/>
        </div>
        {error&&<div className="login-error">{error}</div>}
        <button className="login-btn" onClick={attempt}>Access Dashboard →</button>
        <p style={{textAlign:'center',fontSize:10,color:'rgba(255,255,255,0.2)',marginTop:16,...mono}}>Read-only · Dluxe Dubai 2026</p>
      </div>
    </div>
  )
}

function StatCard({ label, value, type, active, onClick }){
  const cfg={total:{accent:'#1A1A2E',color:'#1A1A2E'},inprogress:{accent:'#2563EB',color:'#2563EB'},completed:{accent:'#16A34A',color:'#16A34A'}}[type]
  return(
    <div onClick={onClick} style={{
      background:'#fff',borderRadius:14,padding:'22px 18px',cursor:'pointer',position:'relative',overflow:'hidden',
      border:active?`2px solid ${cfg.accent}`:'1.5px solid #EAECF0',
      boxShadow:active?`0 4px 20px ${cfg.accent}22`:'none',
      transform:active?'translateY(-2px)':'none',transition:'all .15s'
    }}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:4,background:cfg.accent,borderRadius:'14px 14px 0 0'}}/>
      <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:42,fontWeight:300,color:cfg.color,lineHeight:1,marginBottom:6}}>{value}</div>
      <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:10,letterSpacing:'.15em',textTransform:'uppercase',color:'#6B7280'}}>{label}</div>
      {active&&<div style={{position:'absolute',bottom:8,right:12,fontFamily:"'Open Sans',sans-serif",fontSize:9,color:cfg.accent,letterSpacing:'.08em'}}>FILTERED ▾</div>}
    </div>
  )
}

function TaskRow({ task }){
  const [open,setOpen]=useState(false)
  const cfg=STATUS_CFG[task.status]||STATUS_CFG.planned
  const num=String(task.id).padStart(2,'0')
  const isInfo=task.status==='inprogress'
  return(
    <div style={{background:'#fff',borderRadius:12,marginBottom:10,overflow:'hidden',border:open?'1.5px solid #1A1A2E':'1.5px solid #EAECF0',cursor:'pointer',transition:'border-color .15s'}}
      onClick={()=>setOpen(o=>!o)}>
      <div style={{padding:'16px 18px',display:'flex',alignItems:'center',gap:12}}>
        <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:9,letterSpacing:'.1em',background:'#F4F5F7',color:'#888',padding:'3px 9px',borderRadius:20,flexShrink:0}}>TASK {num}</div>
        <div style={{flex:1,fontFamily:"'Open Sans',sans-serif",fontSize:18,color:'#1A1A2E'}}>{task.title}</div>
        <span style={{fontFamily:"'Open Sans',sans-serif",fontSize:9,background:cfg.badge,color:cfg.badgeText,border:`1px solid ${cfg.badgeBorder}`,padding:'3px 9px',borderRadius:20,flexShrink:0}}>{cfg.label}</span>
        <div style={{width:7,height:7,borderRadius:'50%',background:cfg.dot,flexShrink:0}}/>
        <div style={{color:'#9CA3AF',fontSize:13,transform:open?'rotate(180deg)':'none',transition:'transform .2s',flexShrink:0}}>▾</div>
      </div>
      {open&&(
        <div onClick={e=>e.stopPropagation()}>
          <div style={{borderTop:'1.5px solid #F4F5F7',display:'grid',gridTemplateColumns:'1fr 1fr'}}>
            <div style={{padding:20,borderRight:'1.5px solid #F4F5F7'}}>
              <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:9,letterSpacing:'.15em',textTransform:'uppercase',color:'#C9A84C',marginBottom:7}}>What this task involves</div>
              <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:20,color:'#1A1A2E',marginBottom:9,lineHeight:1.3}}>{task.detailTitle}</div>
              <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:11,color:'#4B5563',lineHeight:1.75,whiteSpace:'pre-line'}}>{task.detailBody}</div>
            </div>
            <div style={{padding:20}}>
              <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:9,letterSpacing:'.15em',textTransform:'uppercase',color:'#C9A84C',marginBottom:7}}>How this benefits Dluxe</div>
              <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:20,color:'#1A1A2E',marginBottom:9,lineHeight:1.3}}>{task.benefitTitle}</div>
              <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:11,color:'#4B5563',lineHeight:1.75,whiteSpace:'pre-line'}}>{task.benefitBody}</div>
            </div>
          </div>
          <div style={{padding:'14px 20px',background:'#F8FAFF',borderTop:'1.5px solid #E0E7FF'}}>
            <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:9,letterSpacing:'.15em',textTransform:'uppercase',color:'#C9A84C',marginBottom:8}}>Timeline & Estimated Deadline</div>
            <TimelineBar startDate={task.startDate} endDate={task.endDate} status={task.status}/>
            <div style={{fontFamily:"'Open Sans',sans-serif",marginTop:10,fontSize:11,color:'#6B7280'}}>
              Estimated duration: <strong style={{color:'#1A1A2E'}}>{task.durationDays} working days</strong>
              {task.status==='blocked'?' — timeline begins once access is granted':''}
            </div>
          </div>
          <div style={{padding:'14px 20px',background:isInfo?'#EFF6FF':'#FFFBEB',borderTop:`1.5px solid ${isInfo?'#DBEAFE':'#FEF3C7'}`,display:'flex',gap:10,alignItems:'flex-start'}}>
            <div style={{fontSize:16,flexShrink:0}}>{isInfo?'💡':'⚠️'}</div>
            <div>
              <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:9,letterSpacing:'.12em',textTransform:'uppercase',color:isInfo?'#1E40AF':'#92400E',marginBottom:5}}>
                {isInfo?'Investigation in progress':'Action needed from Dluxe'}
              </div>
              <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:11,color:isInfo?'#1E3A8A':'#78350F',lineHeight:1.7,whiteSpace:'pre-line'}}>{task.blocker}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home(){
  const [auth,setAuth]=useState(false)
  const [tasks,setTasks]=useState([])
  const [filter,setFilter]=useState('total')
  const today=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})

  useEffect(()=>{ if(sessionStorage.getItem('dluxe_auth')==='true') setAuth(true) },[])
  useEffect(()=>{ if(auth) fetch('/tasks.json').then(r=>r.json()).then(setTasks) },[auth])
  const handleLogin=()=>{ sessionStorage.setItem('dluxe_auth','true'); setAuth(true) }

  if(!auth) return <LoginGate onLogin={handleLogin}/>

  const counts={ total:tasks.length, inprogress:tasks.filter(t=>t.status==='inprogress').length, completed:tasks.filter(t=>t.status==='completed').length }
  const blocked=tasks.filter(t=>t.status==='blocked')
  const filtered=filter==='total'?tasks:tasks.filter(t=>t.status===filter)

  return(
    <>
      <div style={{background:'#0F0F14',padding:'14px 28px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <img src="/dluxe-logo.png" alt="Dluxe" style={{height:36,objectFit:'contain'}}/>
        <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:'.1em',textTransform:'uppercase'}}>Project Dashboard · View Only</div>
      </div>

      <div style={{maxWidth:960,margin:'0 auto',padding:'28px 20px'}}>

        <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:10,letterSpacing:'.18em',textTransform:'uppercase',color:'#aaa',marginBottom:10}}>Overview — click a card to filter tasks</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:28}}>
          <StatCard label="Total tasks"  value={counts.total}       type="total"      active={filter==='total'}       onClick={()=>setFilter('total')}/>
          <StatCard label="In progress"  value={counts.inprogress}  type="inprogress" active={filter==='inprogress'}  onClick={()=>setFilter('inprogress')}/>
          <StatCard label="Completed"    value={counts.completed}   type="completed"  active={filter==='completed'}   onClick={()=>setFilter('completed')}/>
        </div>

        {blocked.length>0&&(
          <>
            <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:10,letterSpacing:'.18em',textTransform:'uppercase',color:'#aaa',marginBottom:10}}>Attention needed — blockers</div>
            <div style={{marginBottom:28}}>
              {blocked.map(t=>(
                <div key={t.id} style={{background:'#fff',borderRadius:12,border:'1.5px solid #FEE2E2',padding:'14px 18px',display:'flex',alignItems:'center',gap:14,marginBottom:8}}>
                  <div style={{width:34,height:34,borderRadius:9,background:'#FEF2F2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,flexShrink:0}}>🔒</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:12,color:'#DC2626',marginBottom:2}}>{t.alertTitle}</div>
                    <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:11,color:'#6B7280'}}>{t.alertDesc}</div>
                  </div>
                  <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:9,letterSpacing:'.08em',textTransform:'uppercase',background:'#FEF2F2',color:'#DC2626',border:'1px solid #FECACA',padding:'4px 10px',borderRadius:20,flexShrink:0,display:'flex',alignItems:'center',gap:4}}>
                    <span style={{display:'inline-block',width:6,height:6,borderRadius:'50%',background:'#DC2626',animation:'p 1.4s ease-in-out infinite'}}/>Blocked
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:10,letterSpacing:'.18em',textTransform:'uppercase',color:'#aaa',marginBottom:10}}>
          {filter==='total'?'All tasks':filter==='inprogress'?'In progress tasks':'Completed tasks'} — click any row to expand
        </div>
        <div style={{marginBottom:28}}>
          {filtered.length===0
            ?<div style={{background:'#fff',borderRadius:12,border:'1.5px solid #EAECF0',padding:32,textAlign:'center',fontFamily:"'Open Sans',sans-serif",fontSize:13,color:'#9CA3AF'}}>No tasks in this category yet.</div>
            :filtered.map(task=><TaskRow key={task.id} task={task}/>)
          }
        </div>

        <div style={{textAlign:'center',padding:20,background:'#fff',borderRadius:12,border:'1.5px solid #EAECF0'}}>
          <div style={{fontFamily:"'Open Sans',sans-serif",fontSize:12,color:'#9CA3AF'}}>Custom dashboard built by <strong style={{color:'#1A1A2E'}}>Omar Khan</strong></div>
          <div style={{marginTop:6,display:'inline-flex',alignItems:'center',gap:5,fontFamily:"'Open Sans',sans-serif",fontSize:10,letterSpacing:'.08em',textTransform:'uppercase',color:'#9CA3AF',background:'#F4F5F7',padding:'4px 12px',borderRadius:20}}>
            👁 Read only · {today}
          </div>
        </div>

      </div>
    </>
  )
}
