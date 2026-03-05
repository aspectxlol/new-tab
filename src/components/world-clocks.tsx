import { useState, useEffect } from "react"
import { Globe2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ZONES = [
  { label: "New York", tz: "America/New_York", flag: "🇺🇸" },
  { label: "London", tz: "Europe/London", flag: "🇬🇧" },
  { label: "Berlin", tz: "Europe/Berlin", flag: "🇩🇪" },
  { label: "Dubai", tz: "Asia/Dubai", flag: "🇦🇪" },
  { label: "Tokyo", tz: "Asia/Tokyo", flag: "🇯🇵" },
  { label: "Sydney", tz: "Australia/Sydney", flag: "🇦🇺" },
]

export function WorldClocks() {
  const [times, setTimes] = useState(() => ZONES.map(() => ({ time: "", date: "" })))

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTimes(
        ZONES.map((z) => ({
          time: now.toLocaleTimeString("en-US", {
            timeZone: z.tz,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }),
          date: now.toLocaleDateString("en-US", {
            timeZone: z.tz,
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
        }))
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-sky-400" />
          World Clocks
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {ZONES.map((zone, i) => (
            <div
              key={zone.label}
              className="bg-muted/50 rounded-lg px-3 py-2.5 text-center"
            >
              <div className="text-base mb-0.5">{zone.flag}</div>
              <div className="text-xs text-muted-foreground mb-1">{zone.label}</div>
              <div className="text-sm font-medium tabular-nums leading-none">{times[i].time}</div>
              <div className="text-xs text-muted-foreground/60 mt-1">{times[i].date}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
