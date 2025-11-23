
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { View } from '../types';
import { Home, BarChart2, User, BookOpen, Sparkles, Camera, MessageCircle, X } from 'lucide-react';

interface NavItem {
  id: View | string;
  icon: any;
  label: string;
  isAction?: boolean;
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentView, setCurrentView } = useApp();
  const [showAiMenu, setShowAiMenu] = useState(false);

  const navItems: NavItem[] = [
    { id: View.DASHBOARD, icon: Home, label: 'Home' },
    { id: View.ANALYTICS, icon: BarChart2, label: 'Stats' },
    { id: 'AI_HUB', icon: Sparkles, label: 'AI Hub', isAction: true },
    { id: View.JOURNAL, icon: BookOpen, label: 'Journal' },
    { id: View.PROFILE, icon: User, label: 'Profile' }
  ];

  const handleAiAction = (view: View) => {
    setCurrentView(view);
    setShowAiMenu(false);
  };

  return (
    <div className="h-[100dvh] max-w-md mx-auto bg-gray-50 dark:bg-black relative shadow-2xl overflow-hidden flex flex-col transition-colors duration-500">
      {/* Top Status Bar Spacer */}
      <div className="h-safe-top w-full bg-transparent" />

      {/* Main Content Area with Animation Key */}
      <main 
        key={currentView} // Triggers animation on view change
        className="flex-1 overflow-y-auto no-scrollbar pb-40 page-enter overscroll-contain"
      >
        {children}
      </main>

      {/* AI Menu Overlay */}
      {showAiMenu && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[60] animate-in fade-in duration-300 flex flex-col justify-end pb-32 px-6">
           <div className="grid grid-cols-2 gap-4 mb-4">
              <button 
                onClick={() => handleAiAction(View.SCANNER)}
                className="bg-white dark:bg-zinc-900 p-6 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-all hover:scale-105 duration-300 shadow-xl border border-white/10"
              >
                 <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Camera size={28} />
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white">Scan Food</span>
              </button>
              <button 
                onClick={() => handleAiAction(View.AI_CHAT)}
                className="bg-white dark:bg-zinc-900 p-6 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-all hover:scale-105 duration-300 shadow-xl border border-white/10"
              >
                 <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <MessageCircle size={28} />
                 </div>
                 <span className="font-bold text-gray-900 dark:text-white">Chat Coach</span>
              </button>
           </div>
           <button 
             onClick={() => setShowAiMenu(false)}
             className="bg-white/10 text-white p-4 rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/20 transition-colors"
           >
             <X size={24} />
           </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 glass-light dark:glass-dark border-t-0 px-6 py-4 pb-8 flex justify-between items-center rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 transition-all duration-300">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={() => setShowAiMenu(true)}
                className="relative -top-8 bg-black dark:bg-white text-white dark:text-black p-5 rounded-full shadow-xl shadow-indigo-500/30 dark:shadow-white/20 transform transition-all active:scale-90 hover:scale-110 flex items-center justify-center ring-8 ring-gray-50 dark:ring-black bg-gradient-to-tr from-indigo-600 to-purple-600 dark:from-white dark:to-gray-200"
              >
                <Icon size={28} strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => setCurrentView(item.id as View)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 w-14 group ${isActive ? 'text-indigo-600 dark:text-white -translate-y-1' : 'text-gray-400 dark:text-zinc-600 hover:text-gray-600 dark:hover:text-zinc-400'}`}
            >
              <div className="relative">
                 <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={`transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-110'}`} />
                 {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-600 dark:bg-white rounded-full" />}
              </div>
              <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'opacity-100 font-bold translate-y-0' : 'opacity-0 translate-y-2 hidden'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
