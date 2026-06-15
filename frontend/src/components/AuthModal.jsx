import { useState, useEffect } from 'react'

// Modal that flips between Sign In and Sign Up. Rendered with `null`
// when closed. The form is purely visual — submission shows a demo
// alert so the user can wire it up to a real endpoint later.
function AuthModal({ mode, onClose, switchMode }) {
  // Esc closes the modal
  useEffect(() => {
    if (!mode) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mode, onClose])

  if (!mode) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        <aside className="modal-side">
          <div className="modal-side-content">
            <div className="modal-brand">
              <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="white" fillOpacity="0.15"/>
                <path d="M9 22V10h3.5l3 8 3-8H22v12h-2.5v-7.5L17 22h-2l-2.5-7.5V22H9z" fill="white"/>
              </svg>
              <span>GSFSGroup</span>
            </div>
            <h2>Build your future with us.</h2>
            <p>Join 100,000+ professionals using GSFSGroup to find jobs, learn skills, and ship with AI.</p>
            <ul>
              <li>✓ 10,000+ curated jobs</li>
              <li>✓ Free AI API key</li>
              <li>✓ AI resume & interview tools</li>
              <li>✓ Skill courses with certificates</li>
            </ul>
          </div>
        </aside>

        <div className="modal-form">
          <div className="tabs">
            <button
              type="button"
              className={mode === 'signin' ? 'tab active' : 'tab'}
              onClick={() => switchMode('signin')}
            >Sign In</button>
            <button
              type="button"
              className={mode === 'signup' ? 'tab active' : 'tab'}
              onClick={() => switchMode('signup')}
            >Sign Up</button>
          </div>

          {mode === 'signup' ? (
            <form onSubmit={(e) => { e.preventDefault(); onClose(); alert('Account created! (demo)') }}>
              <label>
                Full name
                <input type="text" required placeholder="John Doe" autoFocus />
              </label>
              <label>
                Work email
                <input type="email" required placeholder="you@company.com" />
              </label>
              <label>
                Password
                <input type="password" required placeholder="At least 8 characters" minLength={8} />
              </label>
              <label className="check">
                <input type="checkbox" required />
                <span>I agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a></span>
              </label>
              <button type="submit" className="btn-primary btn-block">Create Account</button>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); onClose(); alert('Signed in! (demo)') }}>
              <label>
                Email
                <input type="email" required placeholder="you@company.com" autoFocus />
              </label>
              <label>
                Password
                <input type="password" required placeholder="••••••••" />
              </label>
              <div className="form-row">
                <label className="check">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" className="link">Forgot password?</a>
              </div>
              <button type="submit" className="btn-primary btn-block">Sign In</button>
            </form>
          )}

          <div className="divider"><span>or continue with</span></div>
          <div className="social">
            <button
              type="button"
              className="social-btn"
              onClick={() => { onClose(); alert('Google sign-in (demo)') }}
            >G  Google</button>
            <button
              type="button"
              className="social-btn"
              onClick={() => { onClose(); alert('GitHub sign-in (demo)') }}
            >⌘  GitHub</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
