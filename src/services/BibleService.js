import { StorageService } from './StorageService';

const CACHE_KEY = 'bible_cache';
const API_BASE_URL = 'https://bible-api.com';

export const BibleService = {
  getVerse: async (book, chapter, verse, version = 'almeida') => {
    const cache = StorageService.get(CACHE_KEY, {});
    const key = `${book}_${chapter}_${verse}_${version}`;

    // Check offline or cache
    if (!navigator.onLine || cache[key]) {
      return cache[key];
    }

    try {
      // Map Portuguese book names to English for the API if necessary, 
      // but bible-api.com handles many languages. 
      // Using a simple fetch wrapper.
      const response = await fetch(`${API_BASE_URL}/${book}+${chapter}:${verse}?translation=${version}`);
      
      if (!response.ok) throw new Error('Failed to fetch verse');
      
      const data = await response.json();
      
      // Transform to our internal format
      const verseData = {
        id: key,
        book: book,
        chapter: chapter,
        number: verse,
        text: data.text.trim(),
        version: version,
        timestamp: Date.now()
      };

      // Update cache
      cache[key] = verseData;
      StorageService.set(CACHE_KEY, cache);

      return verseData;
    } catch (error) {
      console.error('Bible API Error:', error);
      // Return cached version if exists, or throw
      if (cache[key]) return cache[key];
      throw error;
    }
  },

  getChapter: async (book, chapter, version = 'almeida') => {
    // This API returns full chapter if verse is omitted
    const cache = StorageService.get(CACHE_KEY, {});
    const key = `${book}_${chapter}_full_${version}`;

    if (!navigator.onLine && cache[key]) return cache[key];

    try {
      const response = await fetch(`${API_BASE_URL}/${book}+${chapter}?translation=${version}`);
      if (!response.ok) throw new Error('Failed to fetch chapter');
      
      const data = await response.json();
      
      const verses = data.verses.map(v => ({
        id: `${book}-${chapter}-${v.verse}`,
        number: v.verse,
        text: v.text.trim(),
        book: book,
        chapter: chapter
      }));

      cache[key] = verses;
      StorageService.set(CACHE_KEY, cache);
      
      return verses;
    } catch (error) {
      if (cache[key]) return cache[key];
      
      // Fallback mock data if API fails completely (e.g. rate limit)
      return Array.from({ length: 20 }, (_, i) => ({
        id: `${book}-${chapter}-${i + 1}`,
        number: i + 1,
        text: `Versículo ${i + 1} do capítulo ${chapter} de ${book} (Modo Offline/Fallback).`,
        book,
        chapter
      }));
    }
  }
};
