
import React, { useState } from 'react';
import { MedicationCard } from '../components/widgets/MedicationCard';
import { FiberCard } from '../components/widgets/FiberCard';
import { WaterCard } from '../components/widgets/WaterCard';
import { ProteinCard } from '../components/widgets/ProteinCard';
import { ActivityCard } from '../components/widgets/ActivityCard';
import { WeightCard } from '../components/widgets/WeightCard';
import { FastingCard } from '../components/widgets/FastingCard';
import { InsightCard } from '../components/widgets/InsightCard';
import { PerformanceCard } from '../components/widgets/PerformanceCard'; // Assuming this exists or we skip it
import { SOSButton } from '../components/widgets/SOSButton';
import { ShoppingListModal } from '../components/widgets/ShoppingListModal';
import { useApp } from '../context/AppContext';
import { Award, ShoppingCart, Camera, ChevronRight, Plus } from 'lucide-react';
import { View } from '../types';

export const Dashboard: React.FC = () => {
  const { todayLog, userGoals, setCurrentView } = useApp();
  const [showShopping, setShowShopping] = useState(false);

  const totalCarbs = todayLog.foods.reduce((acc, f) => acc + f.carbs, 0);
  const totalFat = todayLog.foods.reduce((acc, f) => acc + f.fat, 0);
  const totalCalories = todayLog.caloriesConsumed;

  // Generic Targets for bars (since userGoals might not have carbs/fat specific goals yet)
  const carbGoal = 250;
  const fatGoal = 70;

  return (
    <div className="px-4 pb-32 pt-4 relative">
      {/* SOS Feature */}
      <SOSButton />

      {/* Shopping List Modal */}
      {showShopping && <ShoppingListModal onClose={() => setShowShopping(false)} />}
      
      {/* Header Section */}
      <div className="flex justify-between items-end mb-4 px-1">
         <div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lifestyle</h1>
             <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 dark:text-yellow-500 mt-1">
                 <Award size={12} /> Health Level 4
             </div>
         </div>
         <div className="flex gap-2">
             <button 
                onClick={() => setShowShopping(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
             >
                <ShoppingCart size={14} /> List
             </button>
             <span className="text-xs text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-1.5 rounded-xl flex items-center">Today</span>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        
        {/* Row 1: Protein (Big Left) & Fiber/Water (Right Stack) */}
        
        {/* Protein - Spans 2 rows vertically on the left */}
        <div className="col-span-1 row-span-2 h-full animate-in slide-in-from-bottom-4 fade-in duration-700 delay-0 fill-mode-backwards">
            <ProteinCard />
        </div>

        {/* Fiber - Top Right */}
        <div className="col-span-1 h-full animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100 fill-mode-backwards">
            <FiberCard />
        </div>

        {/* Water - Bottom Right */}
        <div className="col-span-1 h-full animate-in slide-in-from-bottom-4 fade-in duration-700 delay-150 fill-mode-backwards">
            <WaterCard />
        </div>

        {/* Row 2: "Nutrition Breakdown" - Interactive Card */}
        <div className="col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200 relative overflow-hidden group">
           
           <div className="flex justify-between items-center mb-3">
             <h3 className="font-bold text-gray-900 dark:text-white text-sm">Macro Tracker</h3>
             <button 
                onClick={() => setCurrentView(View.SCANNER)}
                className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 active:scale-95"
             >
                <Camera size={14} /> Scan Meal
             </button>
           </div>

           {totalCalories === 0 ? (
               <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-800 p-3 rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors" onClick={() => setCurrentView(View.SCANNER)}>
                   <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-gray-400">
                       <Plus size={20} />
                   </div>
                   <div className="flex-1">
                       <p className="text-sm font-bold text-gray-800 dark:text-zinc-200">Log your first meal</p>
                       <p className="text-xs text-gray-400">See calories, carbs & fat data here</p>
                   </div>
                   <ChevronRight size={16} className="text-gray-400" />
               </div>
           ) : (
               <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-2xl flex flex-col justify-between h-full">
                     <p className="text-[10px] text-gray-500 dark:text-zinc-400 mb-1">Calories</p>
                     <div>
                        <p className="font-bold text-gray-800 dark:text-white text-sm">
                          {totalCalories}<span className="text-[10px] font-normal text-gray-400">/{userGoals.calories}</span>
                        </p>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-black dark:bg-white rounded-full" style={{ width: `${Math.min((totalCalories/userGoals.calories)*100, 100)}%` }}></div>
                        </div>
                     </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-2xl flex flex-col justify-between h-full">
                     <p className="text-[10px] text-gray-500 dark:text-zinc-400 mb-1">Carbs</p>
                     <div>
                        <p className="font-bold text-gray-800 dark:text-white text-sm">
                            {totalCarbs}<span className="text-[10px] font-normal text-gray-400">g</span>
                        </p>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((totalCarbs/carbGoal)*100, 100)}%` }}></div>
                        </div>
                     </div>
                  </div>
                   <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-2xl flex flex-col justify-between h-full">
                     <p className="text-[10px] text-gray-500 dark:text-zinc-400 mb-1">Fat</p>
                     <div>
                        <p className="font-bold text-gray-800 dark:text-white text-sm">
                            {totalFat}<span className="text-[10px] font-normal text-gray-400">g</span>
                        </p>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-zinc-700 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min((totalFat/fatGoal)*100, 100)}%` }}></div>
                        </div>
                     </div>
                  </div>
               </div>
           )}
        </div>

        {/* Row 3: Activity & Steps */}
        <div className="col-span-2 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
            <ActivityCard />
        </div>

        {/* Row 4: Weight & Fasting */}
        <div className="col-span-1 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-400">
            <WeightCard />
        </div>
        <div className="col-span-1 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-400">
            <FastingCard />
        </div>

        {/* Row 5: Medication & Insight */}
        <div className="col-span-2 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-500">
            <MedicationCard />
        </div>
        <div className="col-span-2 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-600">
             <InsightCard />
        </div>

      </div>
    </div>
  );
};
