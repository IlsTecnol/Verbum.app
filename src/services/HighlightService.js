import { StorageService } from './StorageService';

const HIGHLIGHTS_KEY = 'user_highlights';

export const HighlightService = {
  getHighlights: () => {
    return StorageService.get(HIGHLIGHTS_KEY, {});
  },

  saveHighlight: (verseId, data) => {
    // data: { color, note, tags, book, chapter, verseNumber, text }
    const highlights = HighlightService.getHighlights();
    
    highlights[verseId] = {
      ...highlights[verseId],
      ...data,
      timestamp: new Date().toISOString()
    };
    
    StorageService.set(HIGHLIGHTS_KEY, highlights);
    return highlights[verseId];
  },

  removeHighlight: (verseId) => {
    const highlights = HighlightService.getHighlights();
    delete highlights[verseId];
    StorageService.set(HIGHLIGHTS_KEY, highlights);
  },

  getHighlight: (verseId) => {
    const highlights = HighlightService.getHighlights();
    return highlights[verseId];
  }
};
