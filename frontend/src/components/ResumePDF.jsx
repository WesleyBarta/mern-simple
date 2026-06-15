// Live preview renderer for the resume. Renders an HTML/CSS representation
// of the current resume using one of three template styles. NOT a PDF
// generator — the actual PDF export uses the browser's print dialog
// (File → Print → Save as PDF) from a clean HTML page built on download.

import { BriefcaseIcon, GraduationIcon, KeyIcon, CheckIcon } from './Icons'

// Template definitions with proper styling
const TEMPLATES = {
  minimalist: { 
    name: 'Minimalist',
    color: '#0f172a', 
    line: '#2563eb', 
    pill: '#f1f5f9', 
    pillText: '#334155',
    tier: 'free'
  },
  executive:  { 
    name: 'Executive',
    color: '#1e3a8a', 
    line: '#0f172a', 
    pill: '#1e3a8a', 
    pillText: '#ffffff',
    tier: 'free'
  },
  creative:   { 
    name: 'Creative',
    color: '#0f172a', 
    line: '#8b5cf6', 
    pill: '#f5f3ff', 
    pillText: '#6d28d9',
    tier: 'free'
  },
  modern: {
    name: 'Modern',
    color: '#1f2937',
    line: '#059669',
    pill: '#d1fae5',
    pillText: '#047857',
    tier: 'premium'
  },
  professional: {
    name: 'Professional',
    color: '#111827',
    line: '#dc2626',
    pill: '#fee2e2',
    pillText: '#991b1b',
    tier: 'premium'
  },
  dark: {
    name: 'Dark Mode',
    color: '#1e293b',
    line: '#f59e0b',
    pill: '#fef3c7',
    pillText: '#b45309',
    tier: 'premium'
  },
  elegant: {
    name: 'Elegant',
    color: '#2d3748',
    line: '#9333ea',
    pill: '#f3e8ff',
    pillText: '#6b21a8',
    tier: 'pro'
  },
  startup: {
    name: 'Startup',
    color: '#0f172a',
    line: '#3b82f6',
    pill: '#dbeafe',
    pillText: '#1e40af',
    tier: 'pro'
  },
  tech: {
    name: 'Tech',
    color: '#164e63',
    line: '#06b6d4',
    pill: '#cffafe',
    pillText: '#0e7490',
    tier: 'pro'
  },
  minimal_dark: {
    name: 'Minimal Dark',
    color: '#000000',
    line: '#666666',
    pill: '#f0f0f0',
    pillText: '#333333',
    tier: 'pro'
  },
  corporate: {
    name: 'Corporate',
    color: '#1e3a5f',
    line: '#2563eb',
    pill: '#e0e7ff',
    pillText: '#3730a3',
    tier: 'pro'
  },
  // 50 Premium Templates (showing examples, expandable)
  vibrant: {
    name: 'Vibrant',
    color: '#7c3aed',
    line: '#ec4899',
    pill: '#fce7f3',
    pillText: '#ec4899',
    tier: 'pro50'
  },
  ocean: {
    name: 'Ocean',
    color: '#0369a1',
    line: '#06b6d4',
    pill: '#cffafe',
    pillText: '#0e7490',
    tier: 'pro50'
  },
  forest: {
    name: 'Forest',
    color: '#15803d',
    line: '#65a30d',
    pill: '#dcfce7',
    pillText: '#3f6212',
    tier: 'pro50'
  },
  sunset: {
    name: 'Sunset',
    color: '#ea580c',
    line: '#f97316',
    pill: '#ffedd5',
    pillText: '#b45309',
    tier: 'pro50'
  },
  midnight: {
    name: 'Midnight',
    color: '#0f172a',
    line: '#6366f1',
    pill: '#e0e7ff',
    pillText: '#4f46e5',
    tier: 'pro50'
  },
}

