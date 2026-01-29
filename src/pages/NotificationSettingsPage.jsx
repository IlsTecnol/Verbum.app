import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Bell, Save } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { NotificationService } from '@/services/NotificationService';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const NotificationSettingsPage = () => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    setSettings(NotificationService.getSettings());
  }, []);

  const handleChange = (key, field, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const handleSave = async () => {
    const granted = await NotificationService.requestPermission();
    if (granted) {
      NotificationService.updateSettings(settings);
      toast({ title: "Salvo!", description: "Configurações de notificação atualizadas." });
    } else {
      toast({ title: "Erro", description: "Permissão de notificação negada.", variant: "destructive" });
    }
  };

  return (
    <>
      <Helmet><title>Notificações - Ministério App</title></Helmet>
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 pt-8 pb-24 px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Bell className="w-8 h-8" /> Configurar Notificações
              </h1>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto px-4 -mt-16 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              {Object.entries(settings).map(([key, config]) => (
                <div key={key} className="flex items-center justify-between py-4 border-b last:border-0 border-gray-100 dark:border-gray-700">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white capitalize">
                      {key === 'dailyReading' ? 'Leitura Diária' : key}
                    </h3>
                    <p className="text-sm text-gray-500">Receber lembrete diário</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="time"
                      value={config.time}
                      onChange={(e) => handleChange(key, 'time', e.target.value)}
                      className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:text-white"
                    />
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={(e) => handleChange(key, 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <Button onClick={handleSave} className="w-full bg-violet-600 hover:bg-violet-700">
                  <Save className="w-4 h-4 mr-2" /> Salvar Preferências
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default NotificationSettingsPage;
