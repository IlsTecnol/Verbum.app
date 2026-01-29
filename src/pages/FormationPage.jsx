import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { GraduationCap, Lock, CheckCircle, Circle } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import CourseModule from '@/components/CourseModule';
import AdvancedPlan from '@/components/AdvancedPlan';

const FormationPage = () => {
  const [courseProgress, setCourseProgress] = useState({});

  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    setCourseProgress(storedProgress);
  }, []);

  const modules = [
    {
      id: 1,
      title: 'Estrutura da Pregação',
      description: 'Aprenda os fundamentos de uma pregação bem estruturada',
      duration: '30 min',
      lessons: 5,
      content: 'Este módulo cobre os princípios básicos da homilética, incluindo introdução, desenvolvimento, aplicação e conclusão.'
    },
    {
      id: 2,
      title: 'Como Estudar a Bíblia',
      description: 'Métodos e técnicas para estudo bíblico eficaz',
      duration: '45 min',
      lessons: 7,
      content: 'Descubra métodos práticos de estudo bíblico, incluindo leitura contextual, análise de palavras-chave e aplicação pessoal.'
    },
    {
      id: 3,
      title: 'Como Usar o App',
      description: 'Maximize seu uso das ferramentas disponíveis',
      duration: '20 min',
      lessons: 4,
      content: 'Um guia completo sobre como utilizar todas as funcionalidades do aplicativo para potencializar seu ministério.'
    },
    {
      id: 4,
      title: 'Checklist de Preparação',
      description: 'Passo a passo para preparar uma mensagem',
      duration: '25 min',
      lessons: 6,
      content: 'Um roteiro prático com todos os passos necessários para preparar uma pregação ou estudo bíblico de qualidade.'
    }
  ];

  const toggleModuleCompletion = (moduleId) => {
    const updated = {
      ...courseProgress,
      [moduleId]: !courseProgress[moduleId]
    };
    setCourseProgress(updated);
    localStorage.setItem('courseProgress', JSON.stringify(updated));
  };

  const completedCount = Object.values(courseProgress).filter(Boolean).length;
  const progress = (completedCount / modules.length) * 100;

  return (
    <>
      <Helmet>
        <title>Formação - Ministério App</title>
        <meta name="description" content="Desenvolva-se através de cursos e treinamentos" />
      </Helmet>

      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 pt-8 pb-24 px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
                <GraduationCap className="w-8 h-8" />
                Formação
              </h1>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold">Seu Progresso</span>
                  <span className="text-white font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="bg-white h-3 rounded-full transition-all duration-500"
                  />
                </div>
                <p className="text-white/80 text-sm mt-3">
                  {completedCount} de {modules.length} módulos concluídos
                </p>
              </div>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto px-4 -mt-16 space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Curso Básico
                </h2>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                  Gratuito
                </span>
              </div>

              <div className="space-y-4">
                {modules.map((module, index) => (
                  <CourseModule
                    key={module.id}
                    module={module}
                    isCompleted={courseProgress[module.id] || false}
                    onToggleComplete={() => toggleModuleCompletion(module.id)}
                    index={index}
                  />
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <AdvancedPlan />
            </motion.section>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default FormationPage;
