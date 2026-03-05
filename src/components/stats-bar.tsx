import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { Globe, Bookmark, Clock, Download, Layers } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type Stat = {
  label: string
  value: string | number | null
  icon: ReactNode
  accent: string
}

const initial: Stat[] = [
  { label: "Open Tabs", value: null, icon: <Layers className="h-5 w-5" />, accent: "text-sky-400" },
  { label: "Bookmarks", value: null, icon: <Bookmark className="h-5 w-5" />, accent: "text-yellow-400" },
  { label: "History Today", value: null, icon: <Clock className="h-5 w-5" />, accent: "text-emerald-400" },
  { label: "Downloads", value: null, icon: <Download className="h-5 w-5" />, accent: "text-violet-400" },
  { label: "Top Sites", value: null, icon: <Globe className="h-5 w-5" />, accent: "text-pink-400" },
]

function countBookmarks(nodes: chrome.bookmarks.BookmarkTreeNode[]): number {
  return nodes.reduce(
    (acc, n) => acc + (n.url ? 1 : 0) + (n.children ? countBookmarks(n.children) : 0),
    0
  )
}

export function StatsBar() {
  const [stats, setStats] = useState<Stat[]>(initial)

  useEffect(() => {
    if (typeof chrome === "undefined") return

    if (chrome.tabs) {
      chrome.tabs.query({}, (tabs) =>
        setStats((prev) => prev.map((s, i) => (i === 0 ? { ...s, value: tabs.length } : s)))
      )
    }

    if (chrome.bookmarks) {
      chrome.bookmarks.getTree((tree) =>
        setStats((prev) =>
          prev.map((s, i) => (i === 1 ? { ...s, value: countBookmarks(tree) } : s))
        )
      )
    }

    if (chrome.history) {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)
      chrome.history.search(
        { text: "", startTime: startOfDay.getTime(), maxResults: 1000 },
        (results) =>
          setStats((prev) =>
            prev.map((s, i) => (i === 2 ? { ...s, value: results.length } : s))
          )
      )
    }

    if (chrome.downloads) {
      chrome.downloads.search({ limit: 1000, orderBy: ["-startTime"] }, (items) =>
        setStats((prev) => prev.map((s, i) => (i === 3 ? { ...s, value: items.length } : s)))
      )
    }

    if (chrome.topSites) {
      chrome.topSites.get((sites) =>
        setStats((prev) => prev.map((s, i) => (i === 4 ? { ...s, value: sites.length } : s)))
      )
    }
  }, [])

  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3 hover:border-border/80 transition-colors"
        >
          <div className={stat.accent}>{stat.icon}</div>
          <div>
            {stat.value === null
              ? <Skeleton className="h-7 w-10 mb-1" />
              : <div className="text-2xl font-semibold tabular-nums leading-none">{stat.value}</div>
            }
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
