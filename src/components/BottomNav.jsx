import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Mic, Calendar, User, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: Home, label: 'Início' },
    { path: '/bible', icon: BookOpen, label: 'Bíblia' },
    { path: '/agenda', icon: Calendar, label: 'Agenda' },
    { path: '/sermons', icon: Mic, label: 'Sermões' },
    { path: '/formation', icon: GraduationCap, label: 'Formação' },
    { path: '/profile', icon: User, label: 'Perfil' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 md:hidden overflow-x-auto">
      <div className="flex items-center justify-between px-2 py-2 min-w-max w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 py-2 px-3 relative min-w-[64px]"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Icon 
                className={`w-6 h-6 relative z-10 transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 dark:text-gray-600'
                }`} 
              />
              <span 
                className={`text-[10px] font-medium relative z-10 transition-colors ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
