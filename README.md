# New Tab

A feature-rich Chrome extension that replaces your new tab page with a productivity dashboard. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Clock & Greeting** — Large clock with seconds, formatted date, and time-based greeting
- **Smart Search** — Autocomplete search bar pulling suggestions from bookmarks, history, and popular sites
- **Stats Bar** — At-a-glance KPIs: open tabs, total bookmarks, today's history items, downloads, and top sites
- **Top Sites** — Quick access to your most-visited websites
- **Bookmarks** — Searchable, flattened view of all saved bookmarks
- **History** — Recent browsing history with delete capability
- **Downloads** — Active and recent downloads with status indicators and file sizes
- **Quick Notes** — Lightweight text area that auto-saves to localStorage
- **Todo List** — Google Tasks integration via OAuth2 for synced task management
- **World Clocks** — Real-time clocks for New York, London, Berlin, Dubai, Tokyo, and Sydney
- **Markets** — Embedded TradingView charts for crypto, forex, commodities, and US stocks
- **Weather** — Current conditions from OpenWeatherMap with 2-hour caching (temperature, wind, humidity, visibility, pressure, dew point)
- **News** — Google News RSS headlines with source attribution and relative timestamps

## Screenshots

<!-- Add screenshots here -->

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Yarn](https://yarnpkg.com/) 1.x

### Installation

```bash
git clone https://github.com/your-username/new-tab.git
cd new-tab
yarn install
```

### Configuration

1. **OpenWeatherMap API Key** — Get a free key from [openweathermap.org](https://openweathermap.org/api) and paste it in `src/components/weather.tsx`:
   ```ts
   const OWM_API_KEY = "your-key-here"
   ```

2. **Google Tasks OAuth2** — The extension uses OAuth2 for Google Tasks. The client ID is configured in `vite.config.ts`. To use your own, create credentials in the [Google Cloud Console](https://console.cloud.google.com/) with the `https://www.googleapis.com/auth/tasks` scope.

### Development

```bash
yarn dev        # Start Vite dev server
yarn watch      # Build in watch mode (for extension testing)
yarn build      # Production build (TypeScript + Vite)
yarn lint       # Run ESLint
```

### Load in Chrome

1. Run `yarn build`
2. Open `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `dist/` folder
5. Open a new tab

### Release

To create a new release:

```bash
git tag v1.0.0
git push origin v1.0.0
```

A GitHub Actions workflow will automatically build the extension, package it as a zip file (`new-tab-v1.0.0.zip`), and create a GitHub Release with auto-generated release notes. The zip can be loaded directly in Chrome or uploaded to the Chrome Web Store.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.7 |
| Build | Vite 6 + CRXJS (Manifest V3) |
| Styling | Tailwind CSS 4 (OKLCh color system) |
| UI Components | Radix UI primitives |
| Icons | Lucide React, React Icons |
| Font | DM Mono (Google Fonts) |

## Chrome Permissions

| Permission | Purpose |
|-----------|---------|
| `history` | Browse recent history |
| `bookmarks` | Read all bookmarks |
| `tabs` | Count open tabs |
| `downloads` | Monitor download status |
| `topSites` | Fetch most-visited sites |
| `identity` | Google OAuth2 for Tasks |
| `host_permissions: news.google.com` | Fetch Google News RSS |

## Project Structure

```
src/
├── App.tsx                  # Main layout
├── main.tsx                 # React entry point
├── global.css               # Tailwind + theme variables
├── components/
│   ├── greeting.tsx         # Clock & greeting
│   ├── search.tsx           # Autocomplete search
│   ├── stats-bar.tsx        # KPI strip
│   ├── top-sites.tsx        # Most-visited sites
│   ├── bookmarks.tsx        # Bookmark browser
│   ├── history.tsx          # Recent history
│   ├── downloads.tsx        # Download manager
│   ├── quick-notes.tsx      # Auto-saving notes
│   ├── todo-list.tsx        # Google Tasks
│   ├── world-clocks.tsx     # Multi-timezone clocks
│   ├── trading-view.tsx     # Financial charts
│   ├── weather.tsx          # Weather widget
│   ├── news.tsx             # News feed
│   └── ui/                  # Reusable UI primitives
└── lib/
    └── utils.ts             # Utility functions
```

## License

MIT
- [ ] actual server stats
- [ ] better search engine support for bangs in the search bar

## to use: 
```
yarn build
```
then go to chrome://extensions, click `load unpacked` and pick the `/dist` folder
