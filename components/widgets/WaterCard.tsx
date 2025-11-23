
import React from 'react';
import { Droplets, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WaterCard: React.FC = () => {
  const { todayLog, userGoals, addWater } = useApp();
  const percentage = Math.min((todayLog.waterIntake / userGoals.water) * 100, 100);
  const displayLiters = (todayLog.waterIntake / 1000).toFixed(1);

  return (
    <div className="h-full bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
          <Droplets size={16} className="fill-current" /> Water
        </div>
        <button 
           onClick={() => addWater(250)}
           className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100"
        >
           <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
         <div className="relative w-12 h-20 bg-blue-50 dark:bg-zinc-800 rounded-xl overflow-hidden border-2 border-white dark:border-zinc-700 shadow-inner">
            <div className="absolute bottom-0 w-full bg-blue-400 transition-all duration-1000" style={{ height: `${percentage}%` }}></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold z-10 mix-blend-multiply dark:mix-blend-normal text-blue-900 dark:text-white">
                {displayLiters}L
            </div>
         </div>
      </div>
      
      <div className="text-center mt-1">
         <p className="text-[10px] text-gray-400">Goal: {(userGoals.water/1000).toFixed(1)}L</p>
      </div>
    </div>
  );
};
