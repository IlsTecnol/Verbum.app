import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, Download, Copy, Share2, Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShareService } from '@/services/ShareService';
import { AIImageService } from '@/services/AIImageService';
import { toast } from '@/components/ui/use-toast';

const ShareModal = ({ isOpen, onClose, text, reference }) => {
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleCopyText = () => {
    navigator.clipboard.writeText(`${text}\n\n${reference}`);
    toast({ title: "Copiado!", description: "Texto copiado para a área de transferência" });
  };

  const handleCopyLink = () => {
    const link = `https://verbum.app/share/${btoa(reference).substring(0, 10)}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link copiado!", description: "Link de compartilhamento copiado" });
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    setGeneratedImage(null);
    try {
      // Try AI generation first
      const imageUrl = await AIImageService.generateImage(text, reference);
      setGeneratedImage(imageUrl);
      toast({ title: "Imagem IA Gerada!", description: "Sua imagem exclusiva foi criada." });
    } catch (error) {
      // Fallback to Canvas
      try {
        const dataUrl = await ShareService.generateImage(text, reference);
        setGeneratedImage(dataUrl);
        toast({ title: "Imagem Gerada!", description: "Usando gerador padrão." });
      } catch (err) {
        toast({ title: "Erro", description: "Não foi possível gerar a imagem", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.download = `verbum-${Date.now()}.png`;
    link.href = generatedImage;
    link.click();
    toast({ title: "Download iniciado", description: "Imagem salva no seu dispositivo" });
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Share2 className="w-6 h-6" /> Compartilhar
                </h3>
                <button onClick={onClose} className="text-white/80 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto">
                <p className="text-sm text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                  "{text}" - <strong>{reference}</strong>
                </p>

                {generatedImage ? (
                   <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                     <img src={generatedImage} alt="Versículo Gerado" className="w-full h-auto" />
                   </div>
                ) : null}

                <div className="grid grid-cols-1 gap-3">
                  {!generatedImage && (
                    <Button 
                      onClick={handleGenerateImage} 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white h-12"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Wand2 className="w-5 h-5 mr-2" />}
                      {loading ? 'Criando Arte...' : 'Gerar Imagem com IA'}
                    </Button>
                  )}

                  {generatedImage && (
                    <Button onClick={handleDownloadImage} className="w-full bg-green-600 hover:bg-green-700 text-white h-12">
                      <Download className="w-5 h-5 mr-2" /> Baixar Imagem
                    </Button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={handleCopyText} className="h-12">
                      <Copy className="w-4 h-4 mr-2 text-blue-600" /> Copiar Texto
                    </Button>
                    <Button variant="outline" onClick={handleCopyLink} className="h-12">
                      <LinkIcon className="w-4 h-4 mr-2 text-green-600" /> Copiar Link
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 text-center text-xs text-gray-400 shrink-0">
                Powered by Verbum AI
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
