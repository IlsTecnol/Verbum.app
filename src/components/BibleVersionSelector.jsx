import React from 'react';
import { ChevronDown } from 'lucide-react';
import { StorageService } from '@/services/StorageService';

const VERSIONS = [
  { id: 'almeida', name: 'Almeida Corrigida' },
  { id: 'nvi', name: 'Nova Versão Internacional' },
  { id: 'ntlh', name: 'Nova Tradução na Linguagem de Hoje' },
  { id: 'kjv', name: 'King James Atualizada' },
  { id: 'ara', name: 'Almeida Revista e Atualizada' }
];

const BibleVersionSelector = ({ currentVersion, onVersionChange }) => {
  return (
    <div className="relative">
      <select
        value={currentVersion}
        onChange={(e) => onVersionChange(e.target.value)}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg appearance-none cursor-pointer text-gray-900 dark:text-white font-semibold pr-10"
      >
        {VERSIONS.map((version) => (
          <option key={version.id} value={version.id}>
            {version.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
    </div>
  );
};

export default BibleVersionSelector;
