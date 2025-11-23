
import React, { useState } from 'react';
import { Leaf, Plus, Minus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FiberCard: React.FC = () => {
  const { todayLog, userGoals, addFiber } = useApp();
  const [bump, setBump] = useState(false);
  
  const percentage = Math.min((todayLog.fiberConsumed / userGoals.fiber) * 100, 100);

  const handleAdd = (amount: number) => {
    addFiber(amount);
    setBump(true);
    setTimeout(() => setBump(false), 300);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-between min-h-[180px] transition-colors duration-300 relative overflow-hidden">
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
      `}</style>

      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-2 text-green-600 dark:text-green-500 font-medium text-sm">
          <Leaf 
            size={16} 
            className={`fill-current origin-bottom-right ${bump ? 'animate-[sway_0.5s_ease-in-out]' : ''}`} 
          /> 
          Fiber
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-lg">
            <span>Goal: {userGoals.fiber}g</span>
        </div>
      </div>

      <div className="my-4 z-10">
        <div className="flex items-baseline gap-1 mb-3">
            <span className={`text-3xl font-bold text-gray-800 dark:text-white transition-transform duration-300 ${bump ? 'scale-110 text-green-600' : ''}`}>
              {todayLog.fiberConsumed}g
            </span>
            <span className="text-sm text-gray-400 dark:text-zinc-600">/ {userGoals.fiber}g</span>
        </div>

        <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden w-full mb-2 relative">
            {/* Background Track */}
            <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{ width: `${percentage}%` }}
            >
               {/* Shimmer Effect */}
               <div 
                 className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                 style={{ animation: 'shimmer 2s infinite' }}
               ></div>
            </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-auto z-10">
        <button 
           onClick={() => handleAdd(-1)}
           className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 active:scale-90 transition-all duration-200"
        >
           <Minus size={16} className="text-gray-500 dark:text-zinc-400" />
        </button>
        
        <button 
           onClick={() => handleAdd(3)}
           className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center border border-green-100 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 active:scale-90 transition-all duration-200 shadow-lg shadow-green-200 dark:shadow-green-900/20"
        >
           <Plus size={16} className="text-green-600 dark:text-green-400" />
        </button>
      </div>

      {/* Background Leaf Pattern */}
      <div className="absolute -right-2 -bottom-6 opacity-5 dark:opacity-[0.02] transform rotate-12 pointer-events-none">
         <Leaf size={120} />
      </div>
    </div>
  );
};
