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

const clientLogos = [
  { name: 'TechScale', initials: 'TS', color: '#3B82F6' },
  { name: 'NovaBuild', initials: 'NB', color: '#8B5CF6' },
  { name: 'DataPro', initials: 'DP', color: '#06B6D4' },
  { name: 'CloudFirst', initials: 'CF', color: '#10B981' },
  { name: 'AI Labs', initials: 'AI', color: '#F59E0B' },
  { name: 'SecureNet', initials: 'SN', color: '#EF4444' },
]

const testimonials = [
  {
    avatar: IMG.avatar1,
    name: 'Maya Reyes',
    role: 'CTO',
    company: 'TechScale Inc',
    quote: 'Pivotal Stack delivered our platform 3 weeks ahead of schedule. The code quality and communication were exceptional.',
  },
  {
    avatar: IMG.avatar2,
    name: 'David Kim',
    role: 'VP Engineering',
    company: 'NovaBuild',
    quote: 'Their team integrated seamlessly with ours. We shipped 40% faster than our previous vendor and the architecture is built to scale.',
  },
  {
    avatar: IMG.avatar3,
    name: 'Sarah Chen',
    role: 'Head of Product',
    company: 'DataPro',
    quote: 'The AI chatbot they built handles 10,000+ conversations daily with 92% resolution. Game changer for our customer support.',
  },
]

export default function AboutPage({ user, onGoDash, onSignOut, onViewAbout, onViewCareers }) {
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
        {/* 1. Hero Banner */}
        <section
          id="hero"
          className="hero hero-image-bg"
          style={{ backgroundImage: `url(${IMG.hero})`, minHeight: '60vh' }}
        >
          <div className="hero-image-overlay" aria-hidden />
          <div className="container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', paddingTop: 120, paddingBottom: 80 }}>
            <div className="badge glow-pulse" style={{ animation: 'fadeInUp 0.6s ease both, glowPulse 2.5s ease-in-out 0.8s infinite', marginBottom: 24 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 0 0 rgba(34,197,94,0.6)', animation: 'auth-badge-pulse 1.6s ease-out infinite' }} />
              Our Mission & Vision
            </div>
            <h1 className="hero-title anim-fade-up" style={{ animationDelay: '0.1s', fontSize: 'clamp(36px, 6vw, 64px)' }}>
              We build software that<br />
              <span className="hero-title-accent">powers modern businesses.</span>
            </h1>
            <p className="hero-lead anim-fade-up" style={{ animationDelay: '0.2s', maxWidth: 640 }}>
              Pivotal Stack delivers custom software development, cloud architecture, and AI integration solutions — helping businesses automate, scale, and innovate with modern technology.
            </p>
          </div>
        </section>

        {/* 2. Stats Row */}
        <section className="section">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {aboutStats.map((stat) => (
                <AnimatedStat key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </section>

        {/* 3. Our Story */}
        <section className="section section-alt">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
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
          </div>
        </section>

        {/* 4. Our Process */}
        <section className="section">
          <div className="container">
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
        </section>

        {/* 5. Values Grid */}
        <section className="section section-alt">
          <div className="container">
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
        </section>

        {/* 6. Team Section */}
        <section id="team" className="section">
          <div className="container">
            <AnimatedOnScroll type="fade-up">
              <div className="section-head">
                <span className="eyebrow">OUR PEOPLE</span>
                <h2>Meet the Team</h2>
                <p>Engineers, designers, and strategists united by a love for building great software.</p>
              </div>
            </AnimatedOnScroll>
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
          </div>
        </section>

        {/* 7. Global Presence */}
        <section id="global" className="section section-alt">
          <div className="container">
            <AnimatedOnScroll type="fade-up">
              <div className="section-head">
                <span className="eyebrow">GLOBAL PRESENCE</span>
                <h2>Where We Work</h2>
                <p>A distributed team serving clients across multiple time zones and continents.</p>
              </div>
            </AnimatedOnScroll>
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
          </div>
        </section>

        {/* 8. Culture Section */}
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

        {/* 9. Client Logos */}
        <section className="section section-alt">
          <div className="container">
            <AnimatedOnScroll type="fade-up">
              <div className="text-center mb-12">
                <span className="eyebrow">CLIENTS</span>
                <h3 className="text-3xl font-bold mt-2">Trusted by Industry Leaders</h3>
              </div>
            </AnimatedOnScroll>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {clientLogos.map((logo, i) => (
                <AnimatedOnScroll key={logo.name} type="scale" delay={i * 60}>
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ background: logo.color }}
                    >
                      {logo.initials}
                    </div>
                    <span className="text-sm font-medium text-text-muted">{logo.name}</span>
                  </div>
                </AnimatedOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Testimonials */}
        <section className="section">
          <div className="container">
            <AnimatedOnScroll type="fade-up">
              <div className="section-head">
                <span className="eyebrow">TESTIMONIALS</span>
                <h2>What Our Clients Say</h2>
              </div>
            </AnimatedOnScroll>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <AnimatedOnScroll key={t.name} type="fade-up" delay={i * 100}>
                  <div className="bg-white rounded-2xl border border-border p-8 card-depth">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, si) => (
                        <StarIcon key={si} size={14} className="text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-text-muted leading-relaxed mb-6 italic">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-text-muted text-sm">{t.role} · {t.company}</div>
                      </div>
                    </div>
                  </div>
                </AnimatedOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Careers CTA */}
        <section className="section section-alt">
          <div className="container">
            <AnimatedOnScroll type="fade-up">
              <div className="bg-gradient-to-r from-[#0f172a] to-[#1e1b4b] rounded-3xl p-12 md:p-16 text-center">
                <h3 className="text-3xl font-bold text-white mb-4">Join Our Team</h3>
                <p className="text-white/70 mb-8 max-w-xl mx-auto">We're looking for talented engineers, designers, and strategists to help us build the future of software.</p>
                <button
                  onClick={() => onViewCareers?.()}
                  className="inline-flex items-center gap-2 bg-[#8DC63F] text-[#0f172a] font-bold px-8 py-4 rounded-full hover:bg-[#7BB333] transition-all hover:gap-4"
                >
                  View Openings <ArrowRightIcon size={18} />
                </button>
              </div>
            </AnimatedOnScroll>
          </div>
        </section>

        {/* 12. Contact CTA */}
        <section id="contact" className="section">
          <div className="container">
            <AnimatedOnScroll type="fade-up">
              <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 md:p-16 text-center text-white">
                <h3 className="text-3xl font-bold mb-4">Ready to work with us?</h3>
                <p className="text-white/80 mb-8 max-w-xl mx-auto">Let's start with a conversation about your goals.</p>
                <a href="#contact" className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-white/90 transition-all">
                  Start the Conversation <ArrowRightIcon size={18} />
                </a>
              </div>
            </AnimatedOnScroll>
          </div>
        </section>
      </main>

      <ChatBot />

      <BackToTop />
    </>
  )
}
