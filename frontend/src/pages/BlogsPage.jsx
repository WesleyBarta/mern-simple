import { useState } from 'react'
import { ArrowRightIcon, CoffeeIcon } from '../components/Icons'
import { blogsData, IMG } from '../data'
import AnimateOnScroll from '../components/ui/AnimateOnScroll'
import TiltCard from '../components/ui/TiltCard'

export default function BlogsPage({ onBack, user, onGoDash, onSignOut, onViewAbout }) {
  const [selected, setSelected] = useState(null)

  if (selected) {
    const blog = blogsData.find(x => x.id === selected)
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
            <ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} /> Back to all blogs
          </button>
          <article className="max-w-3xl mx-auto">
            <div className="mb-8">
              <img src={blog.image} alt={blog.title} className="rounded-2xl w-full h-80 object-cover" />
            </div>
            <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
              <span className="flex items-center gap-1"><CoffeeIcon size={14} /> {blog.author}</span>
              <span>{blog.date}</span>
              <span>{blog.readTime} min read</span>
            </div>
            <span className="showcase-tag">{blog.tag}</span>
            <h1 className="text-3xl font-bold mt-3 mb-6">{blog.title}</h1>
            <div className="prose prose-lg text-text-muted">
              {blog.content.split('\n\n').map((para, i) => (
                <p key={i} className="mb-4 leading-relaxed">{para}</p>
              ))}
            </div>
          </article>
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
          <span className="eyebrow">BLOGS</span>
          <h2>All Blogs</h2>
          <p>Insights, tutorials, and news from the PivotalStacks team.</p>
        </div>
        <div className="showcase-grid">
          {blogsData.map((blog) => (
            <article key={blog.id} className="showcase-card cursor-pointer" onClick={() => setSelected(blog.id)}>
              <div className="showcase-image">
                <img src={blog.image} alt={blog.title} />
              </div>
              <div className="showcase-body">
                <span className="showcase-tag">{blog.tag}</span>
                <h3>{blog.title}</h3>
                <p>{blog.desc}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-text-muted">
                  <span>{blog.author}</span>
                  <span>{blog.date}</span>
                  <span>{blog.readTime} min read</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