// Helper function to get available templates based on subscription tier
export const getAvailableTemplates = (userTier = 'free') => {
  const tierMap = {
    free: ['minimalist', 'executive', 'creative'],
    premium: ['minimalist', 'executive', 'creative', 'modern', 'professional', 'dark'],
    pro: ['minimalist', 'executive', 'creative', 'modern', 'professional', 'dark', 'elegant', 'startup', 'tech', 'minimal_dark', 'corporate'],
    pro50: Object.keys(TEMPLATES),
  }
  
  return (tierMap[userTier] || tierMap.free).map(key => ({
    id: key,
    ...TEMPLATES[key]
  }))
}

// Validate and extract all resume data
const extractResumeData = (resume) => {
  return {
    contact: resume?.contact || {},
    summary: resume?.summary || {},
    work: Array.isArray(resume?.work) ? resume.work : [],
    education: Array.isArray(resume?.education) ? resume.education : [],
    skills: Array.isArray(resume?.skills) ? resume.skills : [],
    custom: Array.isArray(resume?.custom) ? resume.custom : [],
  }
}

export default function ResumePDF({ resume = {}, template = 'minimalist', userTier = 'free' }) {
  // Extract all data properly
  const data = extractResumeData(resume)
  const c = data.contact
  const loc = [c.location?.city, c.location?.region, c.location?.country]
    .filter(Boolean)
    .join(', ')
  
  // Get template with fallback
  const templateData = TEMPLATES[template] || TEMPLATES.minimalist
  const accent = {
    color: templateData.color,
    line: templateData.line,
    pill: templateData.pill,
    pillText: templateData.pillText,
  }

  // Render based on template
  const templates = {
    executive: Executive,
    creative: Creative,
    modern: Modern,
    professional: Professional,
    dark: Dark,
    elegant: Elegant,
    startup: Startup,
    tech: Tech,
    minimal_dark: MinimalDark,
    corporate: Corporate,
    vibrant: Vibrant,
    ocean: Ocean,
    forest: Forest,
    sunset: Sunset,
    midnight: Midnight,
  }

  const TemplateComponent = templates[template] || Minimalist

  return (
    <TemplateComponent 
      resume={data} 
      accent={accent} 
      c={c} 
      loc={loc}
      templateName={templateData.name}
    />
  )
}

// Base template components
function Minimalist({ resume, accent, c, loc, templateName }) {
  return (
    <div 
      className="rpdf rpdf-minimalist" 
      style={{ 
        '--rpdf-accent': accent.color, 
        '--rpdf-line': accent.line,
        '--rpdf-pill': accent.pill,
        '--rpdf-pill-text': accent.pillText
      }}
    >
      <div className="rpdf-hdr">
        <h1>{c.fullName || 'Your Name'}</h1>
        <p>{[c.email, c.phone, loc].filter(Boolean).join(' · ') || 'you@email.com'}</p>
        <p>{[c.linkedin, c.portfolio].filter(Boolean).join(' · ')}</p>
      </div>

      {resume.summary?.text && <Section title="Summary"><p>{resume.summary.text}</p></Section>}

      {resume.work.length > 0 && (
        <Section title="Experience">
          {resume.work.map((w, i) => (
            <WorkBlock key={w.id || i} work={w} />
          ))}
        </Section>
      )}

      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((e, i) => (
            <EducationBlock key={e.id || i} education={e} />
          ))}
        </Section>
      )}

      {resume.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}

      {resume.custom.length > 0 && resume.custom.map((cs, i) => (
        <Section key={cs.id || i} title={cs.label || 'Custom'}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{cs.body}</p>
        </Section>
      ))}

      {isEmpty(resume, c, loc) && <EmptyHint />}
    </div>
  )
}

