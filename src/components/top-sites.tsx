import { useEffect, useState } from "react"
import { Globe } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type Site = { title: string; url: string }

export function TopSites() {
  const [sites, setSites] = useState<Site[] | null>(null)

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.topSites) {
      chrome.topSites.get((results) => setSites(results.slice(0, 10)))
    } else {
      setSites([])
    }
  }, [])

  if (sites !== null && sites.length === 0) return null

  return (
    <div className="bg-card border border-border rounded-xl px-5 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-4 w-4 text-pink-400" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
          Top Sites
        </span>
      </div>
      {sites === null ? (
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 px-3 py-2 w-20">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {sites.map((site) => {
            let hostname = site.url
            try {
              hostname = new URL(site.url).hostname
            } catch {
              /* keep original */
            }
            return (
              <a
                key={site.url}
                href={site.url}
                className="flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-accent transition-colors w-20 group"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=32`}
                    alt=""
                    className="w-6 h-6"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground truncate w-full text-center leading-tight">
                  {site.title}
                </span>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
