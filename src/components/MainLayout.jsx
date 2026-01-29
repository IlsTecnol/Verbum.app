import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Mic, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
const MainLayout = ({
  children
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [{
    path: '/home',
    icon: Home,
    label: 'Início'
  }, {
    path: '/bible',
    icon: BookOpen,
    label: 'Bíblia'
  }, {
    path: '/agenda',
    icon: Calendar,
    label: 'Agenda'
  }, {
    path: '/sermons',
    icon: Mic,
    label: 'Sermões'
  }, {
    path: '/profile',
    icon: User,
    label: 'Perfil'
  }];
  return <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 bottom-0 z-40">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-white">V</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verbum App</h2>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return <button key={item.path} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  {isActive && <motion.div layoutId="activeSidebar" className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-xl" transition={{
                type: "spring",
                duration: 0.5
              }} />}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium relative z-10">{item.label}</span>
                </button>;
          })}
          </div>
        </nav>

        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            By XBC Agência
          </p>
        </div>
      </aside>

      <main className="flex-1 md:ml-64">
        {children}
      </main>

      <BottomNav />
    </div>;
};
export default MainLayout;
