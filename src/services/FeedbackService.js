import { StorageService } from './StorageService';

const FEEDBACK_KEY = 'app_feedback';

export const FeedbackService = {
  submitFeedback: (type, message, rating = null) => {
    const items = StorageService.get(FEEDBACK_KEY, []);
    const newItem = {
      id: Date.now().toString(),
      type, // 'feedback', 'bug', 'suggestion'
      message,
      rating,
      date: new Date().toISOString(),
      status: 'sent'
    };
    
    StorageService.set(FEEDBACK_KEY, [newItem, ...items]);
    return newItem;
  },

  getHistory: () => {
    return StorageService.get(FEEDBACK_KEY, []);
  }
};
