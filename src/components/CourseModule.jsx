import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, ChevronDown, ChevronUp, PlayCircle, BookOpen } from 'lucide-react';

const CourseModule = ({ module, isCompleted, onToggleComplete, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border ${isCompleted ? 'border-green-500/50' : 'border-gray-200 dark:border-gray-700'}`}
    >
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'}`}>
            <span className="font-bold">{module.id}</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{module.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{module.duration} • {module.lessons} aulas</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
            className="text-gray-400 hover:text-green-500 transition-colors"
          >
            {isCompleted ? <CheckCircle className="w-6 h-6 text-green-500 fill-green-100 dark:fill-green-900/50" /> : <Circle className="w-6 h-6" />}
          </button>
          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 dark:border-gray-700"
          >
            <div className="p-5 bg-gray-50 dark:bg-gray-900/50">
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-gray-400" />
              </div>
              
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Sobre este módulo</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                {module.content}
              </p>
              
              <div className="space-y-2">
                {[1, 2, 3].map(lesson => (
                  <div key={lesson} className="flex items-center gap-3 p-2 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer text-sm text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span>Lição {lesson}: Fundamentos Práticos</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CourseModule;
