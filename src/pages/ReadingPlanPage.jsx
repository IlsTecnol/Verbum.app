import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar, CheckCircle, Circle } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { ReadingPlanService } from '@/services/ReadingPlanService';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const ReadingPlanPage = () => {
  const [plan, setPlan] = useState([]);
  const [progress, setProgress] = useState({});
  const [stats, setStats] = useState({ completedDays: 0, totalDays: 365, percentage: 0 });

  useEffect(() => {
    setPlan(ReadingPlanService.getPlan());
    setProgress(ReadingPlanService.getProgress());
    setStats(ReadingPlanService.getStats());
  }, []);

  const handleMarkComplete = (day) => {
    const newProgress = ReadingPlanService.markComplete(day);
    setProgress(newProgress);
    setStats(ReadingPlanService.getStats());
    toast({ title: "Parabéns!", description: "Leitura do dia concluída com sucesso!" });
  };

  return (
    <>
      <Helmet><title>Plano de Leitura - Ministério App</title></Helmet>
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 pt-8 pb-24 px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Calendar className="w-8 h-8" /> Plano Anual
              </h1>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex justify-between text-white mb-2">
                  <span>Progresso</span>
                  <span className="font-bold">{stats.percentage}%</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-3">
                  <div className="bg-white h-3 rounded-full transition-all duration-500" style={{ width: `${stats.percentage}%` }} />
                </div>
                <p className="text-white/80 text-sm mt-2">{stats.completedDays} de {stats.totalDays} dias concluídos</p>
              </div>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto px-4 -mt-16 space-y-4">
            {plan.slice(0, 30).map((day, index) => { // Showing first 30 days for demo
              const isCompleted = progress[day.day]?.completed;
              return (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center justify-between border-l-4 ${isCompleted ? 'border-emerald-500' : 'border-gray-200'}`}
                >
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Dia {day.day}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{day.book} {day.chapters}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{day.description}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={isCompleted ? "ghost" : "default"}
                    onClick={() => !isCompleted && handleMarkComplete(day.day)}
                    className={isCompleted ? "text-emerald-600" : "bg-emerald-600 hover:bg-emerald-700"}
                  >
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : "Concluir"}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default ReadingPlanPage;
