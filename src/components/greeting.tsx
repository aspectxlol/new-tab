import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function Greeting() {
  const [greeting, setGreeting] = useState("")
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date()
      const hour = now.getHours()

      // Format the current time
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      setCurrentTime(timeString)

      // Set the appropriate greeting based on time of day
      if (hour >= 5 && hour < 12) {
        setGreeting("Good morning, sir")
      } else if (hour >= 12 && hour < 18) {
        setGreeting("Good afternoon, sir")
      } else if (hour >= 18 && hour < 22) {
        setGreeting("Good evening, sir")
      } else {
        setGreeting("Good night, sir")
      }
    }

    // Update immediately
    updateGreeting()

    // Update every minute
    const intervalId = setInterval(updateGreeting, 60000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="text-center py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{greeting}</h1>
      <div className="flex items-center justify-center text-gray-500">
        <Clock className="h-4 w-4 mr-2" />
        <span>{currentTime}</span>
      </div>
    </div>
  )
}

