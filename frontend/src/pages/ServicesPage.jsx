import { ArrowRightIcon, CodeIcon, CloudIcon, CogIcon, BriefcaseIcon } from '../components/Icons'
import { services, IMG } from '../data'
import AnimateOnScroll from '../components/ui/AnimateOnScroll'
import TiltCard from '../components/ui/TiltCard'

const iconMap = {
  CodeIcon,
  CloudIcon,
  CogIcon,
  BriefcaseIcon,
}

export default function ServicesPage({ onBack, user, onGoDash, onSignOut, onViewAbout, onViewDetail }) {
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
          <span className="eyebrow">SERVICES</span>
          <h2>What We Offer</h2>
          <p>Comprehensive solutions tailored to your business needs.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const IconComponent = iconMap[service.icon] || CodeIcon
            return (
              <AnimateOnScroll key={service.id} delay={i * 100}>
                <TiltCard className="h-full">
                  <div className="bg-white rounded-2xl p-8 h-full flex flex-col">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                      <IconComponent size={28} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-text-muted flex-grow mb-6">{service.desc}</p>
                    <button
                      onClick={() => onViewDetail(i)}
                      className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                    >
                      Learn More <ArrowRightIcon size={16} />
                    </button>
                  </div>
                </TiltCard>
              </AnimateOnScroll>
            )
          })}
        </div>
      </main>
    </div>
  )
}
