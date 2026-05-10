'use client'
import { useState, useEffect } from 'react'

const statusLabel = { blocked: 'Blocked', inprogress: 'In Progress', completed: 'Completed', planned: 'Planned' }
const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function TaskCard({ task }) {
  const [open, setOpen] = useState(task.status === 'blocked' && task.id === 1)
  const num = String(task.id).padStart(2, '0')
  const isInfo = task.status === 'inprogress'

  return (
    <div className={`task-card ${task.status}`}>
      <div className="task-header" onClick={() => setOpen(o => !o)}>
        <div>
          <div className="task-num">Task {num}</div>
          <div className="task-title">{task.title}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <div className="task-badges">
            <span className={`badge ${task.status}`}>{statusLabel[task.status]}</span>
            <span className="badge high">{task.impact} impact</span>
          </div>
          <div className={`task-toggle ${open ? 'open' : ''}`}>
            <span className="toggle-icon">▾</span> details
          </div>
        </div>
      </div>
      <div className={`task-body ${open ? 'open' : ''}`}>
        <div>
          <div className="field-label">Access required</div>
          <div className="field-text">{task.accessRequired}</div>
        </div>
        <div>
          <div className="field-label">Why it matters to the business</div>
          <div className="field-text">{task.whyItMatters}</div>
        </div>
        <div className={`blocker-box ${isInfo ? 'info' : ''}`}>
          <div className="field-label">
            {isInfo ? '→ Investigation routes being assessed' : '⚠ Blocker'}
          </div>
          <div className="blocker-text">{task.blocker}</div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetch('/tasks.json')
      .then(r => r.json())
      .then(setTasks)
  }, [])

  const blocked = tasks.filter(t => t.status === 'blocked').length
  const inprogress = tasks.filter(t => t.status === 'inprogress').length
  const completed = tasks.filter(t => t.status === 'completed').length

  return (
    <>
      <div className="header">
        <div className="header-eyebrow">Project transparency dashboard · Part-time engagement</div>
        <h1 className="header-title">Dluxe <em>Dubai</em></h1>
        <div className="header-meta">
          Updated {today}
          <span>·</span> View only
          <span>·</span> {tasks.length} active tasks
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-n">{tasks.length}</div>
          <div className="stat-label">Total tasks</div>
        </div>
        <div className="stat">
          <div className="stat-n red">{blocked}</div>
          <div className="stat-label"><span className="pulse"></span>Blocked — needs access</div>
        </div>
        <div className="stat">
          <div className="stat-n blue">{inprogress}</div>
          <div className="stat-label">In progress</div>
        </div>
        <div className="stat">
          <div className="stat-n" style={{ color: '#2ECC71' }}>{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="tasks">
        <div className="section-label">Active tasks</div>
        {tasks.map(task => <TaskCard key={task.id} task={task} />)}
      </div>

      <div className="timeline-section">
        <div className="section-label">Timeline</div>
        {tasks.map(task => (
          <div className="tl-row" key={task.id}>
            <div className="tl-label">{String(task.id).padStart(2,'0')} · {task.title.split('—')[0].split('&')[0].trim()}</div>
            <div className="tl-track">
              <div
                className={`tl-fill ${task.status}`}
                style={{ left: `${task.timelineStart}%`, width: `${task.timelineWidth}%` }}
              ></div>
            </div>
            <div className="tl-date">May →</div>
          </div>
        ))}
      </div>

      <div className="footer">
        <div className="footer-note">Shared by your part-time consultant · Read only · Updates reflect latest progress</div>
        <div className="footer-badge">Dluxe Dubai · 2026</div>
      </div>
    </>
  )
}
