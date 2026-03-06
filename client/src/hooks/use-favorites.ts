import { useState, useEffect, useCallback } from "react";

export interface FavoriteItem {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  color: string;
}

const FAVORITES_KEY = "calchub_favorites";
const RECENT_KEY = "calchub_recent";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addFavorite = useCallback((item: FavoriteItem) => {
    setFavorites((prev) => {
      if (prev.find((f) => f.id === item.id)) return prev;
      const next = [...prev, item];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.id !== id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === item.id);
      const next = exists ? prev.filter((f) => f.id !== item.id) : [...prev, item];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => {
    return favorites.some((f) => f.id === id);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite };
}

export interface RecentItem {
  id: string;
  title: string;
  description: string;
  href: string;
  category: string;
  color: string;
  visitedAt: number;
}

export function useRecent() {
  const [recent, setRecent] = useState<RecentItem[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addRecent = useCallback((item: Omit<RecentItem, "visitedAt">) => {
    setRecent((prev) => {
      const filtered = prev.filter((r) => r.id !== item.id);
      const next = [{ ...item, visitedAt: Date.now() }, ...filtered].slice(0, 10);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recent, addRecent };
}
