import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Star, ArrowLeft, Search } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import VerseCard from '@/components/VerseCard';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '@/services/StorageService';
import { Button } from '@/components/ui/button';

const MyFavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const storedFavorites = StorageService.get('bibleFavorites', []);
    setFavorites(storedFavorites);
  }, []);

  const handleUnfavorite = (verseId) => {
    const updated = favorites.filter(f => f.id !== verseId);
    setFavorites(updated);
    StorageService.set('bibleFavorites', updated);
  };

  const filteredFavorites = favorites.filter(f => 
    f.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.book.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Meus Favoritos - Ministério App</title></Helmet>
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 pt-8 pb-24 px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <Button 
                onClick={() => navigate('/bible')} 
                variant="ghost" 
                className="text-white hover:bg-white/20 mb-4 p-0 h-auto"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Voltar para Bíblia
              </Button>
              
              <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                <Star className="w-8 h-8 fill-current" />
                Meus Favoritos
              </h1>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar nos favoritos..."
                  className="w-full pl-12 pr-4 py-3 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
                />
              </div>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto px-4 -mt-16">
            {filteredFavorites.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Você ainda não tem versículos favoritos.
                </p>
                <Button onClick={() => navigate('/bible')} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white">
                  Ir para Bíblia
                </Button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
                {filteredFavorites.map((fav, index) => (
                  <VerseCard
                    key={fav.id}
                    verse={{ number: fav.number, text: fav.text }}
                    book={fav.book}
                    chapter={fav.chapter}
                    isFavorited={true}
                    onToggleFavorite={() => handleUnfavorite(fav.id)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default MyFavoritesPage;
