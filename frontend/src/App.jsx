import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { setView, setUser, setSelectedService } from './store/appSlice'

// Page components
import Landing from './pages/Landing'
import ProjectsPage from './pages/ProjectsPage'
import CaseStudiesPage from './pages/CaseStudiesPage'
import BlogsPage from './pages/BlogsPage'
import CareersPage from './pages/CareersPage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import AboutPage from './pages/AboutPage'

// Components
import Dashboard from './components/Dashboards'
import LegalPage from './components/LegalPage'

import './App.css'

// =========================================================================
// Redux store
// =========================================================================
function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { view, user, selectedService, curtain } = useSelector(s => s.app)

  // =========================================================================
  // changeView — dispatches Redux + updates URL
  // =========================================================================
  const changeView = (v, serviceId) => {
    const path = serviceId !== null && serviceId !== undefined
      ? `/${v}/${serviceId}`
      : `/${v}`
    navigate(path)
    dispatch(setView(v))
    if (serviceId !== null && serviceId !== undefined) {
      dispatch(setSelectedService(serviceId))
    }
    window.scrollTo(0, 0)
  }

  // =========================================================================
  // Navigation functions
  // =========================================================================
  const goHome = () => changeView('landing')
  const goDash        = (u) => { dispatch(setUser(u)); changeView('dashboard') }
  const goPrivacy     = () => changeView('privacy')
  const goTerms       = () => changeView('terms')
  const goSecurity    = () => changeView('security')
  const goProjects    = () => changeView('projects')
  const goCaseStudies = () => changeView('casestudies')
  const goBlogs       = () => changeView('blogs')
  const goCareers     = () => changeView('careers')
  const goAbout       = () => changeView('about')
  const goServices    = () => changeView('services')
  const goServiceDetail = (i) => changeView('servicedetail', i)
  const signOut        = () => { dispatch(setUser(null)); dispatch(setView('landing')) }

  // =========================================================================
  // Page-curtain skeleton overlay
  // =========================================================================
  const PageCurtain = () => (
    <div className={`page-curtain ${curtain}`} aria-hidden="true">
      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <div className="page-curtain-skeleton page-curtain-skeleton-hero" />
        <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ width: '60%', height: 48 }} />
        <div className="page-curtain-skeleton-row">
          <div className="page-curtain-skeleton page-curtain-skeleton-card" />
          <div className="page-curtain-skeleton page-curtain-skeleton-card" />
          <div className="page-curtain-skeleton page-curtain-skeleton-card" />
        </div>
        <div className="page-curtain-skeleton page-curtain-skeleton-hero" style={{ height: 48, marginTop: 16 }} />
        <div className="page-curtain-skeleton-row">
          <div className="page-curtain-skeleton page-curtain-skeleton-card" />
          <div className="page-curtain-skeleton page-curtain-skeleton-card" />
        </div>
      </div>
    </div>
  )

  // =========================================================================
  // if/else view-rendering chain
  // =========================================================================
  if (view === 'signin') {
    return (
      <>
        <SignInPage
          onBack={goHome}
          onSwitch={(v) => changeView(v === 'signup' ? 'signup' : 'signin')}
          onAuthed={goDash}
        />
        <PageCurtain />
      </>
    )
  }
  if (view === 'signup') {
    return (
      <>
        <SignUpPage
          onBack={goHome}
          onSwitch={(v) => changeView(v === 'signin' ? 'signin' : 'signup')}
          onAuthed={goDash}
          onTerms={goTerms}
          onPrivacy={goPrivacy}
        />
        <PageCurtain />
      </>
    )
  }
  if (view === 'privacy') {
    return (
      <>
        <LegalPage title="Privacy Policy" onBack={goHome}>
          <p className="mb-4"><strong>Last updated:</strong> June 15, 2026</p>
          <p className="mb-4">Pivotal Stack ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us, such as when you request a consultation, sign up for our newsletter, or contact us through our website.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, communicate with you about our services, and to comply with our legal obligations.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Information Sharing</h2>
          <p className="mb-4">We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
          <p className="mb-4">We implement appropriate technical and organizational measures to protect the security of your personal information.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@pivotalstack.com" className="text-primary hover:underline">privacy@pivotalstack.com</a>.</p>
        </LegalPage>
        <PageCurtain />
      </>
    )
  }
  if (view === 'terms') {
    return (
      <>
        <LegalPage title="Terms of Service" onBack={goHome}>
          <p className="mb-4"><strong>Last updated:</strong> June 15, 2026</p>
          <p className="mb-4">These Terms of Service ("Terms") govern your access to and use of Pivotal Stack's website and services. By accessing or using our services, you agree to be bound by these Terms.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing our website or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Services Description</h2>
          <p className="mb-4">Pivotal Stack provides custom software development, cloud architecture, AI integration, and related consulting services.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Intellectual Property</h2>
          <p className="mb-4">All content, trademarks, and other materials on our website are owned by or licensed to Pivotal Stack.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Limitation of Liability</h2>
          <p className="mb-4">To the fullest extent permitted by law, Pivotal Stack shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Contact</h2>
          <p>For questions about these Terms, please contact us at <a href="mailto:legal@pivotalstack.com" className="text-primary hover:underline">legal@pivotalstack.com</a>.</p>
        </LegalPage>
        <PageCurtain />
      </>
    )
  }
  if (view === 'security') {
    return (
      <>
        <LegalPage title="Security" onBack={goHome}>
          <p className="mb-4">At Pivotal Stack, security is a foundational priority. We implement industry-leading practices to protect our systems and your data.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">Infrastructure Security</h2>
          <p className="mb-4">Our infrastructure runs on enterprise-grade cloud providers (AWS, Azure, GCP) with SOC 2 Type II compliant data centers. All data is encrypted at rest and in transit using AES-256 and TLS 1.3.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">Access Control</h2>
          <p className="mb-4">We enforce least-privilege access controls, multi-factor authentication (MFA) for all internal systems, and regular access reviews.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">Vulnerability Management</h2>
          <p className="mb-4">We conduct regular penetration testing, automated vulnerability scanning, and security audits. Critical vulnerabilities are addressed within 24 hours of discovery.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">Incident Response</h2>
          <p className="mb-4">Our security incident response plan includes immediate notification procedures, containment protocols, and post-incident analysis.</p>
          <h2 className="text-xl font-semibold mt-6 mb-3">Report a Vulnerability</h2>
          <p>To report a security concern, please contact <a href="mailto:security@pivotalstack.com" className="text-primary hover:underline">security@pivotalstack.com</a>.</p>
        </LegalPage>
        <PageCurtain />
      </>
    )
  }
  if (view === 'dashboard' && user) {
    return (
      <>
        <Dashboard
          user={user}
          onSignOut={signOut}
          onHome={goHome}
          onUserUpdate={(u) => dispatch(setUser(u))}
        />
        <PageCurtain />
      </>
    )
  }
  if (view === 'projects') {
    return (
      <>
        <ProjectsPage onBack={goHome} />
        <PageCurtain />
      </>
    )
  }
  if (view === 'casestudies') {
    return (
      <>
        <CaseStudiesPage onBack={goHome} />
        <PageCurtain />
      </>
    )
  }
  if (view === 'blogs') {
    return (
      <>
        <BlogsPage onBack={goHome} />
        <PageCurtain />
      </>
    )
  }
  if (view === 'careers') {
    return (
      <>
        <CareersPage onBack={goHome} />
        <PageCurtain />
      </>
    )
  }
  if (view === 'services') {
    return (
      <>
        <ServicesPage onBack={goHome} onViewDetail={goServiceDetail} />
        <PageCurtain />
      </>
    )
  }
  if (view === 'about') {
    return (
      <>
        <AboutPage onBack={goHome} />
        <PageCurtain />
      </>
    )
  }
  if (view === 'servicedetail' && selectedService !== null) {
    return (
      <>
        <ServiceDetailPage
          serviceIndex={selectedService}
          onBack={() => { dispatch(setSelectedService(null)); changeView('services') }}
          onContact={() => { dispatch(setSelectedService(null)); changeView('landing'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100) }}
        />
        <PageCurtain />
      </>
    )
  }

  // =========================================================================
  // React Router — functional Routes as fallback/default
  // =========================================================================
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Landing
            user={user}
            onGoDash={goDash}
            onSignOut={signOut}
            onPrivacy={goPrivacy}
            onTerms={goTerms}
            onSecurity={goSecurity}
            onViewProjects={goProjects}
            onViewCaseStudies={goCaseStudies}
            onViewBlogs={goBlogs}
            onViewCareers={goCareers}
            onViewAbout={goAbout}
            onViewServices={goServiceDetail}
          />
        }
      />
      <Route
        path="/signin"
        element={
          <SignInPage
            onBack={goHome}
            onSwitch={(v) => changeView(v === 'signup' ? 'signup' : 'signin')}
            onAuthed={goDash}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <SignUpPage
            onBack={goHome}
            onSwitch={(v) => changeView(v === 'signin' ? 'signin' : 'signup')}
            onAuthed={goDash}
            onTerms={goTerms}
            onPrivacy={goPrivacy}
          />
        }
      />
      <Route
        path="/privacy"
        element={
          <LegalPage title="Privacy Policy" onBack={goHome}>
            <p>Privacy content loaded via routing.</p>
          </LegalPage>
        }
      />
      <Route
        path="/terms"
        element={
          <LegalPage title="Terms of Service" onBack={goHome}>
            <p>Terms content loaded via routing.</p>
          </LegalPage>
        }
      />
      <Route
        path="/security"
        element={
          <LegalPage title="Security" onBack={goHome}>
            <p>Security content loaded via routing.</p>
          </LegalPage>
        }
      />
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard
              user={user}
              onSignOut={signOut}
              onHome={goHome}
              onUserUpdate={(u) => dispatch(setUser(u))}
            />
          ) : (
            <Landing
              user={user}
              onGoDash={goDash}
              onSignOut={signOut}
              onPrivacy={goPrivacy}
              onTerms={goTerms}
              onSecurity={goSecurity}
              onViewProjects={goProjects}
              onViewCaseStudies={goCaseStudies}
              onViewBlogs={goBlogs}
              onViewCareers={goCareers}
              onViewAbout={goAbout}
              onViewServices={goServiceDetail}
            />
          )
        }
      />
      <Route path="/projects" element={<ProjectsPage onBack={goHome} />} />
      <Route path="/casestudies" element={<CaseStudiesPage onBack={goHome} />} />
      <Route path="/blogs" element={<BlogsPage onBack={goHome} />} />
      <Route path="/careers" element={<CareersPage onBack={goHome} />} />
      <Route
        path="/services"
        element={<ServicesPage onBack={goHome} onViewDetail={goServiceDetail} />}
      />
      <Route path="/about" element={<AboutPage onBack={goHome} />} />
      <Route
        path="/servicedetail/:id"
        element={
          <ServiceDetailPage
            onBack={() => navigate('/services')}
            onContact={() => navigate('/')}
          />
        }
      />
      <Route
        path="*"
        element={
          <Landing
            user={user}
            onGoDash={goDash}
            onSignOut={signOut}
            onPrivacy={goPrivacy}
            onTerms={goTerms}
            onSecurity={goSecurity}
            onViewProjects={goProjects}
            onViewCaseStudies={goCaseStudies}
            onViewBlogs={goBlogs}
            onViewCareers={goCareers}
            onViewAbout={goAbout}
            onViewServices={goServiceDetail}
          />
        }
      />
    </Routes>
  )
}

export default App
