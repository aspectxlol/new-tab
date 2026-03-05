import { useEffect, useState } from "react";
import { Clock, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function History() {
  const [history, setHistory] = useState<{ id: number; title: string; url: string }[] | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (chrome.history) {
      chrome.history.search({ text: "", maxResults: 10 }, (results) => {
        setHistory(
          results.map((item, index) => ({
            id: index,
            title: item.title || "Untitled",
            url: item.url || "about:blank",
          }))
        );
      });
    } else {
      setHistory([]);
    }
  }, []);

  const removeItem = (id: number) => {
    setHistory((prev) => prev ? prev.filter((item) => item.id !== id) : prev);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-400" />
            <span>History</span>
          </div>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={() => setShowAll(!showAll)} // Toggle the state to show all or only a few items
        >
          {showAll ? "Show less" : "See all"}
        </Button>
      </CardHeader>
      <CardContent className="pb-3">
        {history === null ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <p className="text-sm text-muted-foreground w-full text-center">No history found</p>
        ) : (
          <div className="space-y-3">
            {(showAll ? history : history.slice(0, 4)).map((item) => (
              <div key={item.id} className="flex items-start justify-between">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:underline"
                >
                  <div className="mt-0.5 h-8 w-8 flex-shrink-0 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=32`}
                      alt=""
                      className="h-4 w-4"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cline x1='7' y1='17' x2='17' y2='7'%3E%3C/line%3E%3Cpolyline points='7 7 17 7 17 17'%3E%3C/polyline%3E%3C/svg%3E";
                        e.currentTarget.className = "h-4 w-4 text-gray-500";
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{item.url}</p>
                  </div>
                </a>
                <div className="ml-2 flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => removeItem(item.id)}>
                        Remove from history
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
