import { StorageService } from './StorageService';

const OFFLINE_QUEUE_KEY = 'offline_queue';

export const OfflineService = {
  isOnline: () => navigator.onLine,

  addToQueue: (action) => {
    const queue = StorageService.get(OFFLINE_QUEUE_KEY, []);
    queue.push({
      ...action,
      timestamp: Date.now()
    });
    StorageService.set(OFFLINE_QUEUE_KEY, queue);
  },

  sync: async () => {
    if (!navigator.onLine) return;
    
    const queue = StorageService.get(OFFLINE_QUEUE_KEY, []);
    if (queue.length === 0) return;

    console.log('Syncing offline data...', queue);
    
    // Process queue items here
    // For this frontend-only demo, we just clear the queue as "synced"
    // In real app, you'd POST to backend
    
    StorageService.set(OFFLINE_QUEUE_KEY, []);
    return true;
  }
};
