import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Upload, FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import SermonStructure from '@/components/SermonStructure';
import { DocumentParserService } from '@/services/DocumentParserService';

const SermonForm = ({ sermon, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    baseText: '',
    context: '',
    tags: '',
    structure: {
      introduction: '',
      biblicalContext: '',
      development: '',
      application: '',
      conclusion: ''
    },
    isFavorite: false,
    preachedDate: '',
    preachedLocation: ''
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (sermon) {
      setFormData(sermon);
    }
  }, [sermon]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStructureChange = (field, value) => {
    setFormData({
      ...formData,
      structure: { ...formData.structure, [field]: value }
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await DocumentParserService.parse(file);
      
      // Auto-fill logic
      setFormData(prev => ({
        ...prev,
        title: prev.title || result.title,
        context: prev.context || result.structure.biblicalContext || '',
        structure: {
          introduction: prev.structure.introduction || result.structure.introduction || '',
          biblicalContext: prev.structure.biblicalContext || result.structure.biblicalContext || '',
          development: prev.structure.development || result.structure.development || '',
          application: prev.structure.application || result.structure.application || '',
          conclusion: prev.structure.conclusion || result.structure.conclusion || ''
        }
      }));

      toast({ title: "Importado", description: "Conteúdo do documento importado com sucesso!" });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao ler documento", variant: "destructive" });
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.baseText) {
      toast({ title: "Campos obrigatórios", description: "Preencha título e texto base", variant: "destructive" });
      return;
    }
    onSave(formData);
    toast({ title: "Salvo", description: "Sermão salvo com sucesso" });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-bold text-white">
            {sermon ? 'Editar Sermão' : 'Novo Sermão'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Document Upload Section */}
          <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300">
                {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Importar Documento</h4>
                <p className="text-sm text-gray-500">Suporta .txt, .pdf, .docx (parser simples)</p>
              </div>
              <div className="flex gap-2">
                 <Button 
                   variant="outline" 
                   size="sm" 
                   onClick={() => fileInputRef.current?.click()}
                   disabled={isUploading}
                 >
                   Selecionar Arquivo
                 </Button>
                 <Button variant="ghost" size="sm" className="text-blue-600">
                   <Download className="w-4 h-4 mr-1" /> Modelo
                 </Button>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".txt,.pdf,.docx,.doc" 
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <form id="sermon-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: A Graça"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Texto Base *</label>
                <input
                  type="text"
                  name="baseText"
                  value={formData.baseText}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: João 3:16"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contexto</label>
              <textarea
                name="context"
                value={formData.context}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Contexto histórico..."
              />
            </div>
            
            <SermonStructure structure={formData.structure} onChange={handleStructureChange} />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
                <input
                  type="date"
                  name="preachedDate"
                  value={formData.preachedDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Local</label>
                <input
                  type="text"
                  name="preachedLocation"
                  value={formData.preachedLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Igreja..."
                />
              </div>
            </div>
          </form>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex gap-4 bg-white dark:bg-gray-800 shrink-0">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button form="sermon-form" type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-5 h-5 mr-2" /> Salvar Sermão
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SermonForm;
