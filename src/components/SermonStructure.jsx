import React from 'react';

const SermonStructure = ({ structure, onChange }) => {
  const sections = [
    { key: 'introduction', label: 'Introdução', placeholder: 'Como você vai introduzir o tema?' },
    { key: 'biblicalContext', label: 'Contexto Bíblico', placeholder: 'Explicação teológica e histórica' },
    { key: 'development', label: 'Desenvolvimento', placeholder: 'Pontos principais da mensagem...' },
    { key: 'application', label: 'Aplicação', placeholder: 'Como isso se aplica à vida hoje?' },
    { key: 'conclusion', label: 'Conclusão', placeholder: 'Fechamento e apelo' }
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.key}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {section.label}
          </label>
          <textarea
            value={structure[section.key]}
            onChange={(e) => onChange(section.key, e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-colors"
            placeholder={section.placeholder}
          />
        </div>
      ))}
    </div>
  );
};

export default SermonStructure;
