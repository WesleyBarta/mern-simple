import { ArrowLeftIcon } from './Icons'

export default function LegalPage({ title, children, onBack }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="header">
        <div className="header-inner">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">i</span>
            </div>
            <span className="font-semibold text-lg text-text">ivotalstacks</span>
          </div>
        </div>
      </header>
      <main className="container py-16 max-w-3xl">
        <button onClick={onBack} className="flex items-center gap-2 text-text-muted hover:text-primary mb-8 transition-colors">
          <ArrowLeftIcon size={16} /> Back to Home
        </button>
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <div className="border-t border-border mt-8 pt-8 text-text leading-relaxed">
          {children}
        </div>
      </main>
    </div>
  )
}