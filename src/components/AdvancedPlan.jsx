import React from 'react';
import { Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdvancedPlan = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-xl p-8 text-white">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Star className="w-32 h-32" />
      </div>

      <div className="relative z-10 text-center">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <Lock className="w-8 h-8 text-yellow-400" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Plano Avançado</h2>
        <p className="text-slate-300 mb-6 max-w-md mx-auto">
          Desbloqueie cursos avançados de Teologia, Exegese Bíblica e Liderança Eclesiástica. Em breve disponível.
        </p>

        <ul className="text-left max-w-xs mx-auto space-y-3 mb-8 text-sm text-slate-300">
          <li className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" /> Certificado de Conclusão
          </li>
          <li className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" /> Mentorias em Grupo
          </li>
          <li className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" /> Material de Apoio PDF
          </li>
        </ul>

        <Button variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 w-full max-w-xs">
          Entrar na Lista de Espera
        </Button>
      </div>
    </div>
  );
};

export default AdvancedPlan;
