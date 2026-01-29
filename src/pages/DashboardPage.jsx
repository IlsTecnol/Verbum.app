import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Calendar, Heart, Clock, Share2, MoreVertical, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/MainLayout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [todayDevotional, setTodayDevotional] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Generate devotional based on today's date to simulate "Daily Devotional"
    const today = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = today.toLocaleDateString('pt-BR', dateOptions);
    
    // Mock data that changes "daily" (conceptually)
    setTodayDevotional({
      id: 'today',
      date: dateStr,
      title: 'Renovando as Forças',
      verse: 'Isaías 40:31',
      text: 'Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão.',
      thought: 'Hoje é um dia para confiar que Deus está no controle. Mesmo quando nos sentimos fracos, Ele é a nossa força inesgotável.',
      time: '08:00'
    });

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));

    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    if (navigator.share && todayDevotional) {
      navigator.share({
        title: todayDevotional.title,
        text: `${todayDevotional.title}\n\n"${todayDevotional.text}" - ${todayDevotional.verse}\n\nVerbum App`,
        url: window.location.href
      });
    } else {
      toast({ title: "Copiado", description: "Link copiado para área de transferência" });
    }
  };

  const handleFavorite = () => {
    toast({ title: "Favoritado", description: "Devocional salvo nos favoritos" });
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';
  };

  return (
    <>
      <Helmet>
        <title>Início - Ministério App</title>
        <meta name="description" content="Seu painel personalizado" />
      </Helmet>

      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
          
          {/* Header Section */}
          <div 
            className="relative pt-6 pb-20 px-4 rounded-b-[2.5rem] shadow-xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)`
            }}
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/profile')}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/30 text-white font-bold hover:bg-white/30 transition-all"
                >
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt="User" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{getInitials(user?.name)}</span>
                  )}
                </button>
                <div>
                  <p className="text-white/70 text-xs">Bem-vindo,</p>
                  <p className="text-white font-bold text-sm leading-tight">{user?.name}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-2xl font-bold text-white mb-2">
                Comece seu dia com propósito
              </h1>
              
              <div className="relative mt-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-12 pr-4 py-3 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto px-4 -mt-10 space-y-8">
            
            {/* Devotional of the Day Card */}
            {todayDevotional && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Heart className="w-32 h-32 text-blue-500" />
                   </div>
                   
                   <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        Devocional do Dia
                      </div>
                      <span className="text-gray-400 text-xs font-mono">{currentTime}</span>
                   </div>

                   <div className="relative z-10">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {todayDevotional.title}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 capitalize">
                        {todayDevotional.date}
                      </p>

                      <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border-l-4 border-blue-500 mb-4 italic text-gray-700 dark:text-gray-300">
                        "{todayDevotional.verse}"
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        {todayDevotional.text}
                      </p>

                      <div className="flex gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                        <Button 
                          onClick={handleFavorite}
                          variant="ghost" 
                          className="flex-1 text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Amém
                        </Button>
                        <Button 
                          onClick={handleShare}
                          variant="ghost" 
                          className="flex-1 text-gray-600 dark:text-gray-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Compartilhar
                        </Button>
                      </div>
                   </div>
                </div>
              </motion.section>
            )}

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Acesso Rápido</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => navigate('/bible')} className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1 text-left relative overflow-hidden group">
                  <div className="absolute right-[-10px] bottom-[-10px] opacity-20 group-hover:scale-110 transition-transform">
                    <Calendar className="w-16 h-16" />
                  </div>
                  <span className="block text-2xl font-bold mb-1">Bíblia</span>
                  <span className="text-white/80 text-sm">Leitura diária</span>
                </button>

                <button onClick={() => navigate('/agenda')} className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all transform hover:-translate-y-1 text-left relative overflow-hidden group">
                  <div className="absolute right-[-10px] bottom-[-10px] opacity-20 group-hover:scale-110 transition-transform">
                    <Calendar className="w-16 h-16" />
                  </div>
                  <span className="block text-2xl font-bold mb-1">Agenda</span>
                  <span className="text-white/80 text-sm">Próximos eventos</span>
                </button>
              </div>
            </motion.section>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default DashboardPage;
