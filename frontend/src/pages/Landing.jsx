import { useState, useEffect, useRef, useCallback } from 'react'
import {
  BriefcaseIcon, CodeIcon, CloudIcon, CogIcon,
  CheckIcon, ArrowRightIcon, StarIcon,
  GlobeIcon, ShieldIcon, ZapIcon, UsersIcon,
  BuildingIcon, AwardIcon, RocketIcon, HeartIcon,
  MapPinIcon, CoffeeIcon,
} from '../components/Icons'
import AnimateOnScroll from '../components/ui/AnimateOnScroll'
import TiltCard from '../components/ui/TiltCard'
import BackToTop from '../components/ui/BackToTop'
import ChatBot from '../components/ChatBot'
import {
  projectsData,
  caseStudiesData,
  blogsData,
  careersData,
  services,
  team,
  milestones,
  culture,
  offices,
  aboutValues,
  aboutStats,
  IMG,
  techStack,
} from '../data/index'

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMobileOpen(false)
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
        <Logo onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); close() }} />
        <nav className="nav">
          {navLinks.map((n) => (
            n.href ? <a key={n.href} href={n.href} onClick={close}>{n.label}</a> : <button key={n.label} onClick={() => { n.action && n.action(); close() }} className="nav-btn">{n.label}</button>
          ))}
        </nav>
        <div className="header-cta">
          {user ? (
            <>
              <button className="header-link" onClick={onGoDash}>Dashboard</button>
              <button className="btn-login" onClick={onSignOut}>Sign out</button>
            </>
          ) : (
            <button className="btn-login" onClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); close() }}>Get in Touch</button>
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
          n.href ? <a key={n.href} href={n.href} className="mobile-nav-link" onClick={close}>{n.label}</a> : <button key={n.label} onClick={() => { n.action && n.action(); close() }} className="mobile-nav-link">{n.label}</button>
        ))}
        {!user && (
          <button className="btn-login w-full mt-4" onClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); close() }}>Get in Touch</button>
        )}
      </div>
    </header>
  )
}

// Scroll Animation System
function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (options.once !== false) observer.unobserve(el)
        } else if (options.once === false) {
          setVisible(false)
        }
      },
      { threshold: options.threshold ?? 0.12, rootMargin: options.rootMargin ?? '0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.once])

  return [ref, visible]
}

function AnimatedOnScroll({ children, className = '', type = 'fade-up', delay = 0, style = {} }) {
  const [ref, visible] = useScrollReveal({ threshold: 0.1 })
  const classMap = {
    'fade-up': 'reveal',
    'fade-left': 'reveal-left',
    'fade-right': 'reveal-right',
    'scale': 'reveal-scale',
  }
  const cls = [classMap[type] || 'reveal', visible ? 'visible' : '', className].filter(Boolean).join(' ')
  const delayStyle = delay ? { transitionDelay: `${delay}ms`, ...style } : style
  return (
    <div ref={ref} className={cls} style={delayStyle}>
      {children}
    </div>
  )
}

// Animated counter hook
function useCounter(target, duration = 2000, visible = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!visible) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [visible, target, duration])
  return count
}

