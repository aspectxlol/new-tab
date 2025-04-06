"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Define a type for a Chrome bookmark node with a URL.
interface BookmarkNode {
  id: string;
  parentId?: string;
  title: string;
  url?: string;
  children?: BookmarkNode[];
}

// Helper function to recursively flatten the bookmarks tree.
const flattenBookmarks = (nodes: BookmarkNode[]): BookmarkNode[] => {
  let flat: BookmarkNode[] = [];
  nodes.forEach((node) => {
    if (node.url) {
      flat.push(node);
    }
    if (node.children) {
      flat = flat.concat(flattenBookmarks(node.children));
    }
  });
  return flat;
};

export function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkNode[]>([]);
  const [showAll, setShowAll] = useState(false); // State to toggle the "See all" button functionality

  useEffect(() => {
    // Check if the chrome.bookmarks API is available.
    if (chrome && chrome.bookmarks) {
      chrome.bookmarks.getTree((bookmarkTreeNodes: BookmarkNode[]) => {
        const flatBookmarks = flattenBookmarks(bookmarkTreeNodes);
        setBookmarks(flatBookmarks);
      });
    }
  }, []);

  // Remove bookmark both from Chrome's store and local state.
  const removeBookmark = (id: string) => {
    if (chrome && chrome.bookmarks) {
      chrome.bookmarks.remove(id, () => {
        setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
      });
    }
  };

  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-gray-500" />
            <span>Bookmarks</span>
          </div>
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={() => setShowAll(!showAll)} // Toggle the state to show all bookmarks or not
        >
          {showAll ? "Show less" : "See all"}
        </Button>
      </CardHeader>
      <CardContent className="pb-3">
        {bookmarks.length === 0 ? (
          <p className="text-sm text-gray-500 w-full text-center">No bookmarks found</p>
        ) : (
          <div className="space-y-3">
            {(showAll ? bookmarks : bookmarks.slice(0, 4)).map((bookmark) => (
              <div key={bookmark.id} className="flex items-start justify-between">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 hover:underline"
                >
                  <div className="mt-0.5 h-8 w-8 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url as string).hostname}&sz=32`}
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
                    <p className="line-clamp-1 text-sm font-medium">{bookmark.title}</p>
                    <p className="line-clamp-1 text-xs text-gray-500">
                      {bookmark.url}
                    </p>
                  </div>
                </a>
                <div className="ml-2 flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => removeBookmark(bookmark.id)}>
                        Remove bookmark
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit bookmark</DropdownMenuItem>
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
