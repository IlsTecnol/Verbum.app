import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BookOpen, ChevronDown, WifiOff, Star } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import VerseCard from '@/components/VerseCard';
import { toast } from '@/components/ui/use-toast';
import { BibleService } from '@/services/BibleService';
import { StorageService } from '@/services/StorageService';
import BibleVersionSelector from '@/components/BibleVersionSelector';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const books = [
  'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio', 'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel', '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras', 'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios', 'Eclesiastes', 'Cantares', 'Isaías', 'Jeremias', 'Lamentações', 'Ezequiel', 'Daniel', 'Oséias', 'Joel', 'Amós', 'Obadias', 'Jonas', 'Miquéias', 'Naum', 'Habacuque', 'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
  'Mateus', 'Marcos', 'Lucas', 'João', 'Atos', 'Romanos', '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios', 'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses', '1 Timóteo', '2 Timóteo', 'Tito', 'Filemom', 'Hebreus', 'Tiago', '1 Pedro', '2 Pedro', '1 João', '2 João', '3 João', 'Judas', 'Apocalipse'
];

// Simple mapping for API which uses English names mostly, but supports some Portuguese.
// Ideally, use a proper mapping library or object. For demo, we rely on API smarts or simple names.
// Keeping it simple for now, assuming API handles standard names or we pass them as is.

const BiblePage = () => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState('João'); // Default to João (John)
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState('almeida');
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  useEffect(() => {
    const storedFavorites = StorageService.get('bibleFavorites', []);
    setFavorites(storedFavorites);
    
    const storedVersion = StorageService.get('selectedBibleVersion', 'almeida');
    setSelectedVersion(storedVersion);
  }, []);

  const handleVersionChange = (newVersion) => {
    setSelectedVersion(newVersion);
    StorageService.set('selectedBibleVersion', newVersion);
  };

  useEffect(() => {
    const fetchVerses = async () => {
      setLoading(true);
      try {
        // Map Portuguese to English if needed for specific API, or use standard names
        // bible-api.com supports many Portuguese names.
        let apiBook = selectedBook;
        if(selectedBook === 'João') apiBook = 'John';
        if(selectedBook === 'Gênesis') apiBook = 'Genesis';
        // Add more mappings if needed or implement full mapping object

        const data = await BibleService.getChapter(apiBook, selectedChapter, selectedVersion);
        setVerses(data);
      } catch (error) {
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar os versículos.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [selectedBook, selectedChapter, selectedVersion]);

  const toggleFavorite = (verse) => {
    const verseId = `${selectedBook}-${selectedChapter}-${verse.number}`;
    const isFavorited = favorites.some(f => f.id === verseId);
    
    let updatedFavorites;
    if (isFavorited) {
      updatedFavorites = favorites.filter(f => f.id !== verseId);
      toast({ title: "Removido", description: "Removido dos favoritos" });
    } else {
      updatedFavorites = [...favorites, { id: verseId, ...verse, book: selectedBook, chapter: selectedChapter, version: selectedVersion }];
      toast({ title: "Favoritado", description: "Adicionado aos favoritos" });
    }
    
    setFavorites(updatedFavorites);
    StorageService.set('bibleFavorites', updatedFavorites);
  };

  const isFavorited = (verse) => {
    const verseId = `${selectedBook}-${selectedChapter}-${verse.number}`;
    return favorites.some(f => f.id === verseId);
  };

  return (
    <>
      <Helmet>
        <title>Bíblia - Ministério App</title>
      </Helmet>

      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 pt-8 pb-32 px-4 rounded-b-[2rem] shadow-xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                  <BookOpen className="w-8 h-8" />
                  Bíblia Sagrada
                  {isOffline && <WifiOff className="w-6 h-6 text-white/50" />}
                </h1>
                <Button 
                  onClick={() => navigate('/favorites')}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Star className="w-4 h-4 mr-2 fill-current" /> Meus Favoritos
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <select
                    value={selectedBook}
                    onChange={(e) => setSelectedBook(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg appearance-none cursor-pointer text-gray-900 dark:text-white font-semibold"
                  >
                    {books.map(book => (
                      <option key={book} value={book}>{book}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg appearance-none cursor-pointer text-gray-900 dark:text-white font-semibold"
                  >
                    {Array.from({ length: 150 }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>Capítulo {num}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>

                <BibleVersionSelector 
                  currentVersion={selectedVersion} 
                  onVersionChange={handleVersionChange} 
                />
              </div>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-20">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 min-h-[60vh]">
              <div className="flex justify-between items-end mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedBook} {selectedChapter}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Versão: {selectedVersion.toUpperCase()}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {verses.map((verse, index) => (
                    <VerseCard
                      key={verse.id || index}
                      verse={verse}
                      book={selectedBook}
                      chapter={selectedChapter}
                      isFavorited={isFavorited(verse)}
                      onToggleFavorite={() => toggleFavorite(verse)}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default BiblePage;
