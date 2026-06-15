const fs = require('fs');
let c = fs.readFileSync('App.jsx', 'utf8');

// ============================================================
// REPLACE App component - remove old routing, use React Router + Redux
// ============================================================

// Find the App function start
const appStart = `// =========================================================================
// App
// =========================================================================
function App() {
  const [view, setViewState] = useState('landing')
  const [user, setUser] = useState(null)
  const [curtain, setCurtain] = useState('') // '' | 'entering' | 'leaving'
  const [selectedService, setSelectedService] = useState(null) // index for service detail page
  const prevView = useRef(view)

  // Parse URL params: #view or #view/serviceId
  const parseUrlState = () => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return { view: 'landing', serviceId: null }
    const parts = hash.split('/')
    const viewName = parts[0]
    const serviceId = parts[1] ? parseInt(parts[1], 10) : null
    return { view: viewName, serviceId }
  }

  const setView = (v, serviceId) => {
    if (v === view && serviceId === selectedService) return
    // Update URL hash immediately
    const hash = serviceId !== null && serviceId !== undefined ? \`#\${v}/\${serviceId}\` : \`#\${v}\`
    window.location.hash = hash
    setCurtain('leaving')
    prevView.current = view
    setViewState(v)
    if (serviceId !== null && serviceId !== undefined) setSelectedService(serviceId)
    window.scrollTo(0, 0)
    setCurtain('entering')
    setTimeout(() => setCurtain(''), 500)
  }

  // On mount, read view from URL hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const parts = hash.split('/')
    const urlView = parts[0]
    const serviceId = parts[1] ? parseInt(parts[1], 10) : null
    const validViews = ['signin','signup','privacy','terms','security','dashboard','projects','casestudies','blogs','careers','services','about','servicedetail']
    if (urlView && validViews.includes(urlView)) {
      setViewState(urlView)
      if (serviceId !== null) setSelectedService(serviceId)
    }
    setCurtain('entering')
    const t = setTimeout(() => setCurtain(''), 500)
    return () => clearTimeout(t)
  }, [])

  // Listen for back/forward button (hashchange)
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (!hash) return
      const parts = hash.split('/')
      const urlView = parts[0]
      const serviceId = parts[1] ? parseInt(parts[1], 10) : null
      const validViews = ['signin','signup','privacy','terms','security','dashboard','projects','casestudies','blogs','careers','services','about','servicedetail']
      if (urlView && validViews.includes(urlView)) {
        setViewState(urlView)
        if (serviceId !== null) setSelectedService(serviceId)
      }
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    // Auth token checked in-memory only during session
  }, [])

  const goSignIn = () => { setView('signin'); window.scrollTo(0, 0) }
  const goSignUp = () => { setView('signup'); window.scrollTo(0, 0) }
  const goHome   = () => { setView('landing'); window.scrollTo(0, 0) }
  const goDash   = (u) => { setUser(u); setView('dashboard'); window.scrollTo(0, 0) }
  const goPrivacy = () => { setView('privacy'); window.scrollTo(0, 0) }
  const goTerms   = () => { setView('terms'); window.scrollTo(0, 0) }
  const goSecurity = () => { setView('security'); window.scrollTo(0, 0) }
  const goProjects = () => { setView('projects'); window.scrollTo(0, 0) }
  const goCaseStudies = () => { setView('casestudies'); window.scrollTo(0, 0) }
  const goBlogs = () => { setView('blogs'); window.scrollTo(0, 0) }
  const goCareers = () => { setView('careers'); window.scrollTo(0, 0) }
  const goAbout = () => { setView('about') }
  const goServices = () => { setView('services') }
  const goServiceDetail = (i) => { setView('servicedetail', i) }
  const signOut  = () => {
    setUser(null)
    setViewState('landing')
  }`;

const newAppStart = `// =========================================================================
// App
// =========================================================================
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { setView, setUser, setSelectedService, setCurtain } from './store/appSlice'

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { view, user, selectedService, curtain } = useSelector(s => s.app)

  const changeView = (v, serviceId) => {
    const path = serviceId !== null && serviceId !== undefined ? \`/\${v}/\${serviceId}\` : \`/\${v}\`
    navigate(path)
    dispatch(setView(v))
    if (serviceId !== null && serviceId !== undefined) dispatch(setSelectedService(serviceId))
    window.scrollTo(0, 0)
  }

  const goSignIn = () => changeView('signin')
  const goSignUp = () => changeView('signup')
  const goHome   = () => changeView('landing')
  const goDash   = (u) => { dispatch(setUser(u)); changeView('dashboard') }
  const goPrivacy = () => changeView('privacy')
  const goTerms   = () => changeView('terms')
  const goSecurity = () => changeView('security')
  const goProjects = () => changeView('projects')
  const goCaseStudies = () => changeView('casestudies')
  const goBlogs = () => changeView('blogs')
  const goCareers = () => changeView('careers')
  const goAbout = () => changeView('about')
  const goServices = () => changeView('services')
  const goServiceDetail = (i) => changeView('servicedetail', i)
  const signOut  = () => { dispatch(setUser(null)); dispatch(setView('landing')) }`;

