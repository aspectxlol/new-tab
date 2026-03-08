import { useState, useEffect } from "react"
import { Newspaper, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const CACHE_KEY = "news_cache"
const CACHE_TTL = 2 * 60 * 60 * 1000 // 2 hours
const RSS_URL = "https://news.google.com/rss?hl=en&gl=US&ceid=US:en"

interface NewsItem {
  title: string
  link: string
  source: string
  pubDate: string
}

interface CachedNews {
  items: NewsItem[]
  timestamp: number
}

function getCached(): NewsItem[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached: CachedNews = JSON.parse(raw)
    if (Date.now() - cached.timestamp > CACHE_TTL) return null
    return cached.items
  } catch {
    return null
  }
}

function setCache(items: NewsItem[]) {
  const entry: CachedNews = { items, timestamp: Date.now() }
  localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch(RSS_URL)
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)
  const text = await res.text()
  const parser = new DOMParser()
  const xml = parser.parseFromString(text, "text/xml")
  const items = xml.querySelectorAll("item")
  const result: NewsItem[] = []
  items.forEach((item) => {
    const title = item.querySelector("title")?.textContent ?? ""
    const link = item.querySelector("link")?.textContent ?? ""
    const source = item.querySelector("source")?.textContent ?? ""
    const pubDate = item.querySelector("pubDate")?.textContent ?? ""
    result.push({ title, link, source, pubDate })
  })
  return result
}

export function News() {
  const [news, setNews] = useState<NewsItem[] | null>(getCached)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cached = getCached()
    if (cached) {
      setNews(cached)
      return
    }
    fetchNews()
      .then((items) => {
        setNews(items)
        setCache(items)
      })
      .catch((e) => setError(e.message))
  }, [])

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-rose-400" />
            <span>News</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-y-auto pb-3">
        {error && !news && (
          <p className="text-sm text-muted-foreground text-center py-4">
            News unavailable: {error}
          </p>
        )}

        {news === null && !error && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        )}

        {news && (
          <div className="space-y-1">
            {news.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-lg p-2 -mx-2 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      {item.source && <span>{item.source}</span>}
                      {item.source && item.pubDate && <span>·</span>}
                      {item.pubDate && <span>{timeAgo(item.pubDate)}</span>}
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