function Executive({ resume, accent, c, loc, templateName }) {
  return (
    <div 
      className="rpdf rpdf-executive" 
      style={{ 
        '--rpdf-accent': accent.color, 
        '--rpdf-line': accent.line,
        '--rpdf-pill': accent.pill,
        '--rpdf-pill-text': accent.pillText
      }}
    >
      <div className="rpdf-hdr">
        <h1>{c.fullName || 'Your Name'}</h1>
        <p>{[c.email, c.phone].filter(Boolean).join(' · ') || 'you@email.com'}</p>
        <p>{[loc, c.linkedin, c.portfolio].filter(Boolean).join(' · ')}</p>
      </div>
      <div className="rpdf-exec-grid">
        <div className="rpdf-exec-main">
          {resume.summary?.text && <Section title="Profile"><p>{resume.summary.text}</p></Section>}
          {resume.work.length > 0 && (
            <Section title="Experience">
              {resume.work.map((w, i) => (
                <WorkBlock key={w.id || i} work={w} />
              ))}
            </Section>
          )}
          {resume.education.length > 0 && (
            <Section title="Education">
              {resume.education.map((e, i) => (
                <EducationBlock key={e.id || i} education={e} />
              ))}
            </Section>
          )}
          {resume.custom.length > 0 && resume.custom.map((cs, i) => (
            <Section key={cs.id || i} title={cs.label || 'Custom'}>
              <p style={{ whiteSpace: 'pre-wrap' }}>{cs.body}</p>
            </Section>
          ))}
        </div>
        <aside className="rpdf-exec-side">
          {resume.skills.length > 0 && (
            <Section title="Skills">
              <SkillsGrid skills={resume.skills} accent={accent} dark={true} />
            </Section>
          )}
        </aside>
      </div>
      {isEmpty(resume, c, loc) && <EmptyHint />}
    </div>
  )
}

function Creative({ resume, accent, c, loc, templateName }) {
  return (
    <div 
      className="rpdf rpdf-creative" 
      style={{ 
        '--rpdf-accent': accent.color, 
        '--rpdf-line': accent.line,
        '--rpdf-pill': accent.pill,
        '--rpdf-pill-text': accent.pillText
      }}
    >
      <div className="rpdf-creative-hdr">
        <div>
          <h1>{c.fullName || 'Your Name'}</h1>
          <p>{[c.email, c.phone, loc].filter(Boolean).join(' · ') || 'you@email.com'}</p>
        </div>
        <div className="rpdf-creative-circle">
          {(c.fullName || 'YN').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
        </div>
      </div>
      {resume.summary?.text && <Section title="About"><p>{resume.summary.text}</p></Section>}
      {resume.work.length > 0 && (
        <Section title="Experience">
          {resume.work.map((w, i) => (
            <WorkBlock key={w.id || i} work={w} />
          ))}
        </Section>
      )}
      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((e, i) => (
            <EducationBlock key={e.id || i} education={e} />
          ))}
        </Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}
      {resume.custom.length > 0 && resume.custom.map((cs, i) => (
        <Section key={cs.id || i} title={cs.label || 'Custom'}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{cs.body}</p>
        </Section>
      ))}
      {isEmpty(resume, c, loc) && <EmptyHint />}
    </div>
  )
}

// Additional template variants
function Modern({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-modern" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-hdr rpdf-hdr-modern">
        <div>
          <h1>{c.fullName || 'Your Name'}</h1>
          <p className="rpdf-title">{resume.summary?.title || 'Professional'}</p>
        </div>
        <div className="rpdf-contact-badge">
          {[c.email, c.phone].filter(Boolean).join(' · ')}
        </div>
      </div>
      {resume.summary?.text && <Section title="About"><p>{resume.summary.text}</p></Section>}
      {resume.work.length > 0 && (
        <Section title="Experience">
          {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
        </Section>
      )}
      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((e, i) => (<EducationBlock key={e.id || i} education={e} />))}
        </Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}
    </div>
  )
}

