import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, Trash2, CheckCircle, Circle, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DayEventsModal = ({ isOpen, onClose, date, events, categories, onEdit, onDelete, onToggleComplete }) => {
  // Format date for display: "Terça, 29 de Janeiro"
  const formattedDate = date ? date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto flex flex-col max-h-[80vh]"
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between shrink-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                  {formattedDate}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-3">
                {events.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Nenhum evento neste dia.
                  </div>
                ) : (
                  events.map(event => {
                    const category = categories.find(c => c.id === event.categoryId) || { name: 'Geral', color: 'bg-gray-500' };
                    return (
                      <div key={event.id} className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className={`font-bold text-lg ${event.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                              {event.name}
                            </h4>
                            {event.theme && <p className="text-sm text-gray-600 dark:text-gray-400">{event.theme}</p>}
                          </div>
                          <div className={`w-3 h-3 rounded-full ${category.color}`} title={category.name} />
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                           <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time || 'Dia todo'}</span>
                           <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {category.name}</span>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700 pt-3">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onToggleComplete(event.id)}
                            className={event.completed ? 'text-green-600' : 'text-gray-500'}
                          >
                            {event.completed ? <CheckCircle className="w-4 h-4 mr-1" /> : <Circle className="w-4 h-4 mr-1" />}
                            {event.completed ? 'Concluído' : 'Concluir'}
                          </Button>
                          {/* Future implementation: onEdit(event) */}
                          <Button variant="ghost" size="sm" onClick={() => onDelete(event.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DayEventsModal;
