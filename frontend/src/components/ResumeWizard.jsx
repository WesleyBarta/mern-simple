import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import { ArrowRightIcon, CheckIcon, SparklesIcon, DocumentIcon, TargetIcon, GraduationIcon, BriefcaseIcon, KeyIcon, XIcon } from './Icons'
import ResumePDF, { getAvailableTemplates } from './ResumePDF'

const STEPS = [
  { id: 1, title: 'Source', desc: 'Upload or start blank' },
  { id: 2, title: 'Contact', desc: 'Your details' },
  { id: 3, title: 'Summary', desc: 'A short pitch' },
  { id: 4, title: 'Work History', desc: 'Your experience' },
  { id: 5, title: 'Education', desc: 'Your degrees' },
  { id: 6, title: 'Skills', desc: 'What you know' },
  { id: 7, title: 'Custom', desc: 'Pro · Extra' },
  { id: 8, title: 'Template', desc: 'Pick a layout' },
  { id: 9, title: 'Review & Export', desc: 'Download PDF' },
]

function emptyResume() {
  return {
    title: 'My Resume',
    activeTemplate: 'minimalist',
    currentStep: 1,
    isCompleted: false,
    contact: { fullName: '', email: '', phone: '', linkedin: '', portfolio: '', location: { city: '', region: '', country: '' } },
    summary: { text: '' },
    work: [],
    education: [],
    skills: [],
    custom: [],
  }
}

