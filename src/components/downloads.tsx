import { useEffect, useState } from "react"
import { Download, File, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type DlItem = {
  id: number
  filename: string
  state: string
  bytesReceived: number
  totalBytes: number
  startTime: string
}

function formatSize(bytes: number) {
  if (!bytes) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function StateIcon({ state }: { state: string }) {
  if (state === "complete") return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
  if (state === "interrupted") return <XCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
  return <Loader2 className="h-3.5 w-3.5 text-sky-400 animate-spin flex-shrink-0" />
}

export function Downloads() {
  const [items, setItems] = useState<DlItem[] | null>(null)

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.downloads) {
      chrome.downloads.search({ limit: 6, orderBy: ["-startTime"] }, (results) => {
        setItems(
          results.map((d) => ({
            id: d.id,
            filename: (d.filename || "").replace(/\\/g, "/").split("/").pop() || "Unknown",
            state: d.state ?? "in_progress",
            bytesReceived: d.bytesReceived ?? 0,
            totalBytes: d.totalBytes ?? 0,
            startTime: d.startTime ?? "",
          }))
        )
      })
    } else {
      setItems([])
    }
  }, [])

  function openItem(d: DlItem) {
    if (typeof chrome === "undefined" || !chrome.downloads) return
    if (d.state === "complete") {
      chrome.downloads.open(d.id)
    } else {
      chrome.downloads.show(d.id)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 pt-4">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Download className="h-4 w-4 text-violet-400" />
          Recent Downloads
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {items === null ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-3.5 w-3.5 rounded-sm flex-shrink-0" />
                <Skeleton className="h-3.5 w-3.5 rounded-sm flex-shrink-0" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-2">No downloads</p>
        ) : (
          <div className="space-y-2">
            {items.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 group cursor-pointer rounded hover:bg-accent/50 px-1 -mx-1 transition-colors"
                onClick={() => openItem(d)}
              >
                <StateIcon state={d.state} />
                <File className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate group-hover:text-foreground">{d.filename}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatSize(d.bytesReceived)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
