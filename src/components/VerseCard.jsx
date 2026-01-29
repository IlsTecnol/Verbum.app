import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Lightbulb, PenTool, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import AnnotationModal from '@/components/AnnotationModal';
import ShareModal from '@/components/ShareModal';
import { HighlightService } from '@/services/HighlightService';

const VerseCard = ({ verse, book, chapter, isFavorited, onToggleFavorite, index }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const highlight = HighlightService.getHighlight(`${book}-${chapter}-${verse.number}`);
  
  const getBgColor = (colorId) => {
    switch(colorId) {
      case 'yellow': return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'green': return 'bg-green-100 dark:bg-green-900/30';
      case 'blue': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'red': return 'bg-red-100 dark:bg-red-900/30';
      default: return '';
    }
  };

  const bgClass = highlight?.color ? getBgColor(highlight.color) : '';
  const isSelected = showMenu;

  const handleCardClick = () => {
    setShowMenu(!showMenu);
  };

  const handleCreateSermon = () => {
    // Navigate to sermons page with state to prepopulate form
    // Note: SermonPage/Form needs to handle this state. 
    // For now, we just navigate.
    navigate('/sermons', { 
      state: { 
        baseText: `${book} ${chapter}:${verse.number}`,
        initialText: verse.text 
      } 
    });
  };

  return (
    <>
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={handleCardClick}
          className={`
            p-3 rounded-lg cursor-pointer transition-all border-l-4
            ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'}
            ${bgClass}
          `}
        >
          <div className="flex gap-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1 min-w-[20px]">
              {verse.number}
            </span>
            <div className="flex-1">
              <p className={`text-gray-800 dark:text-gray-200 leading-relaxed ${bgClass ? 'font-medium' : ''}`}>
                {verse.text}
              </p>
              {highlight?.note && (
                <div className="mt-2 text-xs italic text-gray-600 dark:text-gray-400 border-l-2 border-gray-300 pl-2">
                  Note: {highlight.note}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Floating Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute right-0 top-full mt-2 z-30 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 flex flex-col min-w-[180px]"
            >
              <div className="flex justify-end mb-1">
                <button onClick={() => setShowMenu(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={onToggleFavorite}
                className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorited ? 'Remover Favorito' : 'Favoritar'}
              </button>
              <button 
                onClick={() => setShowAnnotationModal(true)}
                className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200"
              >
                <PenTool className="w-4 h-4" /> Anotar
              </button>
              <button 
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200"
              >
                <Share2 className="w-4 h-4" /> Compartilhar
              </button>
              <button 
                onClick={handleCreateSermon}
                className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200"
              >
                <Lightbulb className="w-4 h-4" /> Criar Sermão
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showMenu && <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />}
      </AnimatePresence>

      <AnnotationModal
        isOpen={showAnnotationModal}
        onClose={() => setShowAnnotationModal(false)}
        verseId={`${book}-${chapter}-${verse.number}`}
        verseText={verse.text}
        book={book}
        chapter={chapter}
        verseNumber={verse.number}
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        text={verse.text}
        reference={`${book} ${chapter}:${verse.number}`}
      />
    </>
  );
};

export default VerseCard;
