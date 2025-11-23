
import React, { useState } from 'react';
import { Fish, Plus, Minus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProteinCard: React.FC = () => {
  const { todayLog, userGoals, addProtein } = useApp();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const percentage = Math.min((todayLog.proteinConsumed / userGoals.protein) * 100, 100);
  const radius = 50; // Bigger radius for the 'main' card
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleAdd = () => {
    addProtein(5);
    triggerAnimation();
  };

  const handleSubtract = () => {
    addProtein(-5);
    triggerAnimation();
  };

  return (
    <div className="h-full bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-between relative overflow-hidden group">
      
      <div className="w-full flex items-center gap-2 mb-2 text-orange-500 font-bold text-sm self-start">
         <Fish size={16} className="fill-current" /> Protein
      </div>

      <div className="relative flex items-center justify-center my-2">
        <div className="relative w-36 h-36 flex items-center justify-center">
           {/* Background Track */}
           <svg className="w-full h-full transform -rotate-90">
             <circle 
               cx="72" cy="72" r={radius} 
               stroke="currentColor" strokeWidth="10" fill="transparent" 
               className="text-gray-100 dark:text-zinc-800" 
             />
             <circle 
               cx="72" cy="72" r={radius} 
               stroke="#f97316" strokeWidth="10" fill="transparent" 
               strokeDasharray={circumference}
               strokeDashoffset={strokeDashoffset}
               strokeLinecap="round"
               className="transition-all duration-1000 ease-out"
             />
           </svg>
           
           <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {todayLog.proteinConsumed}
                  </span>
                  <span className="text-sm text-gray-400">/{userGoals.protein}g</span>
              </div>
           </div>
        </div>
      </div>
       
      <div className="flex gap-4 w-full justify-center pb-2">
        <button onClick={handleSubtract} className="w-8 h-8 rounded-full bg-gray-50 dark:bg-zinc-800 text-gray-400 flex items-center justify-center hover:bg-gray-100"><Minus size={14} /></button>
        <button onClick={handleAdd} className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center hover:bg-orange-200"><Plus size={14} /></button>
      </div>
    </div>
  );
};
