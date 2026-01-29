import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, BookOpen, Users, Target, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SermonSuggestionModal = ({ isOpen, onClose, verse, book, chapter }) => {
  const suggestion = {
    title: `A ${verse.number === 16 ? 'Essência do Amor de Deus' : 'Mensagem de Salvação'}`,
    introduction: 'Começar com uma ilustração sobre o amor incondicional, talvez uma história pessoal ou contemporânea que ressoe com a congregação.',
    context: `Situar ${book} ${chapter} no contexto mais amplo do Evangelho. Explicar o diálogo de Jesus com Nicodemos e a necessidade do novo nascimento.`,
    development: [
      'Ponto 1: A dimensão do amor de Deus - "amou o mundo"',
      'Ponto 2: A prova do amor de Deus - "deu o seu Filho"',
      'Ponto 3: O propósito do amor de Deus - "para que todo aquele que nele crê"',
      'Ponto 4: O resultado do amor de Deus - "tenha a vida eterna"'
    ],
    application: 'Como responder a esse amor? Desafiar a congregação a uma decisão pessoal de fé. Ilustrar com exemplos práticos de transformação.',
    conclusion: 'Retomar a ilustração inicial, conectando com a resposta ao evangelho. Fazer um apelo claro e amoroso.'
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Sugestão de Sermão</h2>
                    <p className="text-white/80 text-sm">
                      {book} {chapter}:{verse.number}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {suggestion.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 p-3 rounded-lg italic">
                      "{verse.text}"
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-gray-900 dark:text-white">Introdução</h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {suggestion.introduction}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-gray-900 dark:text-white">Contexto Bíblico</h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {suggestion.context}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <h4 className="font-bold text-gray-900 dark:text-white">Desenvolvimento</h4>
                    </div>
                    <ul className="space-y-2">
                      {suggestion.development.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-orange-600" />
                      <h4 className="font-bold text-gray-900 dark:text-white">Aplicação Prática</h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {suggestion.application}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-5 h-5 text-red-600" />
                      <h4 className="font-bold text-gray-900 dark:text-white">Conclusão</h4>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {suggestion.conclusion}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    💡 <strong>Dica:</strong> Esta é uma sugestão inicial. Adapte o conteúdo ao contexto da sua congregação e à direção do Espírito Santo.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SermonSuggestionModal;