function Professional({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-professional" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-sidebar">
        <div className="rpdf-hdr-side">
          <h1>{c.fullName || 'Your Name'}</h1>
          <p>{loc}</p>
        </div>
        {resume.skills.length > 0 && (
          <Section title="Skills">
            <SkillsGrid skills={resume.skills} accent={accent} vertical={true} />
          </Section>
        )}
      </div>
      <div className="rpdf-main">
        <p>{[c.email, c.phone, c.linkedin].filter(Boolean).join(' · ')}</p>
        {resume.summary?.text && <Section title="Summary"><p>{resume.summary.text}</p></Section>}
        {resume.work.length > 0 && (
          <Section title="Experience">
            {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
          </Section>
        )}
        {resume.education.length > 0 && (
          <Section title="Education">
            {resume.education.map((e, i) => (<EducationBlock key={e.id || i} education={e} />))}
          </Section>
        )}
      </div>
    </div>
  )
}

function Dark({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-dark" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-hdr rpdf-hdr-dark">
        <h1>{c.fullName || 'Your Name'}</h1>
        <p>{[c.email, c.phone, loc].filter(Boolean).join(' · ')}</p>
      </div>
      {resume.summary?.text && <Section title="Summary"><p>{resume.summary.text}</p></Section>}
      {resume.work.length > 0 && (
        <Section title="Experience">
          {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
        </Section>
      )}
      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((e, i) => (<EducationBlock key={e.id || i} education={e} />))}
        </Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}
    </div>
  )
}

function Elegant({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-elegant" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-hdr-elegant">
        <h1>{c.fullName || 'Your Name'}</h1>
        <div className="rpdf-divider"></div>
        <p>{[c.email, c.phone, loc].filter(Boolean).join(' · ')}</p>
      </div>
      {resume.summary?.text && <Section title="About"><p>{resume.summary.text}</p></Section>}
      {resume.work.length > 0 && (
        <Section title="Experience">
          {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
        </Section>
      )}
      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((e, i) => (<EducationBlock key={e.id || i} education={e} />))}
        </Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}
    </div>
  )
}

function Startup({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-startup" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-hdr-startup">
        <h1>{c.fullName || 'Your Name'}</h1>
        <p>{resume.summary?.text || 'Creative professional'}</p>
      </div>
      {resume.work.length > 0 && (
        <Section title="Experience">
          {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
        </Section>
      )}
      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((e, i) => (<EducationBlock key={e.id || i} education={e} />))}
        </Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}
    </div>
  )
}

