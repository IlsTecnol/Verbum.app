import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HighlightService } from '@/services/HighlightService';
import { toast } from '@/components/ui/use-toast';

const COLORS = [
  { id: 'yellow', value: 'bg-yellow-200 dark:bg-yellow-900/50', label: 'Amarelo' },
  { id: 'green', value: 'bg-green-200 dark:bg-green-900/50', label: 'Verde' },
  { id: 'blue', value: 'bg-blue-200 dark:bg-blue-900/50', label: 'Azul' },
  { id: 'red', value: 'bg-red-200 dark:bg-red-900/50', label: 'Vermelho' }
];

const AnnotationModal = ({ isOpen, onClose, verseId, verseText, book, chapter, verseNumber }) => {
  const [color, setColor] = useState(null);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (isOpen && verseId) {
      const existing = HighlightService.getHighlight(verseId);
      if (existing) {
        setColor(existing.color);
        setNote(existing.note || '');
        setTags(existing.tags ? existing.tags.join(', ') : '');
      } else {
        setColor(null);
        setNote('');
        setTags('');
      }
    }
  }, [isOpen, verseId]);

  const handleSave = () => {
    const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    
    HighlightService.saveHighlight(verseId, {
      color,
      note,
      tags: tagArray,
      text: verseText,
      book,
      chapter,
      verseNumber
    });

    toast({
      title: "Anotação salva",
      description: "Suas notas foram atualizadas com sucesso"
    });
    onClose();
  };

  const handleRemove = () => {
    HighlightService.removeHighlight(verseId);
    toast({
      title: "Removido",
      description: "Destaque e anotações removidos"
    });
    onClose();
  };

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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Anotações e Destaques
                </h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cor do Destaque
                  </label>
                  <div className="flex gap-3">
                    {COLORS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setColor(c.id === color ? null : c.id)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${c.value} ${
                          color === c.id ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Suas Notas
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    placeholder="Escreva seus pensamentos..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" /> Tags
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                    placeholder="fé, oração, promessa (separados por vírgula)"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <Button variant="outline" onClick={handleRemove} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Remover
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Save className="w-4 h-4 mr-2" /> Salvar
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnnotationModal;