export default function ResumeWizard({ user, onUserUpdate }) {
  const [resume, setResume] = useState(null)
  const [resumeId, setResumeId] = useState(null)
  const [step, setStep] = useState(1)
  const [tier, setTier] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [availableTemplates, setAvailableTemplates] = useState([])

useEffect(() => {
  api.get('/api/resumes').then((d) => {
    console.log('API Response:', d)  // ✅ ADD THIS
    console.log('Tier object:', d.tier)  // ✅ ADD THIS
    
    setTier(d.tier)
    
    const userTier = d.tier?.plan || 'free'
    console.log('User tier:', userTier)  // ✅ ADD THIS
    
    const templates = getAvailableTemplates(userTier)
    console.log('Available templates:', templates)  // ✅ ADD THIS
    setAvailableTemplates(templates)
    
    if (d.resumes.length) {
      setResume(d.resumes[0])
      setResumeId(d.resumes[0].id)
      setStep(d.resumes[0].currentStep || 1)
    }
  }).finally(() => setLoading(false))
}, [])

  const create = async () => {
    setError('')
    try {
      const d = await api.post('/api/resumes', { title: resume?.title || 'My Resume' })
      setResume(d.resume); setResumeId(d.resume.id)
      setStep(2)
    } catch (e) { setError(e.message) }
  }

  const persist = async (patch) => {
    if (!resumeId) return
    setError('')
    try {
      const d = await api.patch(`/api/resumes/${resumeId}`, patch)
      setResume(d.resume)
    } catch (e) { setError(e.message) }
  }

  const updateField = (path, value) => {
    setResume((r) => {
      const next = { ...r, [path]: value }
      return next
    })
    if (resumeId) {
      // debounce — send every change but ignore errors here, persist() below covers full save
      api.patch(`/api/resumes/${resumeId}`, { [path]: value }).catch(() => { })
    }
  }

  const goNext = async () => {
    setError('')
    if (resumeId) {
      try {
        await api.patch(`/api/resumes/${resumeId}`, { currentStep: step + 1 })
      } catch (e) { setError(e.message); return }
    }
    setStep((s) => Math.min(STEPS.length, s + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goBack = () => { setError(''); setStep((s) => Math.max(1, s - 1)) }
  const jumpTo = async (n) => {
    setError('')
    if (resumeId && n > step) {
      try { await api.patch(`/api/resumes/${resumeId}`, { currentStep: n }) }
      catch (e) { setError(e.message); return }
    }
    setStep(n)
  }

const onUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  setUploading(true)
  setError('')
  try {
    const reader = new FileReader()
    reader.onload = async () => {
      const b64 = reader.result.split(',')[1]
      const d = await api.post('/api/resumes/parse', {
        filename: file.name,
        contentBase64: b64,
        mimeType: file.type || 'application/pdf',
      })
      
      // Create the resume
      const created = await api.post('/api/resumes', { title: 'Imported ' + file.name })
      
      // ✅ SAVE ALL EXTRACTED DATA
      const patch = {
        contact: d.extracted.contact || {
          fullName: d.extracted.fullName,
          email: d.extracted.email,
          phone: d.extracted.phone,
        },
        summary: d.extracted.summary ? { text: d.extracted.summary } : { text: '' },
        work: d.extracted.work || [],           // ✅ ADD THIS
        education: d.extracted.education || [], // ✅ ADD THIS
        skills: d.extracted.skills || [],       // ✅ ADD THIS
      }
      
      // Save to database
      await api.patch(`/api/resumes/${created.resume.id}`, patch)
      
      const final = await api.get(`/api/resumes/${created.resume.id}`)
      setResume(final.resume)
      setResumeId(final.resume.id)
      setStep(2)
    }
    reader.readAsDataURL(file)
  } catch (e) { 
    setError(e.message) 
  }
  finally { 
    setUploading(false) 
  }
}

  if (loading) return <div className="dash-page"><p className="dash-muted">Loading…</p></div>

  // Step 1: Source choice
  if (!resume) {
    return (
      <div className="dash-page">
        <div className="dash-welcome">
          <h1>AI Resume Builder</h1>
          <p>Generate a clean, ATS-friendly resume in minutes. You have <strong>{tier?.remaining || 0}</strong> generation{tier?.remaining === 1 ? '' : 's'} left on the <strong>{(user?.plan || 'free').toUpperCase()}</strong> plan.</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <div className="resume-source-grid">
          <div className="resume-source-card">
            <div className="resume-source-icon"><DocumentIcon size={28} /></div>
            <h3>Upload PDF or Docx</h3>
            <p>We'll parse the file and pre-fill your contact details and summary so you can edit from there.</p>
            <label className="btn-primary btn-block">
              {uploading ? 'Parsing…' : 'Choose a file'}
              <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" hidden onChange={onUpload} />
            </label>
          </div>
          <div className="resume-source-card">
            <div className="resume-source-icon resume-source-icon-alt"><SparklesIcon size={28} /></div>
            <h3>Start from scratch</h3>
            <p>Build a fresh resume with our step-by-step wizard. We'll save as you go.</p>
            <button className="btn-outline btn-block" onClick={create}>Start blank</button>
          </div>
        </div>
        <div className="dash-card">
          <h3>Your tier</h3>
          <p className="dash-muted">Higher tiers unlock more templates, custom sections, and ATS keyword matching against job descriptions.</p>
          <div className="resume-tier-grid">
            <div className="resume-tier"><strong>Free</strong><span>3 templates · Minimalist, Executive, Creative</span></div>
            <div className="resume-tier"><strong>Premium</strong><span>6 templates · + Modern, Professional, Dark</span></div>
            <div className="resume-tier"><strong>Pro</strong><span>11 templates · + Elegant, Startup, Tech, Minimal Dark, Corporate</span></div>
            <div className="resume-tier"><strong>Pro50</strong><span>50 templates · All templates including Vibrant, Ocean, Forest, Sunset, Midnight + more</span></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dash-page resume-wiz">
      <div className="resume-wiz-top">
        <div>
          <h1>{resume.title || 'My Resume'}</h1>
          <p className="dash-muted">Step {step} of {STEPS.length} · {tier?.used || 0}/{tier?.uses} generations used</p>
        </div>
        <div className="resume-wiz-actions">
          <button className="btn-ghost btn-sm" onClick={() => setShowPreview((v) => !v)}>
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>
        </div>
      </div>

      <div className="resume-wiz-steps">
        {STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={'resume-wiz-step' + (step === s.id ? ' active' : '') + (s.id < step ? ' done' : '')}
            onClick={() => jumpTo(s.id)}
            disabled={s.id > step + 1}
          >
            <span className="resume-wiz-step-num">{s.id < step ? <CheckIcon size={12} /> : s.id}</span>
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      {error && <div className="auth-error">{error}</div>}

      <div className={'resume-wiz-body' + (showPreview ? '' : ' no-preview')}>
        <div className="resume-wiz-form">
          {step === 2 && <StepContact resume={resume} onChange={updateField} />}
          {step === 3 && <StepSummary resume={resume} onChange={updateField} user={user} tier={tier} />}
          {step === 4 && <StepWork resume={resume} onChange={updateField} user={user} tier={tier} />}
          {step === 5 && <StepEducation resume={resume} onChange={updateField} />}
          {step === 6 && <StepSkills resume={resume} onChange={updateField} user={user} tier={tier} />}
          {step === 7 && <StepCustom resume={resume} onChange={updateField} user={user} tier={tier} />}
          {step === 8 && <StepTemplate resume={resume} onChange={updateField} availableTemplates={availableTemplates} />}
          {step === 9 && <StepReview resume={resume} user={user} tier={tier} error={error} setError={setError} onComplete={async () => { await persist({ isCompleted: true }); const d = await api.post(`/api/resumes/${resumeId}/complete`); setResume(d.resume); setTier((t) => ({ ...t, used: (t?.used || 0) + 1, remaining: d.remaining })) }} />}

          <div className="resume-wiz-nav">
            <button className="btn-ghost" onClick={goBack} disabled={step === 1}>← Back</button>
            {step < STEPS.length && <button className="btn-primary" onClick={goNext}>Next <ArrowRightIcon size={14} /></button>}
          </div>
        </div>

        {showPreview && (
          <div className="resume-wiz-preview">
            <div className="resume-wiz-preview-label">Live preview · {resume.activeTemplate}</div>
            <div className="resume-wiz-preview-frame">
              <ResumePDF resume={resume} template={resume.activeTemplate || 'minimalist'} userTier={tier?.plan || 'free'} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============== STEP COMPONENTS ==============

function StepContact({ resume, onChange }) {
  const c = resume.contact
  const set = (k, v) => onChange('contact', { ...c, [k]: v })
  const setLoc = (k, v) => onChange('contact', { ...c, location: { ...c.location, [k]: v } })
  return (
    <div className="resume-step">
      <h2>Contact details</h2>
      <p className="dash-muted">Start with the basics. We'll format them into the header of every template.</p>
      <div className="resume-form-grid">
        <Field label="Full name" required value={c.fullName} onChange={(v) => set('fullName', v)} />
        <Field label="Email" type="email" required value={c.email} onChange={(v) => set('email', v)} />
        <Field label="Phone" value={c.phone} onChange={(v) => set('phone', v)} />
        <Field label="LinkedIn" value={c.linkedin} onChange={(v) => set('linkedin', v)} placeholder="https://linkedin.com/in/…" />
        <Field label="Portfolio" value={c.portfolio} onChange={(v) => set('portfolio', v)} placeholder="https://yoursite.com" />
        <Field label="City" value={c.location?.city || ''} onChange={(v) => setLoc('city', v)} />
        <Field label="Region" value={c.location?.region || ''} onChange={(v) => setLoc('region', v)} />
        <Field label="Country" value={c.location?.country || ''} onChange={(v) => setLoc('country', v)} />
      </div>
    </div>
  )
}

function StepSummary({ resume, onChange, user, tier }) {
  const [working, setWorking] = useState(false)
  const [steps, setSteps] = useState([])
  const enhance = async (mode) => {
    setWorking(true)
    try {
      const d = await api.post(`/api/resumes/${resume.id}/ai`, {
        field: 'summary',
        text: resume.summary?.text || '',
        jobDescription: mode === 'jd' ? window.prompt('Paste the job description for ATS keyword matching:') : undefined,
      })
      onChange('summary', { text: d.enhanced })
      setSteps(d.steps || [])
    } catch (e) { alert(e.message) }
    finally { setWorking(false) }
  }
  return (
    <div className="resume-step">
      <h2>Summary</h2>
      <p className="dash-muted">A 2-4 sentence pitch. We'll polish it with AI when you're ready.</p>
      <Field multiline rows={6} label="Professional summary" value={resume.summary?.text || ''} onChange={(v) => onChange('summary', { text: v })} />
      <div className="resume-ai-tools">
        <button className="btn-outline btn-sm" disabled={working} onClick={() => enhance()}>
          <SparklesIcon size={14} /> {working ? 'Working…' : 'AI polish (Free)'}
        </button>
        {tier?.actionVerbs && (
          <button className="btn-outline btn-sm" disabled={working} onClick={() => enhance('pro')}>
            <SparklesIcon size={14} /> Rewrite with action verbs (Pro)
          </button>
        )}
        {tier?.jdMatching && (
          <button className="btn-outline btn-sm" disabled={working} onClick={() => enhance('jd')}>
            <TargetIcon size={14} /> Match against JD (Extra)
          </button>
        )}
      </div>
      {steps.length > 0 && (
        <div className="resume-ai-steps">
          {steps.map((s) => <div key={s}><CheckIcon size={12} /> {s}</div>)}
        </div>
      )}
    </div>
  )
}

function StepWork({ resume, onChange, user, tier }) {
  const list = resume.work || []
  const update = (next) => onChange('work', next)
  const add = () => update([...list, { id: 'w_' + Date.now(), company: '', role: '', location: '', startDate: '', endDate: '', current: false, bullets: [] }])
  const remove = (i) => update(list.filter((_, idx) => idx !== i))
  const set = (i, patch) => update(list.map((w, idx) => idx === i ? { ...w, ...patch } : w))
  return (
    <div className="resume-step">
      <h2>Work history</h2>
      <p className="dash-muted">Add each role. Tip: 3-5 bullets per role, each starting with a strong verb.</p>
      {list.length === 0 && <p className="dash-muted">No work entries yet. Click "Add role" to begin.</p>}
      {list.map((w, i) => (
        <div key={w.id || i} className="resume-entry">
          <div className="resume-entry-head">
            <strong>Role {i + 1}</strong>
            <button type="button" className="btn-ghost btn-sm" onClick={() => remove(i)}>Remove</button>
          </div>
          <div className="resume-form-grid">
            <Field label="Company" value={w.company} onChange={(v) => set(i, { company: v })} required />
            <Field label="Role" value={w.role} onChange={(v) => set(i, { role: v })} required />
            <Field label="Location" value={w.location || ''} onChange={(v) => set(i, { location: v })} />
            <Field label="Start" value={w.startDate} onChange={(v) => set(i, { startDate: v })} placeholder="Jan 2022" required />
            <Field label="End" value={w.endDate || ''} onChange={(v) => set(i, { endDate: v })} placeholder="Present" disabled={w.current} />
            <label className="check"><input type="checkbox" checked={!!w.current} onChange={(e) => set(i, { current: e.target.checked, endDate: e.target.checked ? '' : w.endDate })} /> Currently here</label>
          </div>
          <Field
            multiline rows={4} label="Bullets (one per line)"
            value={(w.bullets || []).join('\n')}
            onChange={(v) => set(i, { bullets: v.split('\n').map((s) => s.trim()).filter(Boolean) })}
          />
          {tier?.actionVerbs && (
            <button type="button" className="btn-ghost btn-sm" onClick={async () => {
              const out = []
              for (const b of (w.bullets || [])) {
                try {
                  const d = await api.post(`/api/resumes/${resume.id}/ai`, { field: 'bullet', text: b })
                  out.push(d.enhanced)
                } catch { out.push(b) }
              }
              set(i, { bullets: out })
            }}><SparklesIcon size={12} /> Rewrite bullets with AI</button>
          )}
        </div>
      ))}
      <button className="btn-outline" onClick={add}>+ Add role</button>
    </div>
  )
}

function StepEducation({ resume, onChange }) {
  const list = resume.education || []
  const update = (next) => onChange('education', next)
  const add = () => update([...list, { id: 'e_' + Date.now(), school: '', degree: '', field: '', graduationDate: '', gpa: '' }])
  const remove = (i) => update(list.filter((_, idx) => idx !== i))
  const set = (i, patch) => update(list.map((e, idx) => idx === i ? { ...e, ...patch } : e))
  return (
    <div className="resume-step">
      <h2>Education</h2>
      <p className="dash-muted">List your degrees, most recent first.</p>
      {list.length === 0 && <p className="dash-muted">No education entries yet.</p>}
      {list.map((e, i) => (
        <div key={e.id || i} className="resume-entry">
          <div className="resume-entry-head"><strong>School {i + 1}</strong><button type="button" className="btn-ghost btn-sm" onClick={() => remove(i)}>Remove</button></div>
          <div className="resume-form-grid">
            <Field label="School" value={e.school} onChange={(v) => set(i, { school: v })} required />
            <Field label="Degree" value={e.degree || ''} onChange={(v) => set(i, { degree: v })} placeholder="B.S., M.A., PhD" />
            <Field label="Field of study" value={e.field || ''} onChange={(v) => set(i, { field: v })} />
            <Field label="Graduation" value={e.graduationDate || ''} onChange={(v) => set(i, { graduationDate: v })} placeholder="May 2024" />
            <Field label="GPA" value={e.gpa || ''} onChange={(v) => set(i, { gpa: v })} placeholder="3.8 / 4.0" />
          </div>
        </div>
      ))}
      <button className="btn-outline" onClick={add}>+ Add school</button>
    </div>
  )
}

function StepSkills({ resume, onChange, user, tier }) {
  const list = resume.skills || []
  const update = (next) => onChange('skills', next)
  const add = () => update([...list, { id: 's_' + Date.now(), name: '', level: 'basic' }])
  const remove = (i) => update(list.filter((_, idx) => idx !== i))
  const set = (i, patch) => update(list.map((s, idx) => idx === i ? { ...s, ...patch } : s))
  return (
    <div className="resume-step">
      <h2>Skills</h2>
      <p className="dash-muted">Group by what you actually use. Pro/Extra plans unlock proficiency levels.</p>
      {list.length === 0 && <p className="dash-muted">No skills yet.</p>}
      {list.map((s, i) => (
        <div key={s.id || i} className="resume-entry resume-entry-row">
          <Field label="Skill" value={s.name} onChange={(v) => set(i, { name: v })} />
          {tier?.proficiency ? (
            <div className="field-label">
              <label>Level</label>
              <select className="dash-input" value={s.level || 'basic'} onChange={(e) => set(i, { level: e.target.value })}>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          ) : (
            <span className="dash-pill">Basic (Pro for levels)</span>
          )}
          <button type="button" className="btn-ghost btn-sm" onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <button className="btn-outline" onClick={add}>+ Add skill</button>
    </div>
  )
}

function StepCustom({ resume, onChange, user, tier }) {
  if (!tier?.customSections) {
    return (
      <div className="resume-step">
        <h2>Custom sections</h2>
        <div className="resume-gate">
          <SparklesIcon size={32} />
          <h3>Pro feature</h3>
          <p>Add dynamic sections like <strong>Projects, Volunteer Work, Certifications, Awards, Publications</strong> — anything that doesn't fit the standard template.</p>
          <a href="#upgrade" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('go-upgrade')) }} className="btn-primary">Upgrade to Pro</a>
        </div>
      </div>
    )
  }
  const list = resume.custom || []
  const update = (next) => onChange('custom', next)
  const add = () => update([...list, { id: 'c_' + Date.now(), label: '', body: '' }])
  const remove = (i) => update(list.filter((_, idx) => idx !== i))
  const set = (i, patch) => update(list.map((c, idx) => idx === i ? { ...c, ...patch } : c))
  return (
    <div className="resume-step">
      <h2>Custom sections</h2>
      <p className="dash-muted">Add anything that doesn't fit the standard template.</p>
      {list.length === 0 && <p className="dash-muted">No custom sections yet.</p>}
      {list.map((c, i) => (
        <div key={c.id || i} className="resume-entry">
          <div className="resume-entry-head"><strong>Section {i + 1}</strong><button type="button" className="btn-ghost btn-sm" onClick={() => remove(i)}>Remove</button></div>
          <Field label="Section title" value={c.label} onChange={(v) => set(i, { label: v })} placeholder="Projects, Volunteer Work, Awards…" />
          <Field multiline rows={5} label="Body" value={c.body} onChange={(v) => set(i, { body: v })} />
        </div>
      ))}
      <button className="btn-outline" onClick={add}>+ Add section</button>
    </div>
  )
}

function StepTemplate({ resume, onChange, availableTemplates }) {
  const set = (id) => onChange('activeTemplate', id)

  return (
    <div className="resume-step">
      <h2>Pick a template</h2>
      <p className="dash-muted">Choose from {availableTemplates.length} available templates. Each has a different look and live preview updates on the right.</p>
      <div className="resume-template-grid">
        {availableTemplates.map((t) => (
          <button
            key={t.id}
            type="button"
            className={'resume-template' + (resume.activeTemplate === t.id ? ' selected' : '')}
            onClick={() => set(t.id)}
          >
            <div className={'resume-template-thumb resume-template-thumb-' + t.id}>
              <span className="resume-template-thumb-line" style={{ width: '70%' }} />
              <span className="resume-template-thumb-line" style={{ width: '50%' }} />
              <span className="resume-template-thumb-line" style={{ width: '80%' }} />
              <span className="resume-template-thumb-line" style={{ width: '60%' }} />
              <span className="resume-template-thumb-line" style={{ width: '40%' }} />
            </div>
            <div className="resume-template-name">
              {t.name} {t.tier !== 'free' && <span className="dash-pill dash-pill-purple">{t.tier.toUpperCase()}</span>}
            </div>
            <div className="resume-template-blurb">{t.blurb}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepReview({ resume, user, tier, error, setError, onComplete }) {
  const [working, setWorking] = useState(false)
  const complete = async () => {
    setWorking(true); setError('')
    try { await onComplete() } catch (e) { setError(e.message) }
    finally { setWorking(false) }
  }
  const dl = () => {
    // Build a clean HTML print file from the current resume
    const html = buildHtmlPrint(resume)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const w = window.open(url, '_blank')
    if (w) setTimeout(() => w.print(), 600)
  }
  return (
    <div className="resume-step">
      <h2>Review &amp; export</h2>
      <p className="dash-muted">Your live preview is on the right. When you're happy, mark it complete (this counts as one generation) and download.</p>
      {error && <div className="auth-error">{error}</div>}
      <div className="resume-review-stats">
        <div><strong>{resume.work?.length || 0}</strong><span>Work entries</span></div>
        <div><strong>{resume.education?.length || 0}</strong><span>Schools</span></div>
        <div><strong>{resume.skills?.length || 0}</strong><span>Skills</span></div>
        <div><strong>{resume.custom?.length || 0}</strong><span>Custom sections</span></div>
        <div><strong>{tier?.remaining || 0}</strong><span>Generations left</span></div>
      </div>
      <div className="resume-review-actions">
        <button className="btn-outline btn-lg" onClick={dl}><DocumentIcon size={14} /> Open print view</button>
        <button className="btn-primary btn-lg" onClick={complete} disabled={working || (tier?.remaining ?? 0) <= 0}>
          {working ? 'Completing…' : (tier?.remaining ?? 0) <= 0 ? 'No generations left' : 'Mark complete & use 1 generation'}
        </button>
      </div>
      <p className="dash-muted" style={{ marginTop: 8, fontSize: 12 }}>
        Marking complete uses 1 of your {tier?.uses} generations. The resume is saved and you can re-download it any time.
      </p>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, required, multiline, rows, disabled }) {
  return (
    <label className="field-label">
      {label}
      {multiline ? (
        <textarea
          className="dash-input"
          rows={rows || 3}
          value={value || ''}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="dash-input"
          type={type}
          value={value || ''}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  )
}

// Build a printable HTML view of the resume for the "Open print view"
// button. The user can pick "Save as PDF" in their browser's print dialog.
function buildHtmlPrint(r) {
  const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const c = r.contact || {}
  const loc = [c.location?.city, c.location?.region, c.location?.country].filter(Boolean).join(', ')
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(r.title || 'Resume')}</title>
<style>
@page { margin: 16mm; }
* { box-sizing: border-box; }
body { font-family: -apple-system, "Segoe UI", Roboto, sans-serif; color: #0f172a; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 24px; }
h1 { font-size: 28px; margin: 0; }
.hdr { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; }
.hdr p { margin: 4px 0; color: #475569; font-size: 13px; }
h2 { font-size: 16px; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin: 20px 0 10px; }
.role, .edu { margin-bottom: 12px; page-break-inside: avoid; }
.role h3, .edu h3 { margin: 0; font-size: 14px; }
.role .meta, .edu .meta { color: #64748b; font-size: 12px; margin: 2px 0 6px; }
ul { margin: 4px 0 0 18px; padding: 0; }
li { font-size: 13px; margin-bottom: 3px; page-break-inside: avoid; }
.skills { display: flex; flex-wrap: wrap; gap: 6px; }
.skill { background: #f1f5f9; padding: 3px 10px; border-radius: 999px; font-size: 12px; }
</style></head><body>
<div class="hdr">
  <h1>${esc(c.fullName || 'Your Name')}</h1>
  <p>${[c.email, c.phone, loc, c.linkedin, c.portfolio].filter(Boolean).map(esc).join(' · ')}</p>
</div>
${r.summary?.text ? `<h2>Summary</h2><p>${esc(r.summary.text)}</p>` : ''}
${(r.work || []).length ? `<h2>Experience</h2>${(r.work || []).map((w) => `
  <div class="role">
    <h3>${esc(w.role)} · ${esc(w.company)}</h3>
    <div class="meta">${esc([w.location, w.startDate, w.current ? 'Present' : w.endDate].filter(Boolean).join(' · '))}</div>
    <ul>${(w.bullets || []).map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  </div>`).join('')}` : ''}
${(r.education || []).length ? `<h2>Education</h2>${(r.education || []).map((e) => `
  <div class="edu">
    <h3>${esc(e.school)}</h3>
    <div class="meta">${esc([e.degree, e.field, e.graduationDate, e.gpa ? 'GPA ' + e.gpa : ''].filter(Boolean).join(' · '))}</div>
  </div>`).join('')}` : ''}
${(r.skills || []).length ? `<h2>Skills</h2><div class="skills">${(r.skills || []).map((s) => `<span class="skill">${esc(s.name)}${s.level && s.level !== 'basic' ? ' · ' + esc(s.level) : ''}</span>`).join('')}</div>` : ''}
${(r.custom || []).map((cs) => `<h2>${esc(cs.label)}</h2><p>${esc(cs.body)}</p>`).join('')}
</body></html>`
}