function Tech({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-tech" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-hdr-tech">
        <h1>{'< '}{c.fullName || 'Your Name'}{'>'}</h1>
        <p>{[c.email, c.phone].filter(Boolean).join(' | ')}</p>
      </div>
      {resume.summary?.text && <Section title="// About"><p>{resume.summary.text}</p></Section>}
      {resume.work.length > 0 && (
        <Section title="// Experience">
          {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
        </Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="// Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}
    </div>
  )
}

function MinimalDark({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-minimal-dark" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-hdr">
        <h1>{c.fullName || 'Your Name'}</h1>
        <p>{[c.email, c.phone, loc].filter(Boolean).join(' · ')}</p>
      </div>
      {resume.work.length > 0 && (
        <Section title="Experience">
          {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
        </Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}
    </div>
  )
}

function Corporate({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-corporate" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-hdr-corporate">
        <h1>{c.fullName || 'Your Name'}</h1>
        <p className="rpdf-location">{loc}</p>
        <div className="rpdf-contact-info">
          {[c.email, c.phone, c.linkedin].filter(Boolean).join(' · ')}
        </div>
      </div>
      {resume.work.length > 0 && (
        <Section title="Professional Experience">
          {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
        </Section>
      )}
      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((e, i) => (<EducationBlock key={e.id || i} education={e} />))}
        </Section>
      )}
    </div>
  )
}

function Vibrant({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-vibrant" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-hdr-vibrant">
        <h1>{c.fullName || 'Your Name'}</h1>
        <p>{[c.email, c.phone, loc].filter(Boolean).join(' · ')}</p>
      </div>
      {resume.summary?.text && <Section title="About"><p>{resume.summary.text}</p></Section>}
      {resume.work.length > 0 && (
        <Section title="Experience">
          {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
        </Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}
    </div>
  )
}

function Ocean({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-ocean" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-hdr-ocean">
        <h1>{c.fullName || 'Your Name'}</h1>
        <p>{[c.email, c.phone, loc].filter(Boolean).join(' · ')}</p>
      </div>
      {resume.summary?.text && <Section title="Profile"><p>{resume.summary.text}</p></Section>}
      {resume.work.length > 0 && (
        <Section title="Experience">
          {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
        </Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}
    </div>
  )
}

function Forest({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-forest" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-hdr-forest">
        <h1>{c.fullName || 'Your Name'}</h1>
        <p>{[c.email, c.phone, loc].filter(Boolean).join(' · ')}</p>
      </div>
      {resume.work.length > 0 && (
        <Section title="Experience">
          {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
        </Section>
      )}
      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((e, i) => (<EducationBlock key={e.id || i} education={e} />))}
        </Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}
    </div>
  )
}

function Sunset({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-sunset" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-hdr-sunset">
        <h1>{c.fullName || 'Your Name'}</h1>
        <p>{[c.email, c.phone, loc].filter(Boolean).join(' · ')}</p>
      </div>
      {resume.summary?.text && <Section title="About"><p>{resume.summary.text}</p></Section>}
      {resume.work.length > 0 && (
        <Section title="Experience">
          {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
        </Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}
    </div>
  )
}

function Midnight({ resume, accent, c, loc, templateName }) {
  return (
    <div className="rpdf rpdf-midnight" style={{ '--rpdf-accent': accent.color, '--rpdf-line': accent.line }}>
      <div className="rpdf-hdr-midnight">
        <h1>{c.fullName || 'Your Name'}</h1>
        <p>{[c.email, c.phone, loc].filter(Boolean).join(' · ')}</p>
      </div>
      {resume.summary?.text && <Section title="Summary"><p>{resume.summary.text}</p></Section>}
      {resume.work.length > 0 && (
        <Section title="Experience">
          {resume.work.map((w, i) => (<WorkBlock key={w.id || i} work={w} />))}
        </Section>
      )}
      {resume.education.length > 0 && (
        <Section title="Education">
          {resume.education.map((e, i) => (<EducationBlock key={e.id || i} education={e} />))}
        </Section>
      )}
      {resume.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid skills={resume.skills} accent={accent} />
        </Section>
      )}
    </div>
  )
}

// Reusable components
function Section({ title, children }) {
  return (
    <div className="rpdf-section">
      <h2>{title}</h2>
      {children}
    </div>
  )
}

function WorkBlock({ work }) {
  return (
    <div className="rpdf-block">
      <div className="rpdf-row">
        <strong>{work.role || 'Role'}</strong>
        <span>{[work.startDate, work.current ? 'Present' : work.endDate].filter(Boolean).join(' – ')}</span>
      </div>
      <div className="rpdf-row rpdf-meta">{work.company || 'Company'}{work.location ? ' · ' + work.location : ''}</div>
      {(work.bullets || []).length > 0 && (
        <ul>{(work.bullets || []).map((b, j) => <li key={j}>{b}</li>)}</ul>
      )}
    </div>
  )
}

function EducationBlock({ education }) {
  return (
    <div className="rpdf-block">
      <div className="rpdf-row">
        <strong>{education.school || 'School'}</strong>
        <span>{education.graduationDate}</span>
      </div>
      <div className="rpdf-meta">{[education.degree, education.field].filter(Boolean).join(', ')}</div>
    </div>
  )
}

function SkillsGrid({ skills, accent, dark = false, vertical = false }) {
  return (
    <div className={`rpdf-skills ${vertical ? 'rpdf-skills-vertical' : ''}`}>
      {skills.map((s, i) => (
        <span 
          key={s.id || i} 
          className={`rpdf-pill ${dark ? 'rpdf-pill-dark' : ''}`}
          style={{
            backgroundColor: accent.pill,
            color: accent.pillText,
          }}
        >
          {s.name}{s.level && s.level !== 'basic' ? ' · ' + s.level : ''}
        </span>
      ))}
    </div>
  )
}

function isEmpty(resume, c, loc) {
  return (
    !c.fullName && 
    !resume.summary?.text && 
    resume.work.length === 0 && 
    resume.education.length === 0 && 
    resume.skills.length === 0
  )
}

function EmptyHint() {
  return (
    <div className="rpdf-empty">
      <p>Your resume preview will appear here as you fill in the steps.</p>
    </div>
  )
}
