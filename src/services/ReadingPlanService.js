import { StorageService } from './StorageService';

const PLAN_KEY = 'reading_plan_progress';

// Mock Plan Data
const generatePlan = () => {
  const books = [
    'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio', 'Josué',
    'Juízes', 'Rute', '1 Samuel', '2 Samuel', '1 Reis', '2 Reis',
    '1 Crônicas', '2 Crônicas', 'Esdras', 'Neemias', 'Ester', 'Jó',
    'Salmos', 'Provérbios', 'Eclesiastes', 'Cantares', 'Isaías', 'Jeremias'
  ];
  
  // Simple generator for demonstration
  return Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i); // This logic needs to be fixed relative to start of year usually, but standard plan starts Jan 1
    
    // Determine book based on day (roughly)
    const bookIndex = Math.floor(i / 15) % books.length;
    
    return {
      day: i + 1,
      book: books[bookIndex],
      chapters: '1-3',
      description: `Leitura do dia ${i + 1}`
    };
  });
};

const FULL_PLAN = generatePlan();

export const ReadingPlanService = {
  getPlan: () => FULL_PLAN,
  
  getProgress: () => {
    return StorageService.get(PLAN_KEY, {});
  },
  
  markComplete: (day) => {
    const progress = ReadingPlanService.getProgress();
    progress[day] = {
      completed: true,
      timestamp: new Date().toISOString()
    };
    StorageService.set(PLAN_KEY, progress);
    return progress;
  },

  getStats: () => {
    const progress = ReadingPlanService.getProgress();
    const completedDays = Object.keys(progress).length;
    const totalDays = 365;
    const percentage = Math.round((completedDays / totalDays) * 100);
    
    return {
      completedDays,
      totalDays,
      percentage
    };
  }
};
