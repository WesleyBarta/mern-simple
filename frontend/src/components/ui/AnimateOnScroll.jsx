import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function AnimateOnScroll({ children, className = '', type = 'fade-up', delay = 0, style = {} }) {
  const [ref, visible] = useScrollReveal({ threshold: 0.1 })
  const classMap = {
    'fade-up':   'reveal',
    'fade-left': 'reveal-left',
    'fade-right':'reveal-right',
    'scale':     'reveal-scale',
  }
  const cls = [classMap[type] || 'reveal', visible ? 'visible' : '', className].filter(Boolean).join(' ')
  const delayStyle = delay ? { transitionDelay: `${delay}ms`, ...style } : style
  return (
    <div ref={ref} className={cls} style={delayStyle}>
      {children}
    </div>
  )
}
