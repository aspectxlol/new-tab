import { Search } from "@/components/search"
import { History } from "@/components/history"
import { Bookmarks } from "@/components/bookmarks"
import { Greeting } from "@/components/greeting"
import { StatsBar } from "@/components/stats-bar"
import { TopSites } from "@/components/top-sites"
import { Downloads } from "@/components/downloads"
import { QuickNotes } from "@/components/quick-notes"
import { TodoList } from "@/components/todo-list"
import { WorldClocks } from "@/components/world-clocks"
import { TradingView } from "@/components/trading-view"

export default function Home() {
  return (
    <div className="min-h-screen text-foreground">
      <div className="max-w-[1800px] mx-auto px-6 pb-8 space-y-4">

        {/* Hero: big clock + date */}
        <Greeting />

        {/* Search */}
        <div className="flex justify-center">
          <Search />
        </div>

        {/* KPI stats strip */}
        <StatsBar />

        {/* Top sites */}
        <TopSites />

        {/* Main 3-column grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-[720px]">
          {/* Left column */}
          <div className="flex flex-col gap-4 min-h-0">
            <Bookmarks />
            <div className="flex-1 min-h-0">
              <Downloads />
            </div>
          </div>

          {/* Center column */}
          <div className="flex flex-col gap-4 min-h-0">
            <History />
            <div className="flex-1 min-h-0">
              <QuickNotes />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col min-h-0">
            <TradingView />
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <TodoList />
          <WorldClocks />
        </div>

      </div>
    </div>
  )
}
