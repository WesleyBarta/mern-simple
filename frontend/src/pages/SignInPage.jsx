import { useState } from 'react'
import {
  BriefcaseIcon, CodeIcon, CloudIcon, CogIcon,
  CheckIcon, ArrowRightIcon, StarIcon,
  GlobeIcon, ShieldIcon, ZapIcon, UsersIcon,
  BuildingIcon, AwardIcon, RocketIcon, HeartIcon,
  MapPinIcon, CoffeeIcon,
} from '../components/Icons'
import GoogleIcon from '../components/icons/GoogleIcon'
import FacebookIcon from '../components/icons/FacebookIcon'
import EyeIcon from '../components/icons/EyeIcon'
import EyeOffIcon from '../components/icons/EyeOffIcon'
import AnimateOnScroll from '../components/ui/AnimateOnScroll'
import TiltCard from '../components/ui/TiltCard'
import BackToTop from '../components/ui/BackToTop'
import ChatBot from '../components/ChatBot'
import { IMG } from '../data/index'

function Logo({ light = false, onClick }) {
  return (
    <div className={'logo' + (light ? ' logo-light' : '')} onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
        <rect x="1" y="1" width="32" height="32" rx="7" fill="#0f172a" />
        <path d="M9 9H16L22 20H15L9 9Z" fill="#8DC63F" />
        <path d="M22 9H25V25H22V9Z" fill="#ffffff" />
        <rect x="9" y="26" width="16" height="2" rx="1" fill="#8DC63F" opacity="0.6" />
      </svg>
      <span>PIVOTALSTACKS</span>
    </div>
  )
}

function Header({ user, onGoDash, onSignOut, onViewAbout }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '#hero', label: 'Home' },
    { label: 'About', action: onViewAbout },
    { href: '#projects', label: 'Projects' },
    { href: '#casestudies', label: 'Case Studies' },
    { href: '#blogs', label: 'Blogs' },
    { href: '#careers', label: 'Careers' },
    { href: '#services', label: 'Services' },
    { href: '#team', label: 'Team' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <header className={`header${scrolled ? ' scrolled' : ' header-image'}`}>
      <div className="header-inner">
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        <nav className="nav">
          {navLinks.map((n) => (
            n.href ? <a key={n.href} href={n.href}>{n.label}</a> : <button key={n.label} onClick={() => { n.action && n.action() }} className="nav-btn">{n.label}</button>
          ))}
        </nav>
        <div className="header-cta">
          {user ? (
            <>
              <button className="header-link" onClick={onGoDash}>Dashboard</button>
              <button className="btn-login" onClick={onSignOut}>Sign out</button>
            </>
          ) : (
            <button className="btn-login" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Get in Touch</button>
          )}
        </div>
        <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span className={mobileOpen ? 'ham-line open' : 'ham-line'} />
          <span className={mobileOpen ? 'ham-line open' : 'ham-line'} />
          <span className={mobileOpen ? 'ham-line open' : 'ham-line'} />
        </button>
      </div>
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        {navLinks.map((n) => (
          n.href ? <a key={n.href} href={n.href} className="mobile-nav-link">{n.label}</a> : <button key={n.label} onClick={() => { n.action && n.action() }} className="mobile-nav-link">{n.label}</button>
        ))}
        {!user && (
          <button className="btn-login w-full mt-4" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Get in Touch</button>
        )}
      </div>
    </header>
  )
}

function SocialButtons({ onSocial }) {
  return (
    <div className="auth-social">
      <button type="button" className="auth-social-btn" onClick={() => onSocial?.('google')}>
        <GoogleIcon size={18} /> Continue with Google
      </button>
      <button type="button" className="auth-social-btn" onClick={() => onSocial?.('facebook')}>
        <FacebookIcon size={18} /> Continue with Facebook
      </button>
    </div>
  )
}

function OrDivider() {
  return (
    <div className="auth-or">
      <span>OR</span>
    </div>
  )
}

function AuthSidesContent({ onBack }) {
  return (
    <>
      <a href="#" className="auth-side-back" onClick={(e) => { e.preventDefault(); onBack?.() }}>
        <ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} /> Back to Pivotal Stack
      </a>

      <div className="auth-side-banner">
        <div className="auth-side-banner-badge">
          <span className="auth-side-banner-pulse" /> Available for new projects
        </div>
        <h2>Let's build<br />something great.</h2>
        <p>Join Pivotal Stack to access our development resources, project management tools, and technical expertise.</p>
        <ul>
          <li><CheckIcon size={16} /> Custom software development</li>
          <li><CheckIcon size={16} /> Cloud architecture & DevOps</li>
          <li><CheckIcon size={16} /> AI & ML integration</li>
          <li><CheckIcon size={16} /> Ongoing support & maintenance</li>
        </ul>
      </div>

      <div className="auth-side-testimonial">
        <div className="auth-side-testimonial-stars">
          <StarIcon size={14} /><StarIcon size={14} /><StarIcon size={14} /><StarIcon size={14} /><StarIcon size={14} />
        </div>
        <p>"Pivotal Stack delivered our platform 3 weeks ahead of schedule. The code quality and communication were exceptional."</p>
        <div className="auth-side-testimonial-author">
          <img src={IMG.avatar1} alt="" className="auth-side-testimonial-avatar" />
          <div>
            <strong>Maya Reyes</strong>
            <span>CTO · TechScale Inc</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default function SignInPage({ onBack, onSwitch, onAuthed }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Sign in failed.')
        setLoading(false)
        return
      }
      onAuthed?.(data.user)
    } catch (err) {
      setError('Could not reach the server. Make sure the backend is running on port 5000.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-side">
        <AuthSidesContent onBack={onBack} />
      </aside>
      <main className="auth-main">
        <div className="auth-card auth-card-narrow">
          <h1 className="auth-title">Sign in</h1>

          {error && <div className="auth-error">{error}</div>}

          <SocialButtons onSocial={() => alert('Social login wires in Phase 2.')} />

          <OrDivider />

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field-label">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoFocus
                required
              />
            </label>
            <label className="field-label">
              Password
              <div className="field-with-icon">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="field-icon-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </label>
            <button type="button" className="link forgot-link" onClick={() => alert('Password reset coming soon. Please contact us at hello@pivotalstack.com')}>Forgot password?</button>
            <button
              type="submit"
              className="btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="switch">
            Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitch('signup') }}>Join Pivotal Stack</a>
          </p>
        </div>
      </main>
    </div>
  )
}