c = c.split(appStart).join(newAppStart);

// ============================================================
// REPLACE all view conditionals with Route components
// Landing and default (/) - serves as homepage
// ============================================================

// Find the old view === 'signin' block and replace the entire block
// The old pattern starts with if (view === 'signin') { and ends with the last route
// We need to replace the whole conditional chain with Routes

// Find where the old if chain starts
const oldSignIn = `  if (view === 'signin') {
    return (
      <>
        <SignInPage onBack={goHome} onSwitch={(v) => setViewState(v === 'signup' ? 'signup' : 'signin')} onAuthed={goDash} />
        <div className={\`page-curtain \${curtain}\`} aria-hidden="true">
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
      </>
    )
  }`;

const newRoutes = `  return (
    <Routes>
      <Route path="/" element={<Landing user={user} onGoDash={goDash} onSignOut={signOut} onPrivacy={goPrivacy} onTerms={goTerms} onSecurity={goSecurity} onViewProjects={goProjects} onViewCaseStudies={goCaseStudies} onViewBlogs={goBlogs} onViewCareers={goCareers} onViewAbout={goAbout} onViewServices={goServiceDetail} />} />
      <Route path="/signin" element={<SignInPage onBack={goHome} onSwitch={(v) => v === 'signup' ? goSignUp() : goSignIn()} onAuthed={goDash} />} />
      <Route path="/signup" element={<SignUpPage onBack={goHome} onSwitch={(v) => v === 'signin' ? goSignIn() : goSignUp()} onAuthed={goDash} onTerms={goTerms} onPrivacy={goPrivacy} />} />
      <Route path="/privacy" element={<LegalPage title="Privacy Policy" onBack={goHome}><p>Privacy content</p></LegalPage>} />
      <Route path="/terms" element={<LegalPage title="Terms of Service" onBack={goHome}><p>Terms content</p></LegalPage>} />
      <Route path="/security" element={<LegalPage title="Security" onBack={goHome}><p>Security content</p></LegalPage>} />
      <Route path="/dashboard" element={user ? <Dashboard user={user} onSignOut={signOut} onHome={goHome} onUserUpdate={(u) => dispatch(setUser(u))} /> : <Landing user={user} onGoDash={goDash} onSignOut={signOut} onPrivacy={goPrivacy} onTerms={goTerms} onSecurity={goSecurity} onViewProjects={goProjects} onViewCaseStudies={goCaseStudies} onViewBlogs={goBlogs} onViewCareers={goCareers} onViewAbout={goAbout} onViewServices={goServiceDetail} />} />
      <Route path="/projects" element={<ProjectsPage onBack={goHome} />} />
      <Route path="/casestudies" element={<CaseStudiesPage onBack={goHome} />} />
      <Route path="/blogs" element={<BlogsPage onBack={goHome} />} />
      <Route path="/careers" element={<CareersPage onBack={goHome} />} />
      <Route path="/services" element={<ServicesPage onBack={goHome} onViewDetail={goServiceDetail} />} />
      <Route path="/about" element={<AboutPage onBack={goHome} />} />
      <Route path="/servicedetail/:id" element={<ServiceDetailPage onBack={() => navigate('/services')} onContact={() => navigate('/')} />} />
      <Route path="*" element={<Landing user={user} onGoDash={goDash} onSignOut={signOut} onPrivacy={goPrivacy} onTerms={goTerms} onSecurity={goSecurity} onViewProjects={goProjects} onViewCaseStudies={goCaseStudies} onViewBlogs={goBlogs} onViewCareers={goCareers} onViewAbout={goAbout} onViewServices={goServiceDetail} />} />
    </Routes>
  )`;

// The last line of App function is the closing brace - find it
// The old return was a long chain of if statements - we replace the whole chain
// Find the position of the last closing brace of App function

// Instead of trying to find the whole block, let's just append the new Routes at the end
// and comment out the old if chain

