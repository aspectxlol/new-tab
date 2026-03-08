import { useState, useEffect } from "react"
import { Wind, Droplets, Eye, Gauge, Sun, Thermometer } from "lucide-react"

const OWM_API_KEY = "cd4769e4f837607a34018a3bae769a40" // paste your OpenWeatherMap API key here
const CACHE_KEY = "weather_cache"
const CACHE_TTL = 2 * 60 * 60 * 1000 // 2 hours

interface WeatherData {
  temp: number
  feels_like: number
  description: string
  icon: string
  wind_speed: number
  wind_deg: number
  humidity: number
  visibility: number
  pressure: number
  uvi: number
  dew_point: number
}

interface CachedWeather {
  data: WeatherData
  timestamp: number
}

function degToDir(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  return dirs[Math.round(deg / 45) % 8]
}

async function fetchWeather(): Promise<WeatherData> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords
          const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,daily,alerts&appid=${OWM_API_KEY}`
          const res = await fetch(url)
          if (!res.ok) throw new Error(`API error: ${res.status}`)
          const json = await res.json()
          resolve({
            temp: Math.round(json.current.temp),
            feels_like: Math.round(json.current.feels_like),
            description: json.current.weather[0].description
              .split(" ")
              .map((w: string) => w[0].toUpperCase() + w.slice(1))
              .join(" "),
            icon: json.current.weather[0].icon,
            wind_speed: Math.round(json.current.wind_speed),
            wind_deg: json.current.wind_deg,
            humidity: json.current.humidity,
            visibility: Math.round(json.current.visibility / 1000),
            pressure: json.current.pressure,
            uvi: Math.round(json.current.uvi),
            dew_point: Math.round(json.current.dew_point),
          })
        } catch (e) {
          reject(e)
        }
      },
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000 }
    )
  })
}

function getCached(): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const cached: CachedWeather = JSON.parse(raw)
    if (Date.now() - cached.timestamp > CACHE_TTL) return null
    return cached.data
  } catch {
    return null
  }
}

function setCache(data: WeatherData) {
  const entry: CachedWeather = { data, timestamp: Date.now() }
  localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
}

const DETAIL_ITEMS = [
  { key: "wind", label: "Wind", icon: Wind, format: (d: WeatherData) => `${d.wind_speed} m/s ${degToDir(d.wind_deg)}` },
  { key: "humidity", label: "Humidity", icon: Droplets, format: (d: WeatherData) => `${d.humidity}%` },
  { key: "visibility", label: "Visibility", icon: Eye, format: (d: WeatherData) => `${d.visibility}km` },
  { key: "pressure", label: "Pressure", icon: Gauge, format: (d: WeatherData) => `${d.pressure} hPa` },
  { key: "uvi", label: "UV Index", icon: Sun, format: (d: WeatherData) => `${d.uvi} UV` },
  { key: "dew_point", label: "Dew Point", icon: Thermometer, format: (d: WeatherData) => `${d.dew_point}°C` },
] as const

export function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(getCached)
  const [time, setTime] = useState(() => new Date())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cached = getCached()
    if (cached) {
      setWeather(cached)
    } else {
      fetchWeather()
        .then((data) => {
          setWeather(data)
          setCache(data)
        })
        .catch((e) => setError(e.message))
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }).toUpperCase()

  if (error && !weather) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 text-center text-sm text-muted-foreground">
        Weather unavailable: {error}
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-card border border-border shadow-sm">
      {/* Hero section with sky background */}
      <div className="relative h-48 overflow-hidden">
        {weather ? (
          <img
            src={`https://source.unsplash.com/800x400/?${encodeURIComponent(weather.description + " sky")}`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = "none"
            }}
          />
        ) : null}
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10" />

        {/* Time badge */}
        <div className="absolute top-4 right-4 text-white/90 text-sm font-medium tracking-wide">
          {timeStr}
        </div>

        {/* Temperature & description */}
        {weather ? (
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="flex items-start gap-1">
              <span className="text-5xl font-bold text-white leading-none">{weather.temp}°</span>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold text-base">{weather.description}</div>
              <div className="text-white/75 text-sm">Feels like {weather.feels_like}°</div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-white/60 text-sm">Loading weather…</div>
          </div>
        )}
      </div>

      {/* Detail grid */}
      {weather && (
        <div className="grid grid-cols-3 gap-2 p-3">
          {DETAIL_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.key}
                className="flex flex-col items-center gap-1 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 py-3 px-2"
              >
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{item.format(weather)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
