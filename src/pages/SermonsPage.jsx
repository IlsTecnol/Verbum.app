import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Search, Heart, Calendar, MapPin, Filter } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import SermonForm from '@/components/SermonForm';
import SermonCard from '@/components/SermonCard';
import { Button } from '@/components/ui/button';

const SermonsPage = () => {
  const [sermons, setSermons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSermon, setEditingSermon] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const storedSermons = JSON.parse(localStorage.getItem('sermons') || '[]');
    setSermons(storedSermons);
  }, []);

  const saveSermon = (sermonData) => {
    let updatedSermons;
    
    if (editingSermon) {
      updatedSermons = sermons.map(s => 
        s.id === editingSermon.id ? { ...sermonData, id: editingSermon.id } : s
      );
    } else {
      const newSermon = {
        ...sermonData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedSermons = [newSermon, ...sermons];
    }
    
    setSermons(updatedSermons);
    localStorage.setItem('sermons', JSON.stringify(updatedSermons));
    setShowForm(false);
    setEditingSermon(null);
  };

  const deleteSermon = (id) => {
    const updatedSermons = sermons.filter(s => s.id !== id);
    setSermons(updatedSermons);
    localStorage.setItem('sermons', JSON.stringify(updatedSermons));
  };

  const toggleFavorite = (id) => {
    const updatedSermons = sermons.map(s => 
      s.id === id ? { ...s, isFavorite: !s.isFavorite } : s
    );
    setSermons(updatedSermons);
    localStorage.setItem('sermons', JSON.stringify(updatedSermons));
  };

  const handleEdit = (sermon) => {
    setEditingSermon(sermon);
    setShowForm(true);
  };

  const filteredSermons = sermons
    .filter(sermon => {
      const matchesSearch = sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sermon.baseText.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterType === 'favorites') return matchesSearch && sermon.isFavorite;
      if (filterType === 'preached') return matchesSearch && sermon.preachedDate;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (filterType === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  return (
    <>
      <Helmet>
        <title>Sermões - Ministério App</title>
        <meta name="description" content="Crie e gerencie seus sermões" />
      </Helmet>

      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 pt-8 pb-24 px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                  <Calendar className="w-8 h-8" />
                  Sermões
                </h1>
                <Button
                  onClick={() => {
                    setEditingSermon(null);
                    setShowForm(true);
                  }}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Novo
                </Button>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar sermões..."
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-900 dark:text-white placeholder:text-gray-400"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={filterType === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                  className={filterType === 'all' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'}
                >
                  Todos
                </Button>
                <Button
                  variant={filterType === 'favorites' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterType('favorites')}
                  className={filterType === 'favorites' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'}
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Favoritos
                </Button>
                <Button
                  variant={filterType === 'date' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterType('date')}
                  className={filterType === 'date' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'}
                >
                  <Filter className="w-4 h-4 mr-1" />
                  Data
                </Button>
                <Button
                  variant={filterType === 'preached' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilterType('preached')}
                  className={filterType === 'preached' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'}
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Pregados
                </Button>
              </div>
            </motion.div>
          </div>

          <div className="max-w-4xl mx-auto px-4 -mt-16">
            {filteredSermons.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Nenhum sermão encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Comece criando seu primeiro sermão
                </p>
                <Button
                  onClick={() => {
                    setEditingSermon(null);
                    setShowForm(true);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Sermão
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSermons.map((sermon, index) => (
                  <SermonCard
                    key={sermon.id}
                    sermon={sermon}
                    onEdit={() => handleEdit(sermon)}
                    onDelete={() => deleteSermon(sermon.id)}
                    onToggleFavorite={() => toggleFavorite(sermon.id)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <SermonForm
            sermon={editingSermon}
            onSave={saveSermon}
            onClose={() => {
              setShowForm(false);
              setEditingSermon(null);
            }}
          />
        )}
      </MainLayout>
    </>
  );
};

export default SermonsPage;