// Find "export default App" and work backwards
const exportDefault = `export default App`
const lastIfBeforeExport = `  return (
    <>
      <Landing user={user} onGoDash={() => setView('dashboard')} onSignOut={signOut} onPrivacy={goPrivacy} onTerms={goTerms} onSecurity={goSecurity} onViewProjects={goProjects} onViewCaseStudies={goCaseStudies} onViewBlogs={goBlogs} onViewCareers={goCareers} onViewAbout={goAbout} onViewServices={(i) => { if (i !== undefined) { setView('servicedetail', i); } else { goServices(); } }} />
      <div className={\`page-curtain \${curtain}\`} aria-hidden="true">
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
    </>
  )
}`

// Find the App function and replace its return block
// The function ends with export default App
// Let's find the position just before export default App

const appEnd = `  return (
    <>
      <Landing user={user} onGoDash={() => setView('dashboard')} onSignOut={signOut} onPrivacy={goPrivacy} onTerms={goTerms} onSecurity={goSecurity} onViewProjects={goProjects} onViewCaseStudies={goCaseStudies} onViewBlogs={goBlogs} onViewCareers={goCareers} onViewAbout={goAbout} onViewServices={(i) => { if (i !== undefined) { setView('servicedetail', i); } else { goServices(); } }} />
      <div className={\`page-curtain \${curtain}\`} aria-hidden="true">
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
    </>
  )
}

export default App`

const newAppEnd = `  return (
    <Routes>
      <Route path="/" element={<Landing user={user} onGoDash={goDash} onSignOut={signOut} onPrivacy={goPrivacy} onTerms={goTerms} onSecurity={goSecurity} onViewProjects={goProjects} onViewCaseStudies={goCaseStudies} onViewBlogs={goBlogs} onViewCareers={goCareers} onViewAbout={goAbout} onViewServices={goServiceDetail} />} />
      <Route path="/signin" element={<SignInPage onBack={goHome} onSwitch={(v) => v === 'signup' ? goSignUp() : goSignIn()} onAuthed={goDash} />} />
      <Route path="/signup" element={<SignUpPage onBack={goHome} onSwitch={(v) => v === 'signin' ? goSignIn() : goSignUp()} onAuthed={goDash} onTerms={goTerms} onPrivacy={goPrivacy} />} />
      <Route path="/privacy" element={<LegalPage title="Privacy Policy" onBack={goHome}><p>Privacy content</p></LegalPage>} />
      <Route path="/terms" element={<LegalPage title="Terms of Service" onBack={goHome}><p>Terms content</p></LegalPage>} />
      <Route path="/security" element={<LegalPage title="Security" onBack={goHome}><p>Security content</p></LegalPage>} />
      <Route path="/dashboard" element={user ? <Dashboard user={user} onSignOut={signOut} onHome={goHome} onUserUpdate={(u) => dispatch(setUser(u))} /> : <Landing user={user} onGoDash={goDash} onSignOut={signOut} onPrivacy={goPrivacy} onTerms={goTerms} onSecurity={goSecurity} onViewProjects={goProjects} onViewCaseStudies={goCaseStudies} onViewBlogs={goBlogs} onViewCareers={goCareers} onViewAbout={goAbout} onViewServices={goServiceDetail} />} />
      <Route path="/projects" element={<ProjectsPage onBack={goHome} />} />
      <Route path="/casestudies" element={<CaseStudiesPage onBack={goHome} />} />
      <Route path="/blogs" element={<BlogsPage onBack={goHome} />} />
      <Route path="/careers" element={<CareersPage onBack={goHome} />} />
      <Route path="/services" element={<ServicesPage onBack={goHome} onViewDetail={goServiceDetail} />} />
      <Route path="/about" element={<AboutPage onBack={goHome} />} />
      <Route path="/servicedetail/:id" element={<ServiceDetailPage onBack={() => navigate('/services')} onContact={() => navigate('/')} />} />
      <Route path="*" element={<Landing user={user} onGoDash={goDash} onSignOut={signOut} onPrivacy={goPrivacy} onTerms={goTerms} onSecurity={goSecurity} onViewProjects={goProjects} onViewCaseStudies={goCaseStudies} onViewBlogs={goBlogs} onViewCareers={goCareers} onViewAbout={goAbout} onViewServices={goServiceDetail} />} />
    </Routes>
  )
}

export default App`

c = c.split(appEnd).join(newAppEnd)

fs.writeFileSync('App.jsx', c)
console.log('Router rewrite applied')
