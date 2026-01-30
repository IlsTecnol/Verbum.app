import { StorageService } from './StorageService';

const SETTINGS_KEY = 'notification_settings';

export const NotificationService = {
  getSettings: () => {
    return StorageService.get(SETTINGS_KEY, {
      dailyReading: { enabled: true, time: '08:00' },
      sermons: { enabled: false, time: '18:00' },
      devotional: { enabled: false, time: '07:00' }
    });
  },

  updateSettings: (newSettings) => {
    StorageService.set(SETTINGS_KEY, newSettings);
  },

  requestPermission: async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  checkAndNotify: () => {
    const settings = NotificationService.getSettings();
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Logic to prevent multiple notifications per minute would be needed in production
    // For demo, we assume this is called responsibly
    
    Object.entries(settings).forEach(([key, config]) => {
      if (config.enabled && config.time === currentTime) {
        new Notification('Lembrete Verbum', {
          body: `É hora do seu momento: ${key === 'dailyReading' ? 'Leitura Diária' : key}`,
          icon: '/vite.svg'
        });
      }
    });
  }
};