// =========================================================================
// Hero
// =========================================================================
function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const onScroll = () => {
      const scrolled = window.scrollY
      const bg = el.querySelector('.hero-parallax-bg')
      if (bg) bg.style.transform = `translateY(${scrolled * 0.35}px)`
      const content = el.querySelector('.hero-content')
      if (content) content.style.transform = `translateY(${scrolled * 0.15}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="hero"
      className="hero hero-image-bg"
      style={{ backgroundImage: `url(${IMG.hero})` }}
      ref={heroRef}
    >
      <div className="hero-image-overlay" aria-hidden />

      <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '20%', right: '10%', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(141,198,63,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '5%', width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div aria-hidden className="dot-grid" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />

      <div className="container hero-grid" style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-text hero-content">
          <div className="badge glow-pulse" style={{ animation: 'fadeInUp 0.6s ease both, glowPulse 2.5s ease-in-out 0.8s infinite' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 0 0 rgba(34,197,94,0.6)', animation: 'auth-badge-pulse 1.6s ease-out infinite' }} />
            Now hiring — Remote positions open
          </div>

          <h1 className="hero-title anim-fade-up" style={{ animationDelay: '0.1s' }}>
            We Build Software<br />
            <span className="hero-title-accent">That Scales.</span>
          </h1>
          <p className="hero-lead anim-fade-up" style={{ animationDelay: '0.2s' }}>
            Pivotal Stack delivers custom software development, cloud architecture, and AI integration solutions — helping businesses automate, scale, and innovate with modern technology.
          </p>

          <div className="hero-cta anim-fade-up" style={{ animationDelay: '0.3s' }}>
            <a href="#contact" className="btn-shop btn-shine">
              Start a Project <ArrowRightIcon size={16} />
            </a>
            <a href="#services" className="btn-ghost btn-lg" style={{ color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.04)', borderRadius: '999px', padding: '14px 24px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Explore Services
            </a>
          </div>

          <div className="anim-fade-up" style={{ animationDelay: '0.6s', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, marginTop: 16 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Scroll to explore</span>
            <div className="scroll-indicator" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </div>
          </div>
        </div>

        <div className="hero-image hero-content">
          <div className="hero-product-card">
            <div className="hero-product-card-thumb">
              <CodeIcon size={18} />
            </div>
            <div className="hero-product-card-info">
              <strong>Custom Development</strong>
              <span>Web · Mobile · APIs</span>
            </div>
            <span className="hero-product-card-price">100%</span>
          </div>

          <div className="hero-review-strip">
            <div className="hero-review-strip-stars">★★★★★</div>
            <div className="hero-review-strip-row">
              <div className="hero-review-strip-avatars">
                <img src={IMG.avatar1} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                <img src={IMG.avatar2} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                <img src={IMG.avatar3} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                <img src={IMG.avatar4} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
                <span style={{ background: '#1f2937' }}>+50</span>
              </div>
              <strong>50+ Projects Delivered</strong>
            </div>
            <span className="hero-review-strip-meta">Trusted by startups and enterprises across 15+ countries.</span>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1, paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 24px', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap', flexShrink: 0 }}>Tech Stack</span>
          <div className="marquee-wrap" style={{ flex: 1, overflow: 'hidden' }}>
            <div className="marquee-track">
              {[...techStack, ...techStack].map((t, i) => (
                <span key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(141,198,63,0.6)', display: 'inline-block', flexShrink: 0 }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Services
// =========================================================================
function Services({ onViewService }) {
  const colorMap = {
    blue: { gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10', text: 'text-blue-500', ring: 'ring-blue-500/20' },
    purple: { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-500/10', text: 'text-purple-500', ring: 'ring-purple-500/20' },
    cyan: { gradient: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-500/10', text: 'text-cyan-500', ring: 'ring-cyan-500/20' },
    green: { gradient: 'from-green-500 to-green-600', bg: 'bg-green-500/10', text: 'text-green-500', ring: 'ring-green-500/20' },
    red: { gradient: 'from-red-500 to-red-600', bg: 'bg-red-500/10', text: 'text-red-500', ring: 'ring-red-500/20' },
    orange: { gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-500/10', text: 'text-orange-500', ring: 'ring-orange-500/20' },
  }

  return (
    <section id="services" className="svc-section">
      <div className="container">
        <div className="section-head">
          <AnimatedOnScroll type="fade-up">
            <span className="eyebrow">SERVICES</span>
            <h2>What We Offer</h2>
            <p>End-to-end solutions tailored to your business — from initial concept through ongoing growth.</p>
          </AnimatedOnScroll>
        </div>

        <div className="svc-grid">
          {services.map((s, i) => {
            const c = colorMap[s.color]
            const isEven = i % 2 === 0
            return (
              <AnimatedOnScroll key={s.title} type={isEven ? 'fade-right' : 'fade-left'} delay={100}>
                <TiltCard className={`svc-card ${isEven ? '' : 'svc-card-reverse'} card-depth`}>
                  <div className="svc-card-image img-overlay-reveal">
                    <img src={s.image} alt={s.title} />
                  </div>

                  <div className="svc-card-content">
                    <div className={`svc-icon-wrap ${c.bg} ${c.text}`}>
                      <s.Icon size={28} />
                    </div>
                    <h3 className="svc-title">{s.title}</h3>
                    <ul className="svc-features">
                      {s.features.map((f) => (
                        <li key={f}>
                          <CheckIcon size={16} className={c.text} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => onViewService?.(i)} className="svc-learn-more" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8, color: '#a78bfa', fontWeight: 600, fontSize: 14, textDecoration: 'none', transition: 'all 0.3s ease', padding: 0 }}>
                      View Details <ArrowRightIcon size={14} />
                    </button>
                  </div>
                </TiltCard>
              </AnimatedOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// About / Why Choose Us
// =========================================================================
function AnimatedStat({ value, suffix, label }) {
  const [ref, visible] = useScrollReveal()
  const count = useCounter(value, 1800, visible)
  return (
    <div ref={ref} className={`bg-white rounded-2xl border border-border p-6 text-center card-depth reveal ${visible ? 'visible' : ''}`}>
      <div className="text-4xl font-black text-primary mb-1">
        <span className="counter-num">{count}</span><span>{suffix}</span>
      </div>
      <div className="text-text-muted text-sm font-medium">{label}</div>
    </div>
  )
}

function AboutSection() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {aboutStats.map((stat) => (
            <AnimatedStat key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <AnimatedOnScroll type="fade-right">
            <img src={IMG.about5} alt="Our story" className="rounded-2xl w-full h-80 object-cover mb-6" />
            <img src={IMG.about6} alt="Our workspace" className="rounded-2xl w-full h-48 object-cover" />
          </AnimatedOnScroll>
          <AnimatedOnScroll type="fade-left">
            <span className="text-xs font-bold text-primary tracking-widest uppercase mb-3 block">Our Story</span>
            <h3 className="text-3xl font-bold mb-6">From a 3-Person Garage to a Global Team</h3>
            <p className="text-text-muted leading-relaxed mb-4">
              It started with a simple frustration: too many software projects failed not because of bad code, but because nobody understood the business. We founded Pivotal Stack to change that.
            </p>
            <p className="text-text-muted leading-relaxed mb-4">
              Today, we're 50+ engineers, designers, and strategists across San Francisco, London, Bangalore, and Singapore — but our mission remains the same: understand your business first, build the right solution second.
            </p>
            <p className="text-text-muted leading-relaxed mb-6">
              Every engagement starts with understanding your business — not just the features you want, but the outcomes you need. Then we build the right thing, the right way, and stay to make sure it keeps working.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all">
              Work with us <ArrowRightIcon size={14} />
            </a>
          </AnimatedOnScroll>
        </div>

        <div className="mb-20">
          <AnimatedOnScroll type="fade-up">
            <div className="text-center mb-12">
              <span className="eyebrow">OUR PROCESS</span>
              <h3 className="text-3xl font-bold mt-2">How We Work</h3>
            </div>
          </AnimatedOnScroll>
          <div className="relative rounded-3xl overflow-hidden">
            <img src={IMG.about7} alt="Our process" className="w-full h-64 object-cover opacity-30" />
            <div className="absolute inset-0 flex items-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full px-6 md:px-12">
                {[
                  { n: '01', title: 'Discovery', desc: 'Deep-dive into your goals' },
                  { n: '02', title: 'Design', desc: 'Wireframes & prototypes' },
                  { n: '03', title: 'Build', desc: 'Agile sprints' },
                  { n: '04', title: 'Launch', desc: 'Zero-downtime deploy' },
                ].map((step, i) => (
                  <AnimatedOnScroll key={step.n} type="fade-up" delay={i * 100}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 text-center hover:shadow-lg transition-all">
                      <div className="text-3xl font-black text-primary/20 mb-2">{step.n}</div>
                      <h4 className="font-bold text-sm mb-1">{step.title}</h4>
                      <p className="text-text-muted text-xs">{step.desc}</p>
                    </div>
                  </AnimatedOnScroll>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <AnimatedOnScroll type="fade-up">
            <div className="text-center mb-12">
              <span className="eyebrow">OUR VALUES</span>
              <h3 className="text-3xl font-bold mt-2">What Sets Us Apart</h3>
            </div>
          </AnimatedOnScroll>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutValues.map(({ Icon, title, desc, iconColor }, i) => {
              const colorClass = iconColor === 'accent' ? 'bg-accent/10 text-accent' : iconColor === 'cyan' ? 'bg-cyan/10 text-cyan' : 'bg-primary/10 text-primary'
              return (
                <AnimatedOnScroll key={title} type="scale" delay={i * 80}>
                  <div className="bg-white rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/20 transition-all card-depth text-center">
                    <div className={`w-14 h-14 rounded-xl ${colorClass} flex items-center justify-center mx-auto mb-4`}>
                      <Icon size={24} />
                    </div>
                    <h4 className="font-bold text-base mb-2">{title}</h4>
                    <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
                  </div>
                </AnimatedOnScroll>
              )
            })}
          </div>
        </div>

        <AnimatedOnScroll type="fade-up">
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1e1b4b] rounded-3xl p-12 md:p-16 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Build Something Great Together?</h3>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">Let's start with a conversation about your goals.</p>
            <a href="#contact" className="inline-flex items-center gap-2 bg-[#8DC63F] text-[#0f172a] font-bold px-8 py-4 rounded-full hover:bg-[#7BB333] transition-all hover:gap-4">
              Start the Conversation <ArrowRightIcon size={18} />
            </a>
          </div>
        </AnimatedOnScroll>
      </div>
    </section>
  )
}

// =========================================================================
// Experience & Milestones
// =========================================================================
function Milestones() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-head">
          <AnimatedOnScroll type="fade-up">
            <span className="eyebrow">OUR JOURNEY</span>
            <h2>Eight Years of Building</h2>
            <p>From a small startup to a global software company — one milestone at a time.</p>
          </AnimatedOnScroll>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {milestones.map((m, i) => (
            <AnimatedOnScroll key={m.year} type="fade-up" delay={i * 100}>
              <div className="relative pl-8 border-l-2 border-border hover:border-primary transition-colors">
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{i + 1}</div>
                <div className="text-primary font-bold text-sm mb-1">{m.year}</div>
                <h3 className="font-semibold text-lg mb-2">{m.title}</h3>
                <p className="text-text-muted text-sm">{m.desc}</p>
              </div>
            </AnimatedOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Our Team
// =========================================================================
function Team() {
  return (
    <section id="team" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <AnimatedOnScroll type="fade-up">
            <span className="eyebrow">OUR PEOPLE</span>
            <h2>Meet the Team</h2>
            <p>Engineers, designers, and strategists united by a love for building great software.</p>
          </AnimatedOnScroll>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {team.map((t, i) => (
            <AnimatedOnScroll key={t.name} type="scale" delay={i * 80}>
              <div className="text-center group">
                <TiltCard className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-border group-hover:border-primary transition-colors card-depth">
                  <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                </TiltCard>
                <h3 className="font-semibold text-lg">{t.name}</h3>
                <div className="text-primary text-sm font-medium mb-2">{t.role}</div>
                <p className="text-text-muted text-sm">{t.detail}</p>
              </div>
            </AnimatedOnScroll>
          ))}
        </div>
        <div className="text-center mt-12">
          <button className="btn-outline btn-lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
            Join Our Team <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Culture & Work Environment
// =========================================================================
function Culture() {
  return (
    <section id="culture" className="section">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedOnScroll type="fade-right">
            <span className="eyebrow">CULTURE</span>
            <h2>How We Work</h2>
            <p className="text-text-muted mb-8">We're not just building software — we're building a company where talented people do the best work of their careers.</p>
            <div className="space-y-6">
              {culture.map(({ Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{title}</h3>
                    <p className="text-text-muted text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedOnScroll>
          <AnimatedOnScroll type="fade-left" delay={150}>
            <div className="grid grid-cols-2 gap-4">
              <img src={IMG.culture1} alt="Team collaboration" className="rounded-xl w-full h-48 object-cover img-overlay-reveal" />
              <img src={IMG.culture2} alt="Office environment" className="rounded-xl w-full h-48 object-cover mt-8 img-overlay-reveal" />
            </div>
          </AnimatedOnScroll>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Global Presence
// =========================================================================
function Global() {
  return (
    <section id="global" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <AnimatedOnScroll type="fade-up">
            <span className="eyebrow">GLOBAL PRESENCE</span>
            <h2>Where We Work</h2>
            <p>A distributed team serving clients across multiple time zones and continents.</p>
          </AnimatedOnScroll>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {offices.map((o, i) => (
            <AnimatedOnScroll key={o.city} type="scale" delay={i * 80}>
              <div className="border border-border rounded-xl p-6 text-center hover:border-primary hover:shadow-lg transition-all card-depth">
                <div className="text-4xl mb-3">{o.flag}</div>
                <h3 className="font-semibold text-lg">{o.city}</h3>
                <div className="text-text-muted text-sm">{o.country}</div>
                <div className="text-primary text-xs font-medium mt-2">{o.role}</div>
              </div>
            </AnimatedOnScroll>
          ))}
        </div>
        <AnimatedOnScroll type="fade-up" delay={200}>
          <div className="mt-12 bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Ready to work with us?</h3>
            <p className="text-white/80 mb-6">We'd love to hear about your project. Let's build something great together.</p>
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors">
              Get in Touch <ArrowRightIcon size={16} />
            </button>
          </div>
        </AnimatedOnScroll>
      </div>
    </section>
  )
}

// =========================================================================
// Homepage: Projects Section
// =========================================================================
function HomeProjects({ onViewAll }) {
  return (
    <section id="projects" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <AnimatedOnScroll type="fade-up">
            <span className="eyebrow">PROJECTS</span>
            <h2>Featured Work</h2>
            <p>A selection of projects we've built for our clients across industries.</p>
          </AnimatedOnScroll>
        </div>
        <div className="showcase-grid">
          {projectsData.slice(0, 3).map((p, i) => (
            <AnimatedOnScroll key={p.id} type="fade-up" delay={i * 120}>
              <TiltCard className="showcase-card card-depth">
                <div className="showcase-image img-overlay-reveal">
                  <img src={p.image} alt={p.title} />
                </div>
                <div className="showcase-body">
                  <span className="showcase-tag">{p.tag}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(p.tech || []).slice(0, 3).map((t) => (
                      <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </AnimatedOnScroll>
          ))}
        </div>
        <div className="text-center mt-10">
          <button className="btn-outline btn-lg" onClick={onViewAll}>
            View All Projects <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Homepage: Case Studies Section
// =========================================================================
function HomeCaseStudies({ onViewAll }) {
  const trackRef = useRef(null)
  const [idx, setIdx] = useState(0)

  const prev = () => {
    setIdx(i => Math.max(0, i - 1))
    trackRef.current?.scrollTo({ left: Math.max(0, idx - 1) * 420, behavior: 'smooth' })
  }
  const next = () => {
    setIdx(i => Math.min(caseStudiesData.length - 1, i + 1))
    trackRef.current?.scrollTo({ left: Math.min(caseStudiesData.length - 1, idx + 1) * 420, behavior: 'smooth' })
  }

  return (
    <section id="casestudies" className="section">
      <div className="container">
        <div className="section-head">
          <AnimatedOnScroll type="fade-up">
            <span className="eyebrow">CASE STUDIES</span>
            <h2>In-Depth Success Stories</h2>
            <p>Deep dives into how we've helped clients solve complex challenges.</p>
          </AnimatedOnScroll>
        </div>
        <div className="relative">
          <button onClick={prev} className="cs-prev carousel-btn" disabled={idx === 0} aria-label="Previous">
            <ArrowRightIcon size={18} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div className="cs-track" ref={trackRef}>
            {caseStudiesData.map((cs, i) => (
              <article key={cs.id} className={`cs-card${i === idx ? ' active' : ''} card-depth`}>
                <div className="cs-card-image img-overlay-reveal">
                  <img src={cs.image} alt={cs.title} />
                </div>
                <div className="cs-card-body">
                  <span className="cs-tag">{cs.tag}</span>
                  <h3 className="cs-title">{cs.title}</h3>
                  <div className="cs-meta">
                    <span><strong>Client:</strong> {cs.client}</span>
                    <span><strong>Industry:</strong> {cs.industry}</span>
                    <span><strong>Duration:</strong> {cs.duration}</span>
                  </div>
                  <p className="cs-outcome">{cs.outcome}</p>
                  <button onClick={onViewAll} className="cs-read-btn">
                    Read case study <ArrowRightIcon size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <button onClick={next} className="cs-next carousel-btn" disabled={idx >= caseStudiesData.length - 1} aria-label="Next">
            <ArrowRightIcon size={18} />
          </button>
        </div>
        <div className="cs-dots">
          {caseStudiesData.map((_, i) => (
            <button key={i} className={`cs-dot${i === idx ? ' active' : ''}`} onClick={() => { setIdx(i); trackRef.current?.scrollTo({ left: i * 420, behavior: 'smooth' }) }} aria-label={`Go to slide ${i + 1}`} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="btn-outline btn-lg" onClick={onViewAll}>View All Case Studies <ArrowRightIcon size={16} /></button>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Homepage: Blogs Section
// =========================================================================
function HomeBlogs({ onViewAll }) {
  return (
    <section id="blogs" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <AnimatedOnScroll type="fade-up">
            <span className="eyebrow">BLOGS</span>
            <h2>Insights & Expertise</h2>
            <p>Thoughts on technology, design, and building great products.</p>
          </AnimatedOnScroll>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {blogsData.slice(0, 3).map((b, i) => (
            <AnimatedOnScroll key={b.id} type="fade-up" delay={i * 100}>
              <article className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all group card-depth">
                <div className="h-44 overflow-hidden img-overlay-reveal">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                    <span className="text-primary font-medium">{b.tag}</span>
                    <span>·</span>
                    <span>{b.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold mb-2 line-clamp-2">{b.title}</h3>
                  <p className="text-text-muted text-sm line-clamp-2 mb-4">{b.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={b.authorImage} alt={b.author} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-xs text-text-muted">{b.author}</span>
                    </div>
                    <span className="text-xs text-text-muted">{b.date}</span>
                  </div>
                </div>
              </article>
            </AnimatedOnScroll>
          ))}
        </div>
        <div className="text-center mt-10">
          <button className="btn-outline btn-lg" onClick={onViewAll}>
            View All Blogs <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Homepage: Careers Section
// =========================================================================
function HomeCareers({ onViewAll }) {
  return (
    <section id="careers" className="section">
      <div className="container">
        <div className="section-head">
          <AnimatedOnScroll type="fade-up">
            <span className="eyebrow">CAREERS</span>
            <h2>Join Our Team</h2>
            <p>Remote-first, people-focused. Build the future of software with us.</p>
          </AnimatedOnScroll>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careersData.slice(0, 3).map((job, i) => (
            <AnimatedOnScroll key={job.id} type="fade-up" delay={i * 100}>
              <div className="bg-white rounded-2xl border border-border p-6 hover:border-primary/30 hover:shadow-md transition-all job-card-shimmer card-depth">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-base mb-1">{job.title}</h3>
                    <p className="text-text-muted text-sm">{job.department}</p>
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">{job.type}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-text-muted mb-4">
                  <span className="flex items-center gap-1"><MapPinIcon size={12} /> {job.location}</span>
                  <span className="flex items-center gap-1"><UsersIcon size={12} /> {job.salary}</span>
                </div>
                <button onClick={onViewAll} className="w-full text-center text-sm font-semibold text-primary hover:underline">
                  View Details <ArrowRightIcon size={12} />
                </button>
              </div>
            </AnimatedOnScroll>
          ))}
        </div>
        <div className="text-center mt-10">
          <button className="btn-outline btn-lg" onClick={onViewAll}>
            View All Openings <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Contact
// =========================================================================
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email, and message.')
      return
    }
    setSending(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSent(true)
      setForm({ name: '', email: '', subject: 'general', message: '' })
    } catch (err) {
      setError('Could not send — please try again later.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="section section-alt">
      <div className="container">
        <div className="section-head">
          <AnimatedOnScroll type="fade-up">
            <span className="eyebrow">CONTACT</span>
            <h2>Let's Build Something Together</h2>
            <p>Have a project in mind? Drop us a line and we'll get back to you within one business day.</p>
          </AnimatedOnScroll>
        </div>
        <div className="contact-grid">
          <AnimatedOnScroll type="fade-right">
            <form className="contact-form" onSubmit={handleSubmit}>
              {sent && (
                <div className="contact-success">
                  <CheckIcon size={16} /> Thanks! We got your message and will reply shortly.
                </div>
              )}
              {error && <div className="auth-error">{error}</div>}
              <div className="field-row">
                <label className="field-label">
                  Name
                  <input type="text" value={form.name} onChange={update('name')} placeholder="Jane Smith" required />
                </label>
                <label className="field-label">
                  Email
                  <input type="email" value={form.email} onChange={update('email')} placeholder="jane@company.com" required />
                </label>
              </div>
              <label className="field-label">
                Subject
                <select value={form.subject} onChange={update('subject')}>
                  <option value="general">General inquiry</option>
                  <option value="project">New project</option>
                  <option value="partnerships">Partnerships</option>
                  <option value="support">Existing project support</option>
                  <option value="careers">Careers</option>
                </select>
              </label>
              <label className="field-label">
                Message
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={update('message')}
                  placeholder="Tell us about your project…"
                  required
                />
              </label>
              <button type="submit" className="btn-primary btn-lg btn-block" disabled={sending}>
                {sending ? 'Sending…' : 'Send Message'} <ArrowRightIcon size={16} />
              </button>
            </form>
          </AnimatedOnScroll>

          <aside className="contact-info">
            {[
              { icon: 'blue', title: 'Email us', value: 'hello@pivotalstack.com', meta: 'Replies within 1 business day' },
              { icon: 'green', title: 'Slack & Discord', value: 'Join our community', meta: 'Quick responses during business hours' },
              { icon: 'purple', title: 'Location', value: 'Remote-first company', meta: 'Working with clients worldwide' },
            ].map((item, i) => (
              <AnimatedOnScroll key={item.title} type="fade-left" delay={i * 100}>
                <div className="contact-info-card">
                  <div className={`contact-info-icon contact-info-icon-${item.icon}`}>
                    {item.icon === 'blue' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>
                    )}
                    {item.icon === 'green' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                    )}
                    {item.icon === 'purple' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    )}
                  </div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.value}</span>
                    <span className="contact-info-meta">{item.meta}</span>
                  </div>
                </div>
              </AnimatedOnScroll>
            ))}

            <AnimatedOnScroll type="fade-left" delay={300}>
              <div className="contact-socials">
                <a href="https://twitter.com/ivotalstacks" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="contact-social"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="https://linkedin.com/company/ivotalstacks" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="contact-social"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5v-14a5 5 0 0 0-5-5zm-11 19h-3v-11h3zm-1.5-12.3a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4zm13.5 12.3h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-11h2.88v1.5h.04a3.16 3.16 0 0 1 2.84-1.56c3.04 0 3.6 2 3.6 4.6z"/></svg></a>
                <a href="https://github.com/ivotalstacks" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="contact-social"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.3-3.2-.1-.3-.6-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg></a>
                <a href="https://youtube.com/@ivotalstacks" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="contact-social"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z"/></svg></a>
              </div>
            </AnimatedOnScroll>
          </aside>
        </div>
      </div>
    </section>
  )
}

// =========================================================================
// Footer
// =========================================================================
function Footer({ onPrivacy, onTerms, onSecurity, onProjects, onCaseStudies, onBlogs, onCareers, onServices }) {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo light />
          <p>Building the software that powers modern businesses.</p>
        </div>
        <div className="footer-cols">
          <div>
            <h4>Services</h4>
            <a href="#services">Custom Development</a>
            <a href="#services">Cloud & DevOps</a>
            <a href="#services">AI Integration</a>
            <a href="#services">API Development</a>
          </div>
          <div>
            <h4>Company</h4>
            <button onClick={onProjects} className="text-left hover:text-primary transition-colors">Projects</button>
            <button onClick={onCaseStudies} className="text-left hover:text-primary transition-colors">Case Studies</button>
            <button onClick={onServices} className="text-left hover:text-primary transition-colors">Services</button>
            <button onClick={onBlogs} className="text-left hover:text-primary transition-colors">Blogs</button>
            <button onClick={onCareers} className="text-left hover:text-primary transition-colors">Careers</button>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#experience">Our Journey</a>
            <a href="#global">Global Presence</a>
            <a href="#culture">Culture</a>
            <a href="#contact">Get in Touch</a>
          </div>
          <div>
            <h4>Legal</h4>
            <button onClick={onPrivacy} className="text-left hover:text-primary transition-colors">Privacy Policy</button>
            <button onClick={onTerms} className="text-left hover:text-primary transition-colors">Terms of Service</button>
            <button onClick={onSecurity} className="text-left hover:text-primary transition-colors">Security</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© 2026 Pivotal Stack. All rights reserved.</span>
          <span>Built with precision. Delivered with care.</span>
        </div>
      </div>
    </footer>
  )
}

// =========================================================================
// Landing Page (composed)
// =========================================================================
export default function Landing({ user, onGoDash, onSignOut, onPrivacy, onTerms, onSecurity, onViewProjects, onViewCaseStudies, onViewBlogs, onViewCareers, onViewAbout, onViewServices }) {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <Header user={user} onGoDash={onGoDash} onSignOut={onSignOut} onViewAbout={onViewAbout} />
      <main>
        <Hero />
        <HomeProjects onViewAll={onViewProjects} />
        <HomeCaseStudies onViewAll={onViewCaseStudies} />
        <HomeBlogs onViewAll={onViewBlogs} />
        <HomeCareers onViewAll={onViewCareers} />
        <AboutSection />
        <Services onViewService={onViewServices} />
        <Milestones />
        <Global />
        <Culture />
        <Team />
        <Contact />
      </main>
      <Footer
        onPrivacy={onPrivacy}
        onTerms={onTerms}
        onSecurity={onSecurity}
        onProjects={onViewProjects}
        onCaseStudies={onViewCaseStudies}
        onBlogs={onViewBlogs}
        onCareers={onViewCareers}
        onServices={onViewServices}
      />
      <ChatBot />

      <BackToTop />
    </>
  )
}
