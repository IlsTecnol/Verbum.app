import { StorageService } from './StorageService';

const BIOMETRIC_KEY = 'biometric_settings';

export const BiometricService = {
  getSettings: () => {
    return StorageService.get(BIOMETRIC_KEY, {
      enabled: false,
      type: 'face_id', // or 'touch_id'
      lastLogin: null
    });
  },

  updateSettings: (settings) => {
    const current = BiometricService.getSettings();
    const updated = { ...current, ...settings };
    StorageService.set(BIOMETRIC_KEY, updated);
    return updated;
  },

  authenticate: async () => {
    // Mock biometric authentication
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  },

  getLoginHistory: () => {
    return StorageService.get('login_history', [
      { date: new Date().toISOString(), device: 'iPhone 13', location: 'São Paulo, BR' },
      { date: new Date(Date.now() - 86400000).toISOString(), device: 'iPhone 13', location: 'São Paulo, BR' }
    ]);
  }
};
