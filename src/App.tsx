import { Search } from "@/components/search"
import { History } from "@/components/history"
import { Bookmarks } from "@/components/bookmarks"
import { ServerResources } from "@/components/server-resources"
import { Greeting } from "@/components/greeting"
import { ServerContainers } from "./components/server-containers"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Greeting />

        <div className="flex justify-center pt-4 pb-4">
          <Search />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Bookmarks />
          <History />
          <ServerResources />
          <ServerContainers />
        </div>
      </div>
    </main>
  )
}

