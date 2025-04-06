"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { BookmarkIcon, HistoryIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FaGoogle, FaYoutube, FaGithub, FaTwitter, FaReddit } from "react-icons/fa" // Add these imports for the icons

// Popular websites with their respective icons
const popularWebsites = [
  { title: "Google", url: "https://google.com", icon: <FaGoogle className="text-lg" /> },
  { title: "YouTube", url: "https://youtube.com", icon: <FaYoutube className="text-lg" /> },
  { title: "GitHub", url: "https://github.com", icon: <FaGithub className="text-lg" /> },
  { title: "Twitter", url: "https://twitter.com", icon: <FaTwitter className="text-lg" /> },
  { title: "Reddit", url: "https://reddit.com", icon: <FaReddit className="text-lg" /> },
]

type Suggestion = {
  text: string
  url?: string
  type: "search" | "history" | "bookmark" | "popular"
  icon: React.ReactNode
}

export function Search() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    const lowerQuery = query.toLowerCase()
    const newSuggestions: Suggestion[] = []

    const fetchBookmarks = new Promise<void>((resolve) => {
      if (chrome.bookmarks) {
        chrome.bookmarks.search(query, (results) => {
          results.slice(0, 3).forEach((bookmark) => {
            newSuggestions.push({
              text: bookmark.title,
              url: bookmark.url,
              type: "bookmark",
              icon: <BookmarkIcon className="text-lg" />,
            })
          })
          resolve()
        })
      } else {
        resolve()
      }
    })

    const fetchHistory = new Promise<void>((resolve) => {
      if (chrome.history) {
        chrome.history.search({ text: query, maxResults: 100 }, (results) => {
          results.forEach((item) => {
            newSuggestions.push({
              text: item.title || "Untitled",
              url: item.url,
              type: "history",
              icon: <HistoryIcon className="text-lg" />,
            })
          })
          resolve()
        })
      } else {
        resolve()
      }
    })

    // Fetch bookmarks and history in parallel
    Promise.all([fetchBookmarks, fetchHistory]).then(() => {
      // Add matching popular websites
      popularWebsites
        .filter(
          (website) => website.title.toLowerCase().includes(lowerQuery) || website.url.toLowerCase().includes(lowerQuery),
        )
        .slice(0, 3)
        .forEach((website) => {
          newSuggestions.push({
            text: website.title,
            url: website.url,
            type: "popular",
            icon: website.icon,
          })
        })

      // Add Unduck bangs
      const words = query.split(" ")
      const lastWord = words[words.length - 1]
      if (lastWord.startsWith("!")) {
        newSuggestions.unshift({
          text: `Search with Unduck: ${query}`,
          url: `https://s.dunkirk.sh?q=${encodeURIComponent(query)}`,
          type: "search",
          icon: <SearchIcon className="text-lg" />,
        })
      }

      setSuggestions(newSuggestions)
      setIsOpen(newSuggestions.length > 0)
      setSelectedIndex(-1)
    })

    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard navigation
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
    } else if (e.key === "Escape") {
      setIsOpen(false)
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleSearch(e)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      // Use the selected suggestion
      const selected = suggestions[selectedIndex]
      if (selected.url) {
        window.open(selected.url, "_blank")
      } else {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(selected.text)}`, "_blank")
      }
    } else if (query.trim()) {
      // Determine if the query looks like a URL
      if (query.includes(".") && !query.includes(" ")) {
        let url = query
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = `https://${url}`
        }
        window.open(url, "_blank")
      } else {
        // Treat as a search query
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank")
      }
    }

    setIsOpen(false)
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.url) {
      window.open(suggestion.url, "_blank")
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(suggestion.text)}`, "_blank")
    }
    setIsOpen(false)
  }

  return (
    <div className="w-full max-w-2xl relative">
      <form onSubmit={handleSearch} className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search Google or type a URL"
          className="h-12 pl-4 pr-12 text-base rounded-full border-2 border-gray-200 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-blue-500 focus-visible:border-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full hover:bg-gray-100"
        >
          <SearchIcon className="h-5 w-5 text-gray-500" />
        </Button>
      </form>

      {isOpen && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10"
        >
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.type}-${index}`}
                className={`px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-50 h-14 ${index === selectedIndex ? "bg-gray-100" : ""
                  }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">{suggestion.icon}</div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-sm truncate font-medium">{suggestion.text}</p>
                  {suggestion.url && suggestion.type !== "search" ? (
                    <p className="text-xs text-gray-500 truncate">{suggestion.url}</p>
                  ) : (
                    <div className="h-4">{/* Empty div to maintain consistent height */}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
