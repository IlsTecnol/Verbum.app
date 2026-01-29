import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { PenTool, Filter, Trash2 } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { HighlightService } from '@/services/HighlightService';
import { Button } from '@/components/ui/button';

const AnnotationsPage = () => {
  const [highlights, setHighlights] = useState({});
  const [filterColor, setFilterColor] = useState('all');

  useEffect(() => {
    setHighlights(HighlightService.getHighlights());
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Excluir esta anotação?')) {
      HighlightService.removeHighlight(id);
      setHighlights(HighlightService.getHighlights());
    }
  };

  const filteredHighlights = Object.entries(highlights).filter(([_, h]) => {
    if (filterColor === 'all') return true;
    return h.color === filterColor;
  });

  return (
    <>
      <Helmet><title>Anotações - Ministério App</title></Helmet>
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 pt-8 pb-24 px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <PenTool className="w-8 h-8" /> Minhas Anotações
              </h1>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['all', 'yellow', 'green', 'blue', 'red'].map(color => (
                  <Button
                    key={color}
                    variant={filterColor === color ? 'secondary' : 'ghost'}
                    onClick={() => setFilterColor(color)}
                    className={`capitalize ${filterColor === color ? 'bg-white text-rose-600' : 'text-white hover:bg-white/20'}`}
                  >
                    {color === 'all' ? 'Todos' : color}
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto px-4 -mt-16 space-y-4">
            {filteredHighlights.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <PenTool className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma anotação encontrada.</p>
              </div>
            ) : (
              filteredHighlights.map(([id, h], index) => (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative overflow-hidden"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-${h.color}-400`} />
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {h.book} {h.chapter}:{h.verseNumber}
                    </h3>
                    <button onClick={() => handleDelete(id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic mb-3">"{h.text}"</p>
                  {h.note && (
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-sm">
                      {h.note}
                    </div>
                  )}
                  {h.tags && h.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {h.tags.map(tag => (
                        <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default AnnotationsPage;
