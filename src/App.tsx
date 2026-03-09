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
import { Weather } from "@/components/weather"
import { News } from "@/components/news"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
// Import SECTIONS from TradingView for chart list
import { SECTIONS as TRADING_SECTIONS } from "@/components/trading-view"
import { Settings } from "lucide-react"


export default function App() {
  // Default config
  type TradingChartsConfig = { [symbol: string]: boolean };
  interface TodoListConfig {
    showCompleted: boolean;
    sortOrder: "asc" | "desc";
  }
  interface WorldClocksConfig {
    zones: string[];
  }
  interface WeatherConfig {
    units: "C" | "F";
    location: string;
  }
  interface NewsConfig {
    sources: string[];
    topics: string[];
  }
  interface DashboardConfig {
    greeting: boolean;
    search: boolean;
    statsBar: boolean;
    topSites: boolean;
    bookmarks: boolean;
    downloads: boolean;
    history: boolean;
    quickNotes: boolean;
    tradingView: boolean;
    tradingCharts: TradingChartsConfig;
    todoList: boolean;
    todoListConfig: TodoListConfig;
    worldClocks: boolean;
    worldClocksConfig: WorldClocksConfig;
    weather: boolean;
    weatherConfig: WeatherConfig;
    news: boolean;
    newsConfig: NewsConfig;
  }

  const defaultConfig: DashboardConfig = {
    greeting: true,
    search: true,
    statsBar: true,
    topSites: true,
    bookmarks: true,
    downloads: true,
    history: true,
    quickNotes: true,
    tradingView: true,
    tradingCharts: (() => {
      const charts: TradingChartsConfig = {};
      TRADING_SECTIONS.forEach(section => {
        section.charts.forEach(chart => {
          charts[chart.symbol] = true;
        });
      });
      return charts;
    })(),
    todoList: true,
    todoListConfig: { showCompleted: true, sortOrder: "asc" },
    worldClocks: true,
    worldClocksConfig: { zones: ["America/New_York", "Europe/London", "Asia/Tokyo"] },
    weather: true,
    weatherConfig: { units: "C", location: "New York" },
    news: true,
    newsConfig: { sources: ["BBC", "CNN"], topics: ["Technology", "World"] },
  };

  // Load config from localStorage
  const [config, setConfig] = useState<DashboardConfig>(() => {
    try {
      const raw = localStorage.getItem("dashboard_config");
      if (raw) return { ...defaultConfig, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return defaultConfig;
  });

  // Save config to localStorage on change
  useEffect(() => {
    localStorage.setItem("dashboard_config", JSON.stringify(config));
  }, [config]);

  return (
    <div className="min-h-screen text-foreground bg-linear-to-b from-background via-background to-[oklch(0.07_0.02_255)] animate-in fade-in-0">
      <div className="max-w-450 mx-auto px-6 pb-8 space-y-4">
        {/* Config button */}
        <div className="flex justify-end pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" /> Configure
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Widgets</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={config.greeting}
                onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, greeting: !!v }))}
              >
                Greeting
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={config.search}
                onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, search: !!v }))}
              >
                Search
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={config.statsBar}
                onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, statsBar: !!v }))}
              >
                Stats Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={config.topSites}
                onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, topSites: !!v }))}
              >
                Top Sites
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={config.bookmarks}
                onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, bookmarks: !!v }))}
              >
                Bookmarks
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={config.downloads}
                onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, downloads: !!v }))}
              >
                Downloads
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={config.history}
                onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, history: !!v }))}
              >
                History
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={config.quickNotes}
                onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, quickNotes: !!v }))}
              >
                Quick Notes
              </DropdownMenuCheckboxItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  TradingView
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={config.tradingView}
                    onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, tradingView: !!v }))}
                  >
                    Show TradingView
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuLabel>Charts</DropdownMenuLabel>
                  {TRADING_SECTIONS.map(section => (
                    <div key={section.title}>
                      <div className="px-2 pt-2 pb-1 text-xs text-muted-foreground font-semibold">
                        {section.title}
                      </div>
                      {section.charts.map(chart => (
                        <DropdownMenuCheckboxItem
                          key={chart.symbol}
                          checked={config.tradingCharts[chart.symbol]}
                          onCheckedChange={v => setConfig((c: DashboardConfig) => ({
                            ...c,
                            tradingCharts: { ...c.tradingCharts, [chart.symbol]: !!v }
                          }))}
                        >
                          {chart.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Todo List</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={config.todoList}
                    onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, todoList: !!v }))}
                  >
                    Show Todo List
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={config.todoListConfig.showCompleted}
                    onCheckedChange={v => setConfig((c: DashboardConfig) => ({
                      ...c,
                      todoListConfig: { ...c.todoListConfig, showCompleted: !!v }
                    }))}
                  >
                    Show Completed
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={config.todoListConfig.sortOrder === "asc"}
                    onCheckedChange={v => setConfig((c: DashboardConfig) => ({
                      ...c,
                      todoListConfig: { ...c.todoListConfig, sortOrder: v ? "asc" : "desc" }
                    }))}
                  >
                    Sort Ascending
                  </DropdownMenuCheckboxItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>World Clocks</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={config.worldClocks}
                    onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, worldClocks: !!v }))}
                  >
                    Show World Clocks
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  {/* Example: show zones as comma-separated string */}
                  <DropdownMenuCheckboxItem disabled>
                    Zones: {config.worldClocksConfig.zones.join(", ")}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Weather</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={config.weather}
                    onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, weather: !!v }))}
                  >
                    Show Weather
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={config.weatherConfig.units === "C"}
                    onCheckedChange={v => setConfig((c: DashboardConfig) => ({
                      ...c,
                      weatherConfig: { ...c.weatherConfig, units: v ? "C" : "F" }
                    }))}
                  >
                    Celsius
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem disabled>
                    Location: {config.weatherConfig.location}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>News</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={config.news}
                    onCheckedChange={v => setConfig((c: DashboardConfig) => ({ ...c, news: !!v }))}
                  >
                    Show News
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuCheckboxItem disabled>
                    Sources: {config.newsConfig.sources.join(", ")}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem disabled>
                    Topics: {config.newsConfig.topics.join(", ")}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setConfig(defaultConfig)}
              >
                Reset to Default
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Hero: big clock + date */}
        {config.greeting && <Greeting />}

        {/* Search */}
        {config.search && (
          <div className="flex justify-center">
            <Search />
          </div>
        )}

        {/* KPI stats strip */}
        {config.statsBar && <StatsBar />}

        {/* Top sites */}
        {config.topSites && <TopSites />}


        {/* Main grid: dynamically fill columns */}
        {(() => {
          // Build a flat array of enabled widgets for the main grid
          const mainWidgets = [
            config.bookmarks ? <Bookmarks key="bookmarks" /> : null,
            config.downloads ? <Downloads key="downloads" /> : null,
            config.tradingView ? <TradingView key="tradingview" enabledCharts={config.tradingCharts} /> : null,
            config.quickNotes ? <QuickNotes key="quicknotes" /> : null,
            config.history ? <History key="history" /> : null,
          ].filter(Boolean);

          // 3 columns on large screens, 1 on mobile
          const columns = 3;
          // rows variable removed (not needed)
          // Fill row-wise (left-to-right)
          const grid: React.ReactNode[][] = Array.from({ length: columns }, () => []);
          mainWidgets.forEach((widget, i) => {
            grid[i % columns].push(widget!);
          });

          return (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-[720px]">
              {grid.map((col, i) => (
                <div className="flex flex-col gap-4 min-h-0" key={i}>
                  {col}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Bottom row: dynamically fill columns */}
        {(() => {
          const bottomWidgets = [
            config.todoList ? <TodoList key="todo" /> : null,
            config.worldClocks ? <WorldClocks key="clocks" /> : null,
            config.weather ? <Weather key="weather" /> : null,
            config.news ? <News key="news" /> : null,
          ].filter(Boolean);
          return (
            <div className={`grid grid-cols-1 gap-4 lg:grid-cols-${bottomWidgets.length}`}>
              {bottomWidgets}
            </div>
          );
        })()}

      </div>
    </div>
  )
}
