import { useState } from 'react'
import { CheckIcon, ArrowRightIcon } from '../components/Icons'
import { caseStudiesData, IMG } from '../data'
import AnimateOnScroll from '../components/ui/AnimateOnScroll'
import TiltCard from '../components/ui/TiltCard'

export default function CaseStudiesPage({ onBack, user, onGoDash, onSignOut, onViewAbout }) {
  const [selected, setSelected] = useState(null)

  if (selected) {
    const cs = caseStudiesData.find(x => x.id === selected)
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
            <ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} /> Back to all case studies
          </button>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <img src={cs.image} alt={cs.title} className="rounded-2xl w-full h-80 object-cover" />
            </div>
            <div>
              <span className="showcase-tag">{cs.tag}</span>
              <h1 className="text-3xl font-bold mt-3 mb-2">{cs.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-6">
                <span><strong>Client:</strong> {cs.client}</span>
                <span><strong>Year:</strong> {cs.year}</span>
              </div>
              <p className="text-text-muted leading-relaxed mb-6">{cs.fullDesc}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Challenge</h3>
              <p className="text-text-muted">{cs.challenge}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Solution</h3>
              <p className="text-text-muted">{cs.solution}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Outcome</h3>
              <p className="text-text-muted">{cs.outcome}</p>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Key Results</h3>
            <div className="flex flex-wrap gap-3">
              {cs.results.map(r => (
                <span key={r} className="flex items-center gap-2 bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm">
                  <CheckIcon size={14} /> {r}
                </span>
              ))}
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
          <span className="eyebrow">CASE STUDIES</span>
          <h2>All Case Studies</h2>
          <p>Real-world examples of how we have helped clients achieve their goals.</p>
        </div>
        <div className="showcase-grid">
          {caseStudiesData.map((cs) => (
            <article key={cs.id} className="showcase-card cursor-pointer" onClick={() => setSelected(cs.id)}>
              <div className="showcase-image">
                <img src={cs.image} alt={cs.title} />
              </div>
              <div className="showcase-body">
                <span className="showcase-tag">{cs.tag}</span>
                <h3>{cs.title}</h3>
                <p>{cs.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cs.tech.slice(0, 3).map((t) => (
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
