import { useState, useEffect, useRef } from "react"
import { StickyNote } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const STORAGE_KEY = "dashboard-notes"

export function QuickNotes() {
  const [notes, setNotes] = useState("")
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== null) setNotes(saved)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setNotes(val)
    localStorage.setItem(STORAGE_KEY, val)
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-yellow-400" />
          Quick Notes
        </CardTitle>
        <span className="ml-auto text-xs text-muted-foreground">auto-saved</span>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 flex flex-col min-h-0">
        <textarea
          ref={ref}
          value={notes}
          onChange={handleChange}
          placeholder="Type anything... (auto-saved locally)"
          className="w-full flex-1 min-h-0 text-sm bg-muted/50 border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed"
        />
      </CardContent>
    </Card>
  )
}
