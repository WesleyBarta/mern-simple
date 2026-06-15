import { useEffect, useState } from 'react'
import { api, getToken } from '../api/client'
import {
  BriefcaseIcon, KeyIcon, ChartBarIcon, UserIcon, LogoutIcon,
  CheckIcon, XIcon, CogIcon, SparklesIcon, SearchIcon,
  ArrowRightIcon, DocumentIcon, TargetIcon, GraduationIcon,
} from './Icons'
import ResumeWizard from './ResumeWizard'

// =========================================================================
// Sidebar — shared by user and admin
// =========================================================================
function Sidebar({ view, setView, user, isAdmin }) {
  const userLinks = [
    { id: 'overview',  label: 'Overview',     Icon: ChartBarIcon },
    { id: 'jobs',      label: 'This Week',    Icon: BriefcaseIcon },
    { id: 'api',       label: 'API Keys',     Icon: KeyIcon },
    { id: 'resume',    label: 'AI Resume',    Icon: DocumentIcon },
    { id: 'interview', label: 'Interview AI', Icon: TargetIcon },
    { id: 'courses',   label: 'Courses',      Icon: GraduationIcon },
    { id: 'upgrade',   label: 'Upgrade',      Icon: SparklesIcon },
    { id: 'profile',   label: 'Profile',      Icon: UserIcon },
  ]
  const adminLinks = [
    { id: 'admin-overview',   label: 'Dashboard',    Icon: ChartBarIcon },
    { id: 'admin-users',      label: 'Users',        Icon: UserIcon },
    { id: 'admin-jobs',       label: 'Jobs',         Icon: BriefcaseIcon },
    { id: 'admin-blogs',      label: 'Blogs',        Icon: DocumentIcon },
    { id: 'admin-services',   label: 'Services',     Icon: CogIcon },
    { id: 'admin-projects',   label: 'Projects',     Icon: BriefcaseIcon },
    { id: 'admin-case-studies',label: 'Case Studies',Icon: DocumentIcon },
    { id: 'admin-contacts',   label: 'Contacts',     Icon: UserIcon },
    { id: 'admin-keys',       label: 'API Keys',     Icon: KeyIcon },
    { id: 'admin-analytics',   label: 'Analytics',    Icon: SparklesIcon },
  ]
  const links = isAdmin ? [...userLinks.slice(0, 2), ...adminLinks] : userLinks
  return (
    <aside className="dash-side">
      <div className="dash-side-brand">
        <Logo />
      </div>
      <nav className="dash-side-nav">
        {(isAdmin ? adminLinks : userLinks).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={'dash-side-link' + (view === id ? ' active' : '')}
            onClick={() => setView(id)}
          >
            <Icon size={18} /> <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="dash-side-foot">
        <div className="dash-side-user">
          <div className="dash-avatar-sm">
            {(user?.name || 'U').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div>
            <strong>{user?.name}</strong>
            <span>{isAdmin ? 'Admin' : 'Free plan'}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Logo() {
  return (
    <div className="logo">
      <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden>
        <defs>
          <linearGradient id="dashGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="0.55" stopColor="#6366f1" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="34" height="34" rx="9" fill="url(#dashGrad)" />
        <path
          d="M27 18.4c0 4.95-3.92 8.6-9.1 8.6C12.43 27 9 23.6 9 18.5 9 13.4 12.5 9.9 17.9 9.9c3.2 0 5.86 1.32 7.42 3.5l-2.95 2.55c-.96-1.34-2.5-2.16-4.47-2.16-3.1 0-5.27 2.05-5.27 4.71 0 2.66 2.17 4.71 5.27 4.71 2.5 0 4.05-1.18 4.6-2.84H18v-3.4h9c.07.4.1.83.1 1.43z"
          fill="white"
        />
      </svg>
      <span>GSFSGroup</span>
    </div>
  )
}

// =========================================================================
// Topbar
// =========================================================================
function Topbar({ title, onSignOut, onHome, user }) {
  return (
    <header className="dash-topbar">
      <div>
        <h2>{title}</h2>
      </div>
      <div className="dash-topbar-right">
        <button className="dash-icon-btn" onClick={onHome} title="Back to home">
          <CogIcon size={18} />
        </button>
        <button className="btn-outline btn-sm" onClick={onHome}>Home</button>
        <button className="btn-ghost btn-sm" onClick={onSignOut}>
          <LogoutIcon size={14} /> Sign out
        </button>
      </div>
    </header>
  )
}

// =========================================================================
// USER PAGES
// =========================================================================
function UserUpgrade({ user, onUserUpdate }) {
  const [working, setWorking] = useState(null)
  const [msg, setMsg] = useState('')
  const upgrade = async (plan) => {
    setWorking(plan)
    setMsg('')
    try {
      const d = await api.post('/api/billing/checkout', { plan })
      onUserUpdate(d.user)
      setMsg(`You're now on the ${plan.toUpperCase()} plan. Enjoy!`)
    } catch (e) { setMsg(e.message) }
    finally { setWorking(null) }
  }
  const cancel = async () => {
    if (!confirm('Cancel and go back to Free?')) return
    const d = await api.post('/api/billing/cancel')
    onUserUpdate(d.user)
    setMsg('Plan cancelled. You are back on Free.')
  }
  const plans = [
    { id: 'free',  price: '$0',   name: 'Free',  features: ['1-10 jobs / week', '1,000 AI calls / day', '1 resume', '5 job boards'] },
    { id: 'pro',   price: '$29',  name: 'Pro',   features: ['20+ job boards', '10,000 AI calls / day', 'Unlimited resumes', 'GPT-4-class models'], featured: true },
    { id: 'extra', price: '$99',  name: 'Extra', features: ['50+ job boards', '100,000 AI calls / day', 'Latest models', '1-on-1 coaching'] },
  ]
  return (
    <div className="dash-page">
      {msg && <div className="auth-success">{msg}</div>}
      <div className="dash-welcome">
        <h1>Choose your plan</h1>
        <p>You are currently on <strong>{(user?.plan || 'free').toUpperCase()}</strong>. Upgrade or cancel anytime.</p>
      </div>
      <div className="pricing-grid">
        {plans.map((p) => (
          <article key={p.id} className={'pricing-card' + (p.featured ? ' featured' : '')}>
            {p.featured && <span className="pricing-badge">Most popular</span>}
            <p className="pricing-name">{p.name}</p>
            <div className="pricing-price">
              <strong>{p.price}</strong>
              <span>/ {p.id === 'free' ? 'forever' : 'per month'}</span>
            </div>
            <ul className="pricing-features">
              {p.features.map((f) => <li key={f}><CheckIcon size={16} /> <span>{f}</span></li>)}
            </ul>
            {user?.plan === p.id ? (
              <button className="btn-outline btn-block btn-lg" disabled>Current plan</button>
            ) : p.id === 'free' ? (
              <button className="btn-outline btn-block btn-lg" onClick={cancel}>Downgrade</button>
            ) : (
              <button
                className={p.featured ? 'btn-primary btn-block btn-lg' : 'btn-outline btn-block btn-lg'}
                onClick={() => upgrade(p.id)}
                disabled={working === p.id}
              >
                {working === p.id ? 'Processing…' : `Upgrade to ${p.name}`}
              </button>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

function UserOverview({ user, setView }) {
  const [jobs, setJobs] = useState([])
  const [keys, setKeys] = useState([])
  useEffect(() => {
    api.get('/api/jobs?featured=true').then((d) => setJobs(d.jobs || [])).catch(() => {})
    api.get('/api/api-keys/mine').then((d) => setKeys(d.keys || [])).catch(() => {})
  }, [])
  return (
    <div className="dash-page">
      <div className="dash-welcome">
        <h1>Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
        <p>You're signed in as <strong>{user?.email}</strong>. Your free AI API key was generated on signup — copy it below and start building.</p>
      </div>

      <div className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-icon dash-stat-blue"><BriefcaseIcon size={18} /></div>
          <div><strong>{jobs.length}</strong><span>Featured jobs this week</span></div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon dash-stat-purple"><KeyIcon size={18} /></div>
          <div><strong>{keys.filter((k) => !k.revoked).length}</strong><span>Active API keys</span></div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon dash-stat-green"><DocumentIcon size={18} /></div>
          <div><strong>1</strong><span>Resume on file</span></div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-icon dash-stat-orange"><TargetIcon size={18} /></div>
          <div><strong>3</strong><span>Interview practices / mo</span></div>
        </div>
      </div>

      <section className="dash-card dash-card-wide">
        <div className="dash-card-head">
          <div>
            <h3>Featured jobs this week</h3>
            <p>Hand-picked matches based on your profile.</p>
          </div>
          <button className="btn-outline btn-sm" onClick={() => setView('jobs')}>View all <ArrowRightIcon size={12} /></button>
        </div>
        <ul className="dash-job-list">
          {jobs.slice(0, 4).map((j) => (
            <li key={j.id} className="dash-job">
              <div className={'dash-job-avatar dash-job-avatar-' + (j.id.charCodeAt(2) % 4 + 1)}>
                {j.company.slice(0, 2).toUpperCase()}
              </div>
              <div className="dash-job-info">
                <strong>{j.title}</strong>
                <span>{j.company} · {j.location} · {j.salary}</span>
              </div>
              <span className="dash-job-match">95%</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function UserJobs() {
  const [jobs, setJobs] = useState([])
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [msg, setMsg] = useState('')
  useEffect(() => {
    api.get(`/api/jobs?q=${encodeURIComponent(q)}`).then((d) => setJobs(d.jobs || [])).catch(() => {})
  }, [q])

  const filtered = filter === 'featured' ? jobs.filter((j) => j.featured) : jobs

  const apply = async (id) => {
    try {
      await api.post(`/api/jobs/${id}/apply`)
      setMsg('Application sent! Good luck.')
      setTimeout(() => setMsg(''), 2500)
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <div className="dash-page">
      <div className="dash-toolbar">
        <div className="dash-search">
          <SearchIcon size={14} />
          <input placeholder="Search by title, company, or tag" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="dash-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'featured' ? 'active' : ''} onClick={() => setFilter('featured')}>Featured</button>
        </div>
      </div>
      {msg && <div className="auth-success">{msg}</div>}
      <ul className="dash-job-grid">
        {filtered.map((j) => (
          <li key={j.id} className="dash-job-card">
            <div className="dash-job-card-head">
              <div className={'dash-job-avatar dash-job-avatar-' + (j.id.charCodeAt(2) % 4 + 1)}>
                {j.company.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <strong>{j.title}</strong>
                <span>{j.company} · {j.location}</span>
              </div>
            </div>
            <div className="dash-job-card-meta">
              <span className="dash-pill">{j.salary}</span>
              <span className="dash-pill">{j.type}</span>
              {j.featured && <span className="dash-pill dash-pill-green">Featured</span>}
            </div>
            <div className="dash-job-tags">
              {(j.tags || []).slice(0, 3).map((t) => <span key={t} className="dash-tag">{t}</span>)}
            </div>
            <button className="btn-primary btn-block" onClick={() => apply(j.id)}>Apply with one click</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function UserApi() {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [show, setShow] = useState({})
  const [newKey, setNewKey] = useState('')
  const [label, setLabel] = useState('')
  useEffect(() => { load() }, [])
  function load() {
    setLoading(true)
    api.get('/api/api-keys/mine').then((d) => setKeys(d.keys || [])).finally(() => setLoading(false))
  }
  const create = async () => {
    setNewKey('')
    const d = await api.post('/api/api-keys/mine', { label: label || 'Default key' })
    setNewKey(d.key.key)
    setLabel('')
    load()
  }
  const revoke = async (id) => {
    if (!confirm('Revoke this key? Apps using it will stop working.')) return
    await api.del(`/api/api-keys/mine/${id}`)
    load()
  }
  return (
    <div className="dash-page">
      {newKey && (
        <div className="dash-callout">
          <strong>New key created — copy it now. You won't see it again.</strong>
          <code>{newKey}</code>
        </div>
      )}

      <section className="dash-card dash-card-wide">
        <div className="dash-card-head">
          <div>
            <h3>Your API keys</h3>
            <p>Use these keys to call any GSFSGroup AI model.</p>
          </div>
        </div>
        {loading ? <p className="dash-muted">Loading…</p> : keys.length === 0 ? (
          <p className="dash-muted">No keys yet — create one below.</p>
        ) : (
          <div className="dash-key-list">
            {keys.map((k) => (
              <div key={k.id} className="dash-key">
                <div className="dash-key-info">
                  <strong>{k.label}</strong>
                  <span>Created {new Date(k.createdAt).toLocaleDateString()} · {k.revoked ? 'Revoked' : 'Active'}</span>
                </div>
                <code className="dash-key-code">{show[k.id] ? 'gsk_' + k.key.replace(/•/g, 'x') : k.key}</code>
                <div className="dash-key-actions">
                  <button className="btn-ghost btn-sm" onClick={() => setShow((s) => ({ ...s, [k.id]: !s[k.id] }))}>
                    {show[k.id] ? 'Hide' : 'Reveal'}
                  </button>
                  {!k.revoked && <button className="btn-outline btn-sm" onClick={() => revoke(k.id)}>Revoke</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dash-card">
        <h3>Create a new key</h3>
        <p className="dash-muted">Give it a label so you remember what it's for (e.g. "My side project").</p>
        <div className="dash-form-row">
          <input className="dash-input" placeholder="Key label" value={label} onChange={(e) => setLabel(e.target.value)} />
          <button className="btn-primary" onClick={create}>Create key</button>
        </div>
      </section>
    </div>
  )
}

function UserResume({ user, onUserUpdate }) {
  return <ResumeWizard user={user} onUserUpdate={onUserUpdate} />
}

function UserInterview() {
  return (
    <div className="dash-page">
      <section className="dash-card dash-card-wide">
        <h3>AI Interview Coach</h3>
        <p className="dash-muted">Practice with AI mock interviews. Real-time feedback on answers, tone, and pacing.</p>
        <div className="dash-placeholder">
          <TargetIcon size={32} />
          <p>3 free practice sessions per month. The interactive coach lights up in Phase 5.</p>
        </div>
      </section>
    </div>
  )
}

function UserCourses() {
  const courses = [
    { title: 'Mastering Technical Interviews', provider: 'GSFSGroup Academy', hours: 6, level: 'Intermediate' },
    { title: 'AI for Product Managers',        provider: 'Notion Learning',     hours: 4, level: 'Beginner' },
    { title: 'System Design Crash Course',     provider: 'Educative',          hours: 10, level: 'Advanced' },
    { title: 'Negotiating Your Offer',         provider: 'GSFSGroup Academy', hours: 2, level: 'All levels' },
  ]
  return (
    <div className="dash-page">
      <section className="dash-card dash-card-wide">
        <h3>Free skill courses</h3>
        <p className="dash-muted">Curated learning paths to help you land and thrive in your next role.</p>
        <ul className="dash-list">
          {courses.map((c) => (
            <li key={c.title} className="dash-list-row">
              <div>
                <strong>{c.title}</strong>
                <span>{c.provider} · {c.hours}h · {c.level}</span>
              </div>
              <button className="btn-outline btn-sm">Start</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function UserProfile({ user, onUserUpdate }) {
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const d = await api.patch('/api/auth/me', { name })
      onUserUpdate(d.user)
      setMsg('Profile updated.')
    } catch (e) { setMsg(e.message) }
    finally { setSaving(false) }
  }
  return (
    <div className="dash-page">
      {msg && <div className="auth-success">{msg}</div>}
      <section className="dash-card dash-card-wide">
        <h3>Profile</h3>
        <p className="dash-muted">Update your display name. Email is locked to your signup address — contact support to change it.</p>
        <div className="dash-form">
          <label className="field-label">
            Name
            <input className="dash-input" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="field-label">
            Email
            <input className="dash-input" value={user?.email || ''} disabled />
          </label>
          <label className="field-label">
            Plan
            <input className="dash-input" value={(user?.plan || 'free').toUpperCase()} disabled />
          </label>
          <button className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      </section>
    </div>
  )
}

// =========================================================================
// ADMIN PAGES
// =========================================================================
function AdminOverview() {
  const [data, setData] = useState(null)
  useEffect(() => { api.get('/api/analytics/overview').then(setData).catch(() => {}) }, [])
  if (!data) return <div className="dash-page"><p className="dash-muted">Loading…</p></div>
  const maxDay = Math.max(1, ...data.days.map((d) => d.signups + d.logins + d.applies))
  return (
    <div className="dash-page">
      <div className="dash-welcome">
        <h1>Admin overview</h1>
        <p>Live snapshot of the platform. Updates every page load.</p>
      </div>
      <div className="dash-stats">
        <div className="dash-stat"><div className="dash-stat-icon dash-stat-blue"><UserIcon size={18} /></div>
          <div><strong>{data.totals.users}</strong><span>Total users</span></div></div>
        <div className="dash-stat"><div className="dash-stat-icon dash-stat-purple"><BriefcaseIcon size={18} /></div>
          <div><strong>{data.totals.activeJobs}</strong><span>Active jobs</span></div></div>
        <div className="dash-stat"><div className="dash-stat-icon dash-stat-green"><KeyIcon size={18} /></div>
          <div><strong>{data.totals.activeKeys}</strong><span>Active API keys</span></div></div>
        <div className="dash-stat"><div className="dash-stat-icon dash-stat-orange"><SparklesIcon size={18} /></div>
          <div><strong>{data.totals.signups}</strong><span>Signups</span></div></div>
      </div>

      <section className="dash-card dash-card-wide">
        <div className="dash-card-head"><div><h3>Last 7 days</h3><p>Signups, logins, and job applications.</p></div></div>
        <div className="dash-chart">
          {data.days.map((d) => {
            const total = d.signups + d.logins + d.applies
            const h = Math.max(4, (total / maxDay) * 160)
            return (
              <div key={d.date} className="dash-chart-col" title={`${d.date}: ${total} events`}>
                <div className="dash-chart-bar" style={{ height: h + 'px' }} />
                <div className="dash-chart-label">{d.date.slice(5)}</div>
              </div>
            )
          })}
        </div>
        <div className="dash-chart-legend">
          <span><span className="dot dot-green" /> Activity volume</span>
          <span>{data.recent.count} events in the last 7 days</span>
        </div>
      </section>
    </div>
  )
}

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')
  useEffect(() => { load() }, [q])
  function load() { api.get(`/api/users?q=${encodeURIComponent(q)}`).then((d) => setUsers(d.users || [])) }
  const changeRole = async (u, role) => {
    if (!confirm(`Change ${u.name} to ${role}?`)) return
    await api.patch(`/api/users/${u.id}/role`, { role })
    load()
  }
  const del = async (u) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return
    await api.del(`/api/users/${u.id}`)
    load()
  }
  return (
    <div className="dash-page">
      <div className="dash-toolbar">
        <div className="dash-search">
          <SearchIcon size={14} />
          <input placeholder="Search users" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>
      <div className="dash-card">
        <table className="dash-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Plan</th><th>Joined</th><th /></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>
                  <span className={'dash-pill ' + (u.role === 'admin' ? 'dash-pill-purple' : 'dash-pill-gray')}>
                    {u.role}
                  </span>
                </td>
                <td>{(u.plan || 'free').toUpperCase()}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn-ghost btn-sm" onClick={() => changeRole(u, u.role === 'admin' ? 'user' : 'admin')}>
                    Toggle role
                  </button>
                  <button className="btn-ghost btn-sm" onClick={() => del(u)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [editing, setEditing] = useState(null)
  useEffect(() => { load() }, [])
  function load() { api.get('/api/jobs').then((d) => setJobs(d.jobs || [])) }
  const save = async (e) => {
    e.preventDefault()
    const payload = {
      ...editing,
      tags: typeof editing.tags === 'string' ? editing.tags.split(',').map((s) => s.trim()).filter(Boolean) : editing.tags,
    }
    if (editing.id) await api.put(`/api/jobs/${editing.id}`, payload)
    else            await api.post('/api/jobs', payload)
    setEditing(null)
    load()
  }
  const del = async (j) => {
    if (!confirm(`Delete "${j.title}"?`)) return
    await api.del(`/api/jobs/${j.id}`)
    load()
  }
  const open = (j) => setEditing({ tags: '', featured: false, active: true, type: 'Full-time', salary: '', location: 'Remote', ...j })
  return (
    <div className="dash-page">
      <div className="dash-toolbar">
        <button className="btn-primary" onClick={() => open({})}>+ New job</button>
      </div>
      <div className="dash-card">
        <table className="dash-table">
          <thead><tr><th>Title</th><th>Company</th><th>Location</th><th>Salary</th><th>Featured</th><th>Active</th><th /></tr></thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td><strong>{j.title}</strong></td>
                <td>{j.company}</td>
                <td>{j.location}</td>
                <td>{j.salary}</td>
                <td>{j.featured ? '★' : '—'}</td>
                <td>{j.active ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn-ghost btn-sm" onClick={() => open(j)}>Edit</button>
                  <button className="btn-ghost btn-sm" onClick={() => del(j)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="dash-modal-overlay" onClick={() => setEditing(null)}>
          <form className="dash-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editing.id ? 'Edit job' : 'New job'}</h3>
            <div className="dash-form-grid">
              <label className="field-label">Title<input className="dash-input" required value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
              <label className="field-label">Company<input className="dash-input" required value={editing.company || ''} onChange={(e) => setEditing({ ...editing, company: e.target.value })} /></label>
              <label className="field-label">Location<input className="dash-input" value={editing.location || ''} onChange={(e) => setEditing({ ...editing, location: e.target.value })} /></label>
              <label className="field-label">Salary<input className="dash-input" value={editing.salary || ''} onChange={(e) => setEditing({ ...editing, salary: e.target.value })} /></label>
              <label className="field-label">Type<input className="dash-input" value={editing.type || ''} onChange={(e) => setEditing({ ...editing, type: e.target.value })} /></label>
              <label className="field-label">Tags (comma-separated)<input className="dash-input" value={Array.isArray(editing.tags) ? editing.tags.join(', ') : (editing.tags || '')} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} /></label>
              <label className="check"><input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured</label>
              <label className="check"><input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
            </div>
            <div className="dash-modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function AdminKeys() {
  const [keys, setKeys] = useState([])
  useEffect(() => { api.get('/api/api-keys').then((d) => setKeys(d.keys || [])) }, [])
  return (
    <div className="dash-page">
      <div className="dash-card">
        <table className="dash-table">
          <thead><tr><th>Owner</th><th>Label</th><th>Key</th><th>Created</th><th>Status</th></tr></thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id}>
                <td><strong>{k.user?.name || '—'}</strong><br /><span className="dash-muted">{k.user?.email}</span></td>
                <td>{k.label}</td>
                <td><code>{k.key.slice(0, 12)}…{k.key.slice(-4)}</code></td>
                <td>{new Date(k.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={'dash-pill ' + (k.revoked ? 'dash-pill-red' : 'dash-pill-green')}>
                    {k.revoked ? 'Revoked' : 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminAnalytics() {
  const [events, setEvents] = useState([])
  const [type, setType] = useState('')
  useEffect(() => { api.get(`/api/analytics/events${type ? `?type=${type}` : ''}`).then((d) => setEvents(d.events || [])) }, [type])
  return (
    <div className="dash-page">
      <div className="dash-toolbar">
        <div className="dash-tabs">
          {['', 'signup', 'login', 'job_apply', 'key_issued', 'contact'].map((t) => (
            <button key={t || 'all'} className={type === t ? 'active' : ''} onClick={() => setType(t)}>
              {t || 'All'}
            </button>
          ))}
        </div>
      </div>
      <div className="dash-card">
        <table className="dash-table">
          <thead><tr><th>When</th><th>Type</th><th>User</th><th>Meta</th></tr></thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td>{new Date(e.at).toLocaleString()}</td>
                <td><span className="dash-pill">{e.type}</span></td>
                <td>{e.userId || '—'}</td>
                <td><code className="dash-muted">{JSON.stringify(e.meta).slice(0, 80)}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// =========================================================================
// ADMIN CONTENT PAGES
// =========================================================================
function AdminBlogs() {
  const [blogs, setBlogs] = useState([])
  const [editing, setEditing] = useState(null)
  useEffect(() => { load() }, [])
  async function load() { const d = await api.get('/api/blogs'); setBlogs(d.blogs || []) }
  const save = async (e) => {
    e.preventDefault()
    const payload = { ...editing }
    if (editing._id) await api.put(`/api/blogs/${editing._id}`, payload)
    else await api.post('/api/blogs', payload)
    setEditing(null)
    load()
  }
  const del = async (b) => {
    if (!confirm(`Delete "${b.title}"?`)) return
    await api.del(`/api/blogs/${b._id}`)
    load()
  }
  const open = (b) => setEditing(b ? { ...b } : { title: '', slug: '', excerpt: '', content: '', image: '', authorName: '', authorRole: '', tag: 'TECHNOLOGY', readTime: '5 min read', date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), active: true })
  return (
    <div className="dash-page">
      <div className="dash-toolbar"><button className="btn-primary" onClick={() => open(null)}>+ New blog</button></div>
      <div className="dash-card">
        <table className="dash-table">
          <thead><tr><th>Title</th><th>Tag</th><th>Author</th><th>Active</th><th /></tr></thead>
          <tbody>
            {blogs.map((b) => (
              <tr key={b._id}>
                <td><strong>{b.title}</strong></td>
                <td><span className="dash-pill">{b.tag}</span></td>
                <td>{b.authorName}</td>
                <td>{b.active ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn-ghost btn-sm" onClick={() => open(b)}>Edit</button>
                  <button className="btn-ghost btn-sm" onClick={() => del(b)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="dash-modal-overlay" onClick={() => setEditing(null)}>
          <form className="dash-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editing._id ? 'Edit blog' : 'New blog'}</h3>
            <div className="dash-form-grid">
              <label className="field-label">Title<input className="dash-input" required value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
              <label className="field-label">Slug<input className="dash-input" required value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></label>
              <label className="field-label">Tag<input className="dash-input" value={editing.tag || ''} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} /></label>
              <label className="field-label">Author Name<input className="dash-input" value={editing.authorName || ''} onChange={(e) => setEditing({ ...editing, authorName: e.target.value })} /></label>
              <label className="field-label">Author Role<input className="dash-input" value={editing.authorRole || ''} onChange={(e) => setEditing({ ...editing, authorRole: e.target.value })} /></label>
              <label className="field-label">Read Time<input className="dash-input" value={editing.readTime || ''} onChange={(e) => setEditing({ ...editing, readTime: e.target.value })} /></label>
              <label className="field-label">Image<input className="dash-input" value={editing.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></label>
              <label className="field-label">Date<input className="dash-input" value={editing.date || ''} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></label>
              <label className="field-label" style={{ gridColumn: '1/-1' }}>Excerpt<textarea className="dash-input" rows={2} value={editing.excerpt || ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></label>
              <label className="field-label" style={{ gridColumn: '1/-1' }}>Content<textarea className="dash-input" rows={6} value={editing.content || ''} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></label>
              <label className="check"><input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
            </div>
            <div className="dash-modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function AdminServices() {
  const [services, setServices] = useState([])
  const [editing, setEditing] = useState(null)
  useEffect(() => { load() }, [])
  async function load() { const d = await api.get('/api/services'); setServices(d.services || []) }
  const save = async (e) => {
    e.preventDefault()
    const payload = { ...editing }
    if (editing._id) await api.put(`/api/services/${editing._id}`, payload)
    else await api.post('/api/services', payload)
    setEditing(null)
    load()
  }
  const del = async (s) => {
    if (!confirm(`Delete "${s.title}"?`)) return
    await api.del(`/api/services/${s._id}`)
    load()
  }
  const open = (s) => setEditing(s ? { ...s } : { title: '', slug: '', tagline: '', description: '', image: '', color: 'blue', features: [], benefits: [], technologies: [], projects: 0, clients: 0, active: true, order: 0 })
  return (
    <div className="dash-page">
      <div className="dash-toolbar"><button className="btn-primary" onClick={() => open(null)}>+ New service</button></div>
      <div className="dash-card">
        <table className="dash-table">
          <thead><tr><th>Title</th><th>Color</th><th>Projects</th><th>Active</th><th /></tr></thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id}>
                <td><strong>{s.title}</strong></td>
                <td><span className="dash-pill">{s.color}</span></td>
                <td>{s.projects}</td>
                <td>{s.active ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn-ghost btn-sm" onClick={() => open(s)}>Edit</button>
                  <button className="btn-ghost btn-sm" onClick={() => del(s)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="dash-modal-overlay" onClick={() => setEditing(null)}>
          <form className="dash-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editing._id ? 'Edit service' : 'New service'}</h3>
            <div className="dash-form-grid">
              <label className="field-label">Title<input className="dash-input" required value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
              <label className="field-label">Slug<input className="dash-input" required value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></label>
              <label className="field-label">Tagline<input className="dash-input" value={editing.tagline || ''} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} /></label>
              <label className="field-label">Color<input className="dash-input" value={editing.color || ''} onChange={(e) => setEditing({ ...editing, color: e.target.value })} /></label>
              <label className="field-label">Image<input className="dash-input" value={editing.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></label>
              <label className="field-label">Projects Count<input className="dash-input" type="number" value={editing.projects || 0} onChange={(e) => setEditing({ ...editing, projects: Number(e.target.value) })} /></label>
              <label className="field-label">Clients Count<input className="dash-input" type="number" value={editing.clients || 0} onChange={(e) => setEditing({ ...editing, clients: Number(e.target.value) })} /></label>
              <label className="field-label">Order<input className="dash-input" type="number" value={editing.order || 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></label>
              <label className="field-label" style={{ gridColumn: '1/-1' }}>Description<textarea className="dash-input" rows={3} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></label>
              <label className="field-label" style={{ gridColumn: '1/-1' }}>Features (comma-separated)<input className="dash-input" value={Array.isArray(editing.features) ? editing.features.join(', ') : ''} onChange={(e) => setEditing({ ...editing, features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} /></label>
              <label className="field-label" style={{ gridColumn: '1/-1' }}>Technologies (comma-separated)<input className="dash-input" value={Array.isArray(editing.technologies) ? editing.technologies.join(', ') : ''} onChange={(e) => setEditing({ ...editing, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} /></label>
              <label className="check"><input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
            </div>
            <div className="dash-modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [editing, setEditing] = useState(null)
  useEffect(() => { load() }, [])
  async function load() { const d = await api.get('/api/projects'); setProjects(d.projects || []) }
  const save = async (e) => {
    e.preventDefault()
    const payload = { ...editing }
    if (editing._id) await api.put(`/api/projects/${editing._id}`, payload)
    else await api.post('/api/projects', payload)
    setEditing(null)
    load()
  }
  const del = async (p) => {
    if (!confirm(`Delete "${p.title}"?`)) return
    await api.del(`/api/projects/${p._id}`)
    load()
  }
  const open = (p) => setEditing(p ? { ...p } : { title: '', slug: '', tag: 'PROJECT', client: '', year: '', desc: '', fullDesc: '', image: '', tech: [], results: [], active: true, featured: false })
  return (
    <div className="dash-page">
      <div className="dash-toolbar"><button className="btn-primary" onClick={() => open(null)}>+ New project</button></div>
      <div className="dash-card">
        <table className="dash-table">
          <thead><tr><th>Title</th><th>Client</th><th>Year</th><th>Featured</th><th>Active</th><th /></tr></thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id}>
                <td><strong>{p.title}</strong></td>
                <td>{p.client}</td>
                <td>{p.year}</td>
                <td>{p.featured ? '★' : '—'}</td>
                <td>{p.active ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn-ghost btn-sm" onClick={() => open(p)}>Edit</button>
                  <button className="btn-ghost btn-sm" onClick={() => del(p)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="dash-modal-overlay" onClick={() => setEditing(null)}>
          <form className="dash-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editing._id ? 'Edit project' : 'New project'}</h3>
            <div className="dash-form-grid">
              <label className="field-label">Title<input className="dash-input" required value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
              <label className="field-label">Slug<input className="dash-input" required value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></label>
              <label className="field-label">Tag<input className="dash-input" value={editing.tag || ''} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} /></label>
              <label className="field-label">Client<input className="dash-input" value={editing.client || ''} onChange={(e) => setEditing({ ...editing, client: e.target.value })} /></label>
              <label className="field-label">Year<input className="dash-input" value={editing.year || ''} onChange={(e) => setEditing({ ...editing, year: e.target.value })} /></label>
              <label className="field-label">Image<input className="dash-input" value={editing.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></label>
              <label className="field-label" style={{ gridColumn: '1/-1' }}>Short Description<textarea className="dash-input" rows={2} value={editing.desc || ''} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} /></label>
              <label className="field-label" style={{ gridColumn: '1/-1' }}>Full Description<textarea className="dash-input" rows={4} value={editing.fullDesc || ''} onChange={(e) => setEditing({ ...editing, fullDesc: e.target.value })} /></label>
              <label className="field-label" style={{ gridColumn: '1/-1' }}>Tech Stack (comma-separated)<input className="dash-input" value={Array.isArray(editing.tech) ? editing.tech.join(', ') : ''} onChange={(e) => setEditing({ ...editing, tech: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} /></label>
              <label className="field-label" style={{ gridColumn: '1/-1' }}>Results (comma-separated)<input className="dash-input" value={Array.isArray(editing.results) ? editing.results.join(', ') : ''} onChange={(e) => setEditing({ ...editing, results: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} /></label>
              <label className="check"><input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured</label>
              <label className="check"><input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
            </div>
            <div className="dash-modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function AdminCaseStudies() {
  const [caseStudies, setCaseStudies] = useState([])
  const [editing, setEditing] = useState(null)
  useEffect(() => { load() }, [])
  async function load() { const d = await api.get('/api/case-studies'); setCaseStudies(d.caseStudies || []) }
  const save = async (e) => {
    e.preventDefault()
    const payload = { ...editing }
    if (editing._id) await api.put(`/api/case-studies/${editing._id}`, payload)
    else await api.post('/api/case-studies', payload)
    setEditing(null)
    load()
  }
  const del = async (c) => {
    if (!confirm(`Delete "${c.title}"?`)) return
    await api.del(`/api/case-studies/${c._id}`)
    load()
  }
  const open = (c) => setEditing(c ? { ...c } : { title: '', slug: '', tag: 'CASE STUDY', client: '', industry: '', duration: '', challenge: '', solution: '', outcome: '', image: '', sections: [], active: true, featured: false })
  return (
    <div className="dash-page">
      <div className="dash-toolbar"><button className="btn-primary" onClick={() => open(null)}>+ New case study</button></div>
      <div className="dash-card">
        <table className="dash-table">
          <thead><tr><th>Title</th><th>Client</th><th>Industry</th><th>Featured</th><th>Active</th><th /></tr></thead>
          <tbody>
            {caseStudies.map((c) => (
              <tr key={c._id}>
                <td><strong>{c.title}</strong></td>
                <td>{c.client}</td>
                <td>{c.industry}</td>
                <td>{c.featured ? '★' : '—'}</td>
                <td>{c.active ? 'Yes' : 'No'}</td>
                <td>
                  <button className="btn-ghost btn-sm" onClick={() => open(c)}>Edit</button>
                  <button className="btn-ghost btn-sm" onClick={() => del(c)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="dash-modal-overlay" onClick={() => setEditing(null)}>
          <form className="dash-modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <h3>{editing._id ? 'Edit case study' : 'New case study'}</h3>
            <div className="dash-form-grid">
              <label className="field-label">Title<input className="dash-input" required value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
              <label className="field-label">Slug<input className="dash-input" required value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></label>
              <label className="field-label">Tag<input className="dash-input" value={editing.tag || ''} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} /></label>
              <label className="field-label">Client<input className="dash-input" value={editing.client || ''} onChange={(e) => setEditing({ ...editing, client: e.target.value })} /></label>
              <label className="field-label">Industry<input className="dash-input" value={editing.industry || ''} onChange={(e) => setEditing({ ...editing, industry: e.target.value })} /></label>
              <label className="field-label">Duration<input className="dash-input" value={editing.duration || ''} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} /></label>
              <label className="field-label">Image<input className="dash-input" value={editing.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></label>
              <label className="field-label" style={{ gridColumn: '1/-1' }}>Challenge<textarea className="dash-input" rows={2} value={editing.challenge || ''} onChange={(e) => setEditing({ ...editing, challenge: e.target.value })} /></label>
              <label className="field-label" style={{ gridColumn: '1/-1' }}>Solution<textarea className="dash-input" rows={2} value={editing.solution || ''} onChange={(e) => setEditing({ ...editing, solution: e.target.value })} /></label>
              <label className="field-label" style={{ gridColumn: '1/-1' }}>Outcome<textarea className="dash-input" rows={2} value={editing.outcome || ''} onChange={(e) => setEditing({ ...editing, outcome: e.target.value })} /></label>
              <label className="check"><input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured</label>
              <label className="check"><input type="checkbox" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Active</label>
            </div>
            <div className="dash-modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [filter, setFilter] = useState('all')
  useEffect(() => { load() }, [filter])
  async function load() { const d = await api.get('/api/contacts'); setContacts(d.contacts || []) }
  const markRead = async (id) => { await api.patch(`/api/contacts/${id}/read`); load() }
  const del = async (c) => {
    if (!confirm('Delete this contact?')) return
    await api.del(`/api/contacts/${c._id}`)
    load()
  }
  const filtered = filter === 'all' ? contacts : filter === 'unread' ? contacts.filter((c) => !c.read) : contacts.filter((c) => c.read)
  return (
    <div className="dash-page">
      <div className="dash-toolbar">
        <div className="dash-tabs">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Unread</button>
          <button className={filter === 'read' ? 'active' : ''} onClick={() => setFilter('read')}>Read</button>
        </div>
      </div>
      <div className="dash-card">
        <table className="dash-table">
          <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th><th>Status</th><th /></tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c._id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.email}</td>
                <td><span className="dash-pill">{c.subject}</span></td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                <td><span className={'dash-pill ' + (c.read ? 'dash-pill-green' : 'dash-pill-red')}>{c.read ? 'Read' : 'New'}</span></td>
                <td>
                  {!c.read && <button className="btn-ghost btn-sm" onClick={() => markRead(c._id)}>Mark read</button>}
                  <button className="btn-ghost btn-sm" onClick={() => del(c)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// =========================================================================
// MAIN DASHBOARD — chooses the right page based on view + role
// =========================================================================
export default function Dashboard({ user, onSignOut, onHome, onUserUpdate }) {
  const isAdmin = user?.role === 'admin'
  const [view, setView] = useState(isAdmin ? 'admin-overview' : 'overview')

  const titles = {
    'overview':            'Overview',
    'jobs':                'This week\'s jobs',
    'api':                 'API keys',
    'resume':              'AI resume',
    'interview':           'AI interview coach',
    'courses':             'Courses',
    'upgrade':             'Upgrade your plan',
    'profile':             'Profile',
    'admin-overview':      'Admin · Dashboard',
    'admin-users':         'Admin · Users',
    'admin-jobs':          'Admin · Jobs',
    'admin-blogs':         'Admin · Blogs',
    'admin-services':      'Admin · Services',
    'admin-projects':      'Admin · Projects',
    'admin-case-studies':  'Admin · Case Studies',
    'admin-contacts':      'Admin · Contacts',
    'admin-keys':          'Admin · API keys',
    'admin-analytics':     'Admin · Analytics',
  }

  return (
    <div className="dash-shell">
      <Sidebar view={view} setView={setView} user={user} isAdmin={isAdmin} />
      <main className="dash-main-area">
        <Topbar title={titles[view] || 'Dashboard'} onSignOut={onSignOut} onHome={onHome} user={user} />
        <div className="dash-content">
          {view === 'overview'        && <UserOverview user={user} setView={setView} />}
          {view === 'jobs'            && <UserJobs />}
          {view === 'api'             && <UserApi />}
          {view === 'resume'          && <UserResume user={user} onUserUpdate={onUserUpdate} />}
          {view === 'interview'       && <UserInterview />}
          {view === 'courses'         && <UserCourses />}
          {view === 'upgrade'         && <UserUpgrade user={user} onUserUpdate={onUserUpdate} />}
          {view === 'profile'         && <UserProfile user={user} onUserUpdate={onUserUpdate} />}
          {isAdmin && view === 'admin-overview'    && <AdminOverview />}
          {isAdmin && view === 'admin-users'       && <AdminUsers />}
          {isAdmin && view === 'admin-jobs'        && <AdminJobs />}
          {isAdmin && view === 'admin-blogs'       && <AdminBlogs />}
          {isAdmin && view === 'admin-services'    && <AdminServices />}
          {isAdmin && view === 'admin-projects'    && <AdminProjects />}
          {isAdmin && view === 'admin-case-studies' && <AdminCaseStudies />}
          {isAdmin && view === 'admin-contacts'    && <AdminContacts />}
          {isAdmin && view === 'admin-keys'        && <AdminKeys />}
          {isAdmin && view === 'admin-analytics'   && <AdminAnalytics />}
        </div>
      </main>
    </div>
  )
}
