import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Edit, Trash2, Share2, Calendar, MapPin, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SermonCard = ({ sermon, onEdit, onDelete, onToggleFavorite, index }) => {
  const [showFull, setShowFull] = useState(false);

  const handleShare = () => {
    toast({
      title: "🚧 Recurso em desenvolvimento",
      description: "A função de compartilhamento estará disponível em breve! 🚀"
    });
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este sermão?')) {
      onDelete();
      toast({
        title: "Sermão excluído",
        description: "O sermão foi removido com sucesso"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {sermon.title}
          </h3>
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
            {sermon.baseText}
          </p>
          {sermon.tags && (
            <div className="flex flex-wrap gap-2 mb-3">
              {sermon.tags.split(',').map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          {(sermon.preachedDate || sermon.preachedLocation) && (
            <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
              {sermon.preachedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(sermon.preachedDate).toLocaleDateString('pt-BR')}
                </span>
              )}
              {sermon.preachedLocation && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {sermon.preachedLocation}
                </span>
              )}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFavorite}
          className={sermon.isFavorite ? 'text-red-500' : 'text-gray-400'}
        >
          <Heart className={`w-5 h-5 ${sermon.isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {sermon.context && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {sermon.context}
        </p>
      )}

      {showFull && sermon.structure && (
        <div className="space-y-3 mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
          {sermon.structure.introduction && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Introdução</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{sermon.structure.introduction}</p>
            </div>
          )}
          {sermon.structure.biblicalContext && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Contexto Bíblico</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{sermon.structure.biblicalContext}</p>
            </div>
          )}
          {sermon.structure.development && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Desenvolvimento</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{sermon.structure.development}</p>
            </div>
          )}
          {sermon.structure.application && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Aplicação Prática</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{sermon.structure.application}</p>
            </div>
          )}
          {sermon.structure.conclusion && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Conclusão</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{sermon.structure.conclusion}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFull(!showFull)}
          className="text-gray-600 dark:text-gray-400"
        >
          <Eye className="w-4 h-4 mr-1" />
          {showFull ? 'Ocultar' : 'Ver completo'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-700"
        >
          <Edit className="w-4 h-4 mr-1" />
          Editar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="text-green-600 hover:text-green-700"
        >
          <Share2 className="w-4 h-4 mr-1" />
          Compartilhar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Excluir
        </Button>
      </div>
    </motion.div>
  );
};

export default SermonCard;
