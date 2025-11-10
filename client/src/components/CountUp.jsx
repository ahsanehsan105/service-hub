import { useEffect, useRef, useState } from "react"

export default function CountUp({ end = 100, duration = 2000, decimals = 0, suffix = "+", startOn = true, className = "" }) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    if (!startOn) return
    const start = performance.now()
    startRef.current = start

    const step = (now) => {
      const elapsed = now - startRef.current
      const progress = Math.min(elapsed / duration, 1)
  const raw = progress * end
  const factor = Math.pow(10, decimals)
  const current = Math.floor(raw * factor) / factor
  setValue(current)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [end, duration, startOn])

  return (
    <div className={className}>
  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">{value.toFixed(decimals)}{suffix}</span>
    </div>
  )
}
