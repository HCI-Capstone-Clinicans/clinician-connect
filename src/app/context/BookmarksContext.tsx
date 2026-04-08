import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface BookmarkedProject {
  id: string;
  name: string;
  lab: string;
  location: string;
  tags: string[];
  matchPercentage: number;
}

interface BookmarksContextType {
  bookmarks: BookmarkedProject[];
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (project: BookmarkedProject) => void;
}

const BookmarksContext = createContext<BookmarksContextType | null>(null);

const STORAGE_KEY = "cc_bookmarked_projects";

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkedProject[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = (id: string) => bookmarks.some((b) => b.id === id);

  const toggleBookmark = (project: BookmarkedProject) => {
    setBookmarks((prev) =>
      isBookmarked(project.id)
        ? prev.filter((b) => b.id !== project.id)
        : [project, ...prev]
    );
  };

  return (
    <BookmarksContext.Provider value={{ bookmarks, isBookmarked, toggleBookmark }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error("useBookmarks must be used inside BookmarksProvider");
  return ctx;
}
