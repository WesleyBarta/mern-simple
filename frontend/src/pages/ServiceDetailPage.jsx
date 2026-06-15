import { ArrowRightIcon, CheckIcon, CodeIcon, CloudIcon, CogIcon, BriefcaseIcon } from '../components/Icons'
import { services, IMG } from '../data'
import AnimateOnScroll from '../components/ui/AnimateOnScroll'
import TiltCard from '../components/ui/TiltCard'

const iconMap = {
  CodeIcon,
  CloudIcon,
  CogIcon,
  BriefcaseIcon,
}

export default function ServiceDetailPage({ serviceIndex, onBack, onContact, user, onGoDash, onSignOut, onViewAbout }) {
  const service = services[serviceIndex]
  if (!service) return null

  const IconComponent = iconMap[service.icon] || CodeIcon

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

      <div className="bg-primary text-white py-16">
        <div className="container">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 mb-6 hover:text-white transition-colors">
            <ArrowRightIcon size={14} style={{ transform: 'rotate(180deg)' }} /> Back to services
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
              <IconComponent size={32} className="text-white" />
            </div>
            <span className="text-white/60 text-sm uppercase tracking-wider">{service.tag}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{service.title}</h1>
          <p className="text-white/80 text-lg max-w-2xl">{service.fullDesc}</p>
        </div>
      </div>

      <main className="container py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <AnimateOnScroll>
              <div>
                <h2 className="text-2xl font-bold mb-4">Overview</h2>
                <p className="text-text-muted leading-relaxed">{service.fullDesc}</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Process</h2>
                <div className="space-y-4">
                  {service.process.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{step.title}</h3>
                        <p className="text-text-muted text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div>
                <h2 className="text-2xl font-bold mb-4">Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech) => (
                    <span key={tech} className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm">{tech}</span>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={300}>
              <div>
                <h2 className="text-2xl font-bold mb-4">Benefits</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                      <CheckIcon size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-text-muted">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4">Interested in this service?</h3>
                <p className="text-text-muted text-sm mb-6">Get in touch with us to discuss your project and see how we can help.</p>
                <button
                  onClick={onContact}
                  className="w-full bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
