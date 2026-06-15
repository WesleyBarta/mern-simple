import { useState, useRef, useCallback } from 'react'

export default function TiltCard({ children, className = '' }) {
  const ref = useRef(null)
  const [transform, setTransform] = useState('')

  const handleMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / rect.width - 0.5
    const cy = (e.clientY - rect.top) / rect.height - 0.5
    setTransform(`perspective(800px) rotateX(${-cy * 12}deg) rotateY(${cx * 12}deg) scale3d(1.02, 1.02, 1.02)`)
  }, [])

  const handleMouseLeave = useCallback(() => setTransform(''), [])

  return (
    <div ref={ref} className={className} style={{ transform, transition: transform ? 'transform 0.15s ease-out' : 'transform 0.4s ease-out' }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  )
}
