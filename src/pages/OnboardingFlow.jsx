import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { FileText, BookOpen, Mic, TrendingUp, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const slides = [
  {
    icon: FileText,
    title: 'Organização',
    description: 'Mantenha todos os seus estudos, sermões e anotações organizados em um só lugar'
  },
  {
    icon: BookOpen,
    title: 'Bíblia',
    description: 'Acesse, estude e marque seus versículos favoritos com facilidade'
  },
  {
    icon: Mic,
    title: 'Sermões',
    description: 'Crie, edite e organize seus sermões com estrutura profissional'
  },
  {
    icon: TrendingUp,
    title: 'Crescimento Espiritual',
    description: 'Acompanhe seu progresso e desenvolva-se continuamente na fé'
  }
];

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [personalization, setPersonalization] = useState({
    userType: 'Estudante',
    interests: [],
    favoriteBooks: [],
    studyLevel: 'Iniciante'
  });

  const interests = [
    'Homilética',
    'Teologia Sistemática',
    'Hermenêutica',
    'História da Igreja',
    'Aconselhamento',
    'Liderança',
    'Missões',
    'Evangelismo'
  ];

  const books = [
    'Gênesis', 'Êxodo', 'Salmos', 'Provérbios', 'Isaías', 'Jeremias',
    'Mateus', 'João', 'Atos', 'Romanos', 'Coríntios', 'Gálatas',
    'Efésios', 'Filipenses', 'Hebreus', 'Tiago', 'Apocalipse'
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowPersonalization(true);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const toggleInterest = (interest) => {
    setPersonalization(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleBook = (book) => {
    setPersonalization(prev => ({
      ...prev,
      favoriteBooks: prev.favoriteBooks.includes(book)
        ? prev.favoriteBooks.filter(b => b !== book)
        : [...prev.favoriteBooks, book]
    }));
  };

  const handleComplete = () => {
    const onboardingData = {
      completed: true,
      completedAt: new Date().toISOString(),
      ...personalization
    };
    
    localStorage.setItem('onboarding', JSON.stringify(onboardingData));
    
    toast({
      title: "Bem-vindo!",
      description: "Seu perfil foi configurado com sucesso"
    });
    
    navigate('/home');
  };

  const CurrentIcon = slides[currentSlide]?.icon;

  return (
    <>
      <Helmet>
        <title>Bem-vindo - Ministério App</title>
        <meta name="description" content="Configure seu perfil e preferências" />
      </Helmet>

      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: `radial-gradient(100% 100% at 50% 100%, var(--Gradients-Main-Color-4, #FF9875) 0%, var(--Gradients-Main-Color-3, #B452FF) 15%, var(--Gradients-Main-Color-2, #673DE6) 30%, var(--neutral--800, #1a1b1e) 80%)`
        }}
      >
        <AnimatePresence mode="wait">
          {!showPersonalization ? (
            <motion.div
              key="slides"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-lg"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 md:p-12">
                <div className="text-center mb-8">
                  <motion.div
                    key={currentSlide}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                  >
                    <CurrentIcon className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <motion.h2
                    key={`title-${currentSlide}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
                  >
                    {slides[currentSlide].title}
                  </motion.h2>
                  
                  <motion.p
                    key={`desc-${currentSlide}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-gray-600 dark:text-gray-400"
                  >
                    {slides[currentSlide].description}
                  </motion.p>
                </div>

                <div className="flex justify-center gap-2 mb-8">
                  {slides.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide 
                          ? 'w-8 bg-blue-600' 
                          : 'w-2 bg-gray-300 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-4">
                  {currentSlide > 0 && (
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      className="flex-1 py-3 rounded-xl"
                    >
                      Anterior
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02]"
                  >
                    {currentSlide < slides.length - 1 ? 'Próximo' : 'Começar'}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="personalization"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  Personalize sua experiência
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
                  Ajude-nos a personalizar o conteúdo para você
                </p>

                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Tipo de usuário
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Pregador', 'Líder', 'Estudante'].map(type => (
                        <button
                          key={type}
                          onClick={() => setPersonalization(prev => ({ ...prev, userType: type }))}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            personalization.userType === type
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
                          }`}
                        >
                          <span className={`font-semibold ${
                            personalization.userType === type
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Áreas de interesse
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {interests.map(interest => (
                        <button
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                            personalization.interests.includes(interest)
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            personalization.interests.includes(interest)
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300 dark:border-gray-700'
                          }`}>
                            {personalization.interests.includes(interest) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className={`text-sm ${
                            personalization.interests.includes(interest)
                              ? 'text-blue-600 dark:text-blue-400 font-semibold'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {interest}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Livros favoritos da Bíblia
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      {books.map(book => (
                        <button
                          key={book}
                          onClick={() => toggleBook(book)}
                          className={`p-2 rounded-lg text-sm transition-all ${
                            personalization.favoriteBooks.includes(book)
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                          }`}
                        >
                          {book}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Nível de estudo
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Iniciante', 'Intermediário', 'Avançado'].map(level => (
                        <button
                          key={level}
                          onClick={() => setPersonalization(prev => ({ ...prev, studyLevel: level }))}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            personalization.studyLevel === level
                              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
                          }`}
                        >
                          <span className={`font-semibold ${
                            personalization.studyLevel === level
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {level}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleComplete}
                  className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02]"
                >
                  Concluir configuração
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default OnboardingFlow;
