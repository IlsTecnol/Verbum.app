import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { User, Moon, Sun, Shield, Lock, Fingerprint, HelpCircle, MessageSquare, Star, LogOut, ChevronRight, FileText, Edit, Lightbulb } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { BiometricService } from '@/services/BiometricService';
import { FeedbackService } from '@/services/FeedbackService';
import EditProfileModal from '@/components/EditProfileModal';
import SuggestionsModal from '@/components/SuggestionsModal';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [biometrics, setBiometrics] = useState({ enabled: false });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
    setBiometrics(BiometricService.getSettings());
  }, []);

  const handleToggleBiometrics = () => {
    const newState = !biometrics.enabled;
    const updated = BiometricService.updateSettings({ enabled: newState });
    setBiometrics(updated);
    toast({ title: newState ? "Biometria Ativada" : "Biometria Desativada" });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Helmet><title>Perfil - Ministério App</title></Helmet>
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 pt-8 pb-20 px-4 rounded-b-[2rem] shadow-xl relative">
             <div className="max-w-4xl mx-auto flex items-center gap-4">
               <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 p-1 rounded-full relative">
                  <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.photoUrl ? (
                      <img src={user.photoUrl} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
               </div>
               <div className="flex-1">
                 <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                 <p className="text-slate-400 text-sm">{user?.email}</p>
                 <span className="inline-block mt-2 px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                   {user?.userType || 'Membro'}
                 </span>
               </div>
               <Button 
                 onClick={() => setShowEditProfile(true)}
                 size="sm"
                 className="bg-white/10 hover:bg-white/20 text-white border-0"
               >
                 <Edit className="w-4 h-4 mr-2" /> Editar
               </Button>
             </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 -mt-10 space-y-6">
            
            {/* General Settings */}
            <Section title="Geral">
              <MenuItem 
                icon={theme === 'dark' ? Moon : Sun} 
                label="Tema do Aplicativo" 
                value={theme === 'dark' ? 'Escuro' : 'Claro'}
                onClick={toggleTheme}
              />
            </Section>

            {/* Security Section */}
            <Section title="Segurança">
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Biometria (FaceID/TouchID)</p>
                    <p className="text-xs text-gray-500">Usar para entrar no app</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={biometrics.enabled} onChange={handleToggleBiometrics} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <MenuItem icon={Lock} label="Alterar Senha" onClick={() => toast({ title: "Em breve" })} />
              <MenuItem icon={Shield} label="Histórico de Login" onClick={() => toast({ title: "Em breve" })} />
            </Section>

            {/* Help & Support */}
            <Section title="Ajuda e Suporte">
              <MenuItem icon={HelpCircle} label="Perguntas Frequentes (FAQ)" onClick={() => toast({ title: "Abrindo FAQ..." })} />
              <MenuItem icon={MessageSquare} label="Chat com Suporte" onClick={() => toast({ title: "Conectando..." })} />
              <MenuItem icon={FileText} label="Termos de Uso" onClick={() => toast({ title: "Abrindo termos..." })} />
            </Section>

            {/* Feedback & Suggestions */}
            <Section title="Melhorias">
              <MenuItem 
                icon={Lightbulb} 
                label="Enviar Sugestão" 
                onClick={() => setShowSuggestions(true)} 
              />
              <MenuItem 
                icon={Star} 
                label="Avaliar na Loja" 
                onClick={() => toast({ title: "Redirecionando para loja..." })} 
              />
            </Section>

            <Button 
              onClick={handleLogout} 
              className="w-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40 border-0"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sair da Conta
            </Button>
            
            <p className="text-center text-xs text-gray-400 pb-4">
              Versão 2.1.0 • By XBC Agência
            </p>
          </div>
        </div>

        <EditProfileModal isOpen={showEditProfile} onClose={() => setShowEditProfile(false)} />
        <SuggestionsModal isOpen={showSuggestions} onClose={() => setShowSuggestions(false)} />
      </MainLayout>
    </>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
    <h3 className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
      {title}
    </h3>
    <div className="divide-y divide-gray-100 dark:divide-gray-700">
      {children}
    </div>
  </div>
);

const MenuItem = ({ icon: Icon, label, value, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-medium text-gray-900 dark:text-white">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-sm text-gray-500">{value}</span>}
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </div>
  </button>
);

export default ProfilePage;
