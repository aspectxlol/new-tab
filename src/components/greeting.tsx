import { useState, useEffect } from "react"

function getTimeState() {
  const now = new Date()
  const h = now.getHours()
  return {
    hours: String(h % 12 || 12).padStart(2, "0"),
    minutes: String(now.getMinutes()).padStart(2, "0"),
    seconds: String(now.getSeconds()).padStart(2, "0"),
    dateStr: now.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    greeting:
      h >= 5 && h < 12 ? "Good morning, sir"
      : h >= 12 && h < 18 ? "Good afternoon, sir"
      : h >= 18 && h < 22 ? "Good evening, sir"
      : "Good night, sir",
  }
}

export function Greeting() {
  const [{ hours, minutes, seconds, dateStr, greeting }, setTime] = useState(getTimeState)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeState()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="text-center pt-20 pb-4 select-none">
      <div className="flex items-end justify-center gap-1 tabular-nums leading-none" style={{ fontFamily: "'DM Mono', monospace" }}>
        <span className="text-[9rem] font-bold tracking-tight text-foreground">
          {hours}:{minutes}
        </span>
        <span className="text-5xl font-bold text-muted-foreground mb-4 w-16 text-left">
          {seconds}
        </span>
      </div>
      <div className="mt-2 text-lg text-muted-foreground font-light tracking-wide">{dateStr}</div>
      <div className="mt-1 text-xs text-muted-foreground/60 uppercase tracking-[0.3em]">{greeting}</div>
    </div>
  )
}

