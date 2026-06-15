import { useState } from 'react'
import { CheckIcon, ArrowRightIcon } from '../components/Icons'
import { projectsData, IMG } from '../data'
import AnimateOnScroll from '../components/ui/AnimateOnScroll'
import TiltCard from '../components/ui/TiltCard'

export default function ProjectsPage({ onBack, user, onGoDash, onSignOut, onViewAbout }) {
  const [selected, setSelected] = useState(null)

  if (selected) {
    const p = projectsData.find(x => x.id === selected)
    return (
      <div className="min-h-screen bg-alt">
        <header className="header header-image">
          <div className="header-inner">
            <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
                <rect x="1" y="1" width="32" height="32" rx="7" fill="#0f172a" />
                <path d="M9 9H16L22 20H15L9 9Z" fill="#8DC63F" />
                <path d="M22 9H25V25H22V9Z" fill="#ffffff" />
                <rect x="9" y="26" width="16" height="2" rx="1" fill="#8DC63F" opacity="0.6" />
              </svg>
              <span>PIVOTALSTACKS</span>
            </div>
            <nav className="nav">
              <a href="#hero">Home</a>
              <button onClick={onViewAbout}>About</button>
              <a href="#projects">Projects</a>
              <a href="#casestudies">Case Studies</a>
              <a href="#blogs">Blogs</a>
              <a href="#careers">Careers</a>
              <a href="#services">Services</a>
              <a href="#team">Team</a>
              <a href="#contact">Contact</a>
            </nav>
            <div className="header-cta">
              {user ? (
                <>
                  <button className="header-link" onClick={onGoDash}>Dashboard</button>
                  <button className="btn-login" onClick={onSignOut}>Sign out</button>
                </>
              ) : (
                <button className="btn-login" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Get in Touch</button>
              )}
            </div>
          </div>
        </header>
        <main className="container py-16">
          <button onClick={() => setSelected(null)} className="inline-flex items-center gap-2 text-primary mb-8 hover:underline">
            <ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} /> Back to all projects
          </button>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <img src={p.image} alt={p.title} className="rounded-2xl w-full h-80 object-cover" />
            </div>
            <div>
              <span className="showcase-tag">{p.tag}</span>
              <h1 className="text-3xl font-bold mt-3 mb-2">{p.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-6">
                <span><strong>Client:</strong> {p.client}</span>
                <span><strong>Year:</strong> {p.year}</span>
              </div>
              <p className="text-text-muted leading-relaxed mb-6">{p.fullDesc}</p>
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map(t => <span key={t} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">{t}</span>)}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Results</h3>
                <div className="flex flex-wrap gap-3">
                  {p.results.map(r => (
                    <span key={r} className="flex items-center gap-2 bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm">
                      <CheckIcon size={14} /> {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-alt">
      <header className="header header-image">
        <div className="header-inner">
          <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
              <rect x="1" y="1" width="32" height="32" rx="7" fill="#0f172a" />
              <path d="M9 9H16L22 20H15L9 9Z" fill="#8DC63F" />
              <path d="M22 9H25V25H22V9Z" fill="#ffffff" />
              <rect x="9" y="26" width="16" height="2" rx="1" fill="#8DC63F" opacity="0.6" />
            </svg>
            <span>PIVOTALSTACKS</span>
          </div>
          <nav className="nav">
            <a href="#hero">Home</a>
            <button onClick={onViewAbout}>About</button>
            <a href="#projects">Projects</a>
            <a href="#casestudies">Case Studies</a>
            <a href="#blogs">Blogs</a>
            <a href="#careers">Careers</a>
            <a href="#services">Services</a>
            <a href="#team">Team</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="header-cta">
            {user ? (
              <>
                <button className="header-link" onClick={onGoDash}>Dashboard</button>
                <button className="btn-login" onClick={onSignOut}>Sign out</button>
              </>
            ) : (
              <button className="btn-login" onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>Get in Touch</button>
            )}
          </div>
        </div>
      </header>
      <main className="container py-16">
        <div className="section-head mb-12">
          <span className="eyebrow">PROJECTS</span>
          <h2>All Projects</h2>
          <p>Explore our portfolio of work across industries and technologies.</p>
        </div>
        <div className="showcase-grid">
          {projectsData.map((p) => (
            <article key={p.id} className="showcase-card cursor-pointer" onClick={() => setSelected(p.id)}>
              <div className="showcase-image">
                <img src={p.image} alt={p.title} />
              </div>
              <div className="showcase-body">
                <span className="showcase-tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
