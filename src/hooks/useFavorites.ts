'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pureblend_favorites_v1';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFavoriteIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  const toggleFavorite = (productId: string) => {
    try {
      let updated: string[];
      if (favoriteIds.includes(productId)) {
        updated = favoriteIds.filter((id) => id !== productId);
      } else {
        updated = [...favoriteIds, productId];
      }
      setFavoriteIds(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update favorites in localStorage', e);
    }
  };

  return { favoriteIds, isFavorite, toggleFavorite, isLoaded };
}
