import { useState } from 'react'
import { ArrowRightIcon, CheckIcon, MapPinIcon } from '../components/Icons'
import { careersData, IMG } from '../data'
import AnimateOnScroll from '../components/ui/AnimateOnScroll'
import TiltCard from '../components/ui/TiltCard'

export default function CareersPage({ onBack, user, onGoDash, onSignOut, onViewAbout }) {
  const [selected, setSelected] = useState(null)

  if (selected) {
    const job = careersData.find(x => x.id === selected)
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
            <ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} /> Back to all positions
          </button>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="showcase-tag">{job.department}</span>
                  <h1 className="text-3xl font-bold mt-3">{job.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-text-muted mt-2">
                    <span className="flex items-center gap-1"><MapPinIcon size={14} /> {job.location}</span>
                    <span>{job.type}</span>
                    <span>{job.salary}</span>
                  </div>
                </div>
              </div>
              <p className="text-text-muted leading-relaxed mb-6">{job.fullDesc}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Requirements</h3>
                <ul className="space-y-3">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-muted">
                      <CheckIcon size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Nice to Have</h3>
                <ul className="space-y-3">
                  {job.niceToHave.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-muted">
                      <CheckIcon size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
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
          <span className="eyebrow">CAREERS</span>
          <h2>Join Our Team</h2>
          <p>We are always looking for talented individuals to join our growing team.</p>
        </div>
        <div className="showcase-grid">
          {careersData.map((job) => (
            <article key={job.id} className="showcase-card cursor-pointer" onClick={() => setSelected(job.id)}>
              <div className="showcase-body">
                <span className="showcase-tag">{job.department}</span>
                <h3>{job.title}</h3>
                <p>{job.desc}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-text-muted">
                  <span className="flex items-center gap-1"><MapPinIcon size={14} /> {job.location}</span>
                  <span>{job.type}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
