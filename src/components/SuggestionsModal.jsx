import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { StorageService } from '@/services/StorageService';

const SuggestionsModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      toast({ title: "Campos obrigatórios", description: "Por favor preencha título e descrição", variant: "destructive" });
      return;
    }

    const newSuggestion = {
      id: Date.now().toString(),
      title,
      description,
      date: new Date().toISOString()
    };

    const existing = StorageService.get('suggestions', []);
    StorageService.set('suggestions', [newSuggestion, ...existing]);

    setShowThankYou(true);
    
    setTimeout(() => {
      setShowThankYou(false);
      setTitle('');
      setDescription('');
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
          >
            {showThankYou ? (
              <div className="p-8 flex flex-col items-center justify-center text-center h-64">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 text-green-600"
                >
                  <ThumbsUp className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Obrigado!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Sua sugestão foi enviada com sucesso. Vamos analisar com carinho para melhorar o Verbum.
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Enviar Sugestão</h3>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Resumo da sua ideia..."
                      className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição Detalhada</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      placeholder="Conte-nos mais sobre como podemos melhorar..."
                      className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Send className="w-4 h-4 mr-2" /> Enviar Sugestão
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuggestionsModal;
