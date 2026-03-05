import { TrendingUp } from "lucide-react"

type ChartEntry = {
  symbol: string
  label: string
  lineColor: string
  fillColor: string
}

type Section = {
  title: string
  charts: ChartEntry[]
}

const SECTIONS: Section[] = [
  {
    title: "Crypto",
    charts: [
      { symbol: "BTCIDR", label: "BTC / IDR", lineColor: "rgba(247,147,26,1)", fillColor: "rgba(247,147,26,0.12)" },
      { symbol: "BINANCE:ETHUSDT", label: "ETH / USDT", lineColor: "rgba(98,126,234,1)", fillColor: "rgba(98,126,234,0.12)" },
      { symbol: "BINANCE:SOLUSDT", label: "SOL / USDT", lineColor: "rgba(20,241,149,1)", fillColor: "rgba(20,241,149,0.12)" },
    ],
  },
  {
    title: "Forex & Commodities",
    charts: [
      { symbol: "FX_IDC:XAUIDRG", label: "XAU / IDR", lineColor: "rgba(255,215,0,1)", fillColor: "rgba(255,215,0,0.12)" },
      { symbol: "FX_IDC:XAGIDRG", label: "XAG / IDR", lineColor: "rgba(192,192,192,1)", fillColor: "rgba(192,192,192,0.12)" },
      { symbol: "FX:EURUSD", label: "EUR / USD", lineColor: "rgba(100,200,255,1)", fillColor: "rgba(100,200,255,0.12)" },
      { symbol: "USDIDR", label: "USD / IDR", lineColor: "rgba(80,220,140,1)", fillColor: "rgba(80,220,140,0.12)" },
    ],
  },
  {
    title: "US Stocks",
    charts: [
      { symbol: "NASDAQ:AAPL", label: "Apple", lineColor: "rgba(200,200,200,1)", fillColor: "rgba(200,200,200,0.12)" },
      { symbol: "NASDAQ:NVDA", label: "NVIDIA", lineColor: "rgba(118,185,0,1)", fillColor: "rgba(118,185,0,0.12)" },
      { symbol: "NASDAQ:TSLA", label: "Tesla", lineColor: "rgba(230,57,70,1)", fillColor: "rgba(230,57,70,0.12)" },
      { symbol: "NYSE:BRK.B", label: "Berkshire B", lineColor: "rgba(180,140,80,1)", fillColor: "rgba(180,140,80,0.12)" },
    ],
  },
]

function MiniChart({
  symbol,
  lineColor,
  fillColor,
}: {
  symbol: string
  lineColor: string
  fillColor: string
}) {
  const config = JSON.stringify({
    symbol,
    width: "100%",
    height: 200,
    locale: "en",
    dateRange: "3M",
    colorTheme: "dark",
    trendLineColor: lineColor,
    underLineColor: fillColor,
    isTransparent: true,
    autosize: true,
  })

  const src = `https://s.tradingview.com/embed-widget/mini-symbol-overview/?locale=en#${encodeURIComponent(config)}`

  return (
    <iframe
      src={src}
      width="100%"
      height="200"
      frameBorder="0"
      allowTransparency
      scrolling="no"
      className="block w-full"
    />
  )
}

export function TradingView() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <TrendingUp className="h-4 w-4 text-emerald-400" />
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
          Markets
        </span>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {SECTIONS.map((section, si) => (
          <div key={section.title}>
            <div className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 bg-muted/20 ${si > 0 ? "border-t border-border" : ""}`}>
              {section.title}
            </div>
            <div className="divide-y divide-border">
              {section.charts.map((c) => (
                <div key={c.symbol}>
                  <div className="px-4 pt-2 text-xs text-muted-foreground font-medium">{c.label}</div>
                  <MiniChart symbol={c.symbol} lineColor={c.lineColor} fillColor={c.fillColor} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
