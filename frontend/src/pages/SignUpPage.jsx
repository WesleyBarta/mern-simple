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

export default function SignUpPage({ onBack, onSwitch, onAuthed, onTerms, onPrivacy }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!firstName || !lastName || !email || !password) {
      setError('All fields are required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (!agree) {
      setError('Please agree to the Terms and Privacy Policy to continue.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          password,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Sign up failed.')
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
          <h1 className="auth-title">Sign up</h1>

          {error && <div className="auth-error">{error}</div>}

          <SocialButtons onSocial={() => alert('Social login wires in Phase 2.')} />

          <OrDivider />

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="field-row">
              <label className="field-label">
                First Name
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  autoFocus
                  required
                />
              </label>
              <label className="field-label">
                Last Name
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
              </label>
            </div>
            <label className="field-label">
              Work email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
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
                  placeholder="At least 6 characters"
                  minLength={6}
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
            <label className="check auth-check">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                required
              />
              <span>
                I agree to the Pivotal Stack{' '}
                <button type="button" onClick={onTerms} className="text-primary hover:underline">User Agreement</button> and{' '}
                <button type="button" onClick={onPrivacy} className="text-primary hover:underline">Privacy Policy</button>.
              </span>
            </label>
            <button
              type="submit"
              className="btn-primary btn-block btn-lg"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Join Pivotal Stack'}
            </button>
          </form>

          <p className="switch">
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitch('signin') }}>Log in</a>
          </p>
        </div>
      </main>
    </div>
  )
}
