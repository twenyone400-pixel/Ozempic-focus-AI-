
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Droplets, Flame, Utensils, ChevronRight, Activity } from 'lucide-react';

export const Journal: React.FC = () => {
  const { todayLog, history } = useApp();

  // Fix: Combine todayLog and history without duplicates
  const sortedLogs = useMemo(() => {
    // Filter out today's date from history to avoid duplication with the live 'todayLog'
    const pastLogs = history.filter(log => log.date !== todayLog.date);
    
    // Combine and sort by date descending (newest first)
    return [todayLog, ...pastLogs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [todayLog, history]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) return 'Today';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="px-4 pb-32 pt-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="text-indigo-600 dark:text-indigo-400" /> Journal History
        </h1>
        <div className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            {sortedLogs.length} Days Tracked
        </div>
      </div>

      <div className="space-y-4">
        {sortedLogs.map((log, index) => {
          const isToday = log.date === todayLog.date;
          const hasFood = log.foods && log.foods.length > 0;

          return (
            <div 
              key={log.date} 
              className={`bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border transition-all duration-300 ${isToday ? 'border-indigo-200 dark:border-indigo-900/50 ring-1 ring-indigo-100 dark:ring-indigo-900/20' : 'border-gray-100 dark:border-zinc-800'}`}
            >
               {/* Date Header */}
               <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold text-xs ${isToday ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'}`}>
                        <span>{new Date(log.date).getDate()}</span>
                        <span className="text-[8px] uppercase">{new Date(log.date).toLocaleDateString('en-US', {weekday: 'short'})}</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800 dark:text-white">
                        {formatDate(log.date)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-zinc-500">
                        {log.caloriesConsumed} kcal consumed
                      </p>
                    </div>
                  </div>
                  {log.medicationTaken && (
                     <div className="flex flex-col items-end">
                        <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-lg text-[10px] font-bold border border-indigo-100 dark:border-indigo-800">
                            Medication
                        </span>
                     </div>
                  )}
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded-2xl flex flex-col items-center justify-center gap-1">
                     <Droplets size={14} className="text-blue-500" />
                     <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{log.waterIntake}ml</span>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/10 p-2 rounded-2xl flex flex-col items-center justify-center gap-1">
                     <Utensils size={14} className="text-orange-500" />
                     <span className="text-xs font-bold text-orange-700 dark:text-orange-300">{log.proteinConsumed}g Prot</span>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/10 p-2 rounded-2xl flex flex-col items-center justify-center gap-1">
                     <Flame size={14} className="text-red-500" />
                     <span className="text-xs font-bold text-red-700 dark:text-red-300">{log.activeMinutes}m Act</span>
                  </div>
               </div>

               {/* Food List Accordion-style */}
               <div className="space-y-3 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl p-3">
                 {hasFood ? (
                   log.foods.map((food, i) => (
                     <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-zinc-700/50 last:border-0 pb-2 last:pb-0">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <div className="w-8 h-8 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center text-sm shadow-sm shrink-0">
                             {i % 2 === 0 ? '🥗' : '🥩'}
                           </div>
                           <div className="min-w-0">
                              <p className="font-medium text-gray-800 dark:text-zinc-200 truncate pr-2">{food.name}</p>
                              <p className="text-[10px] text-gray-400 dark:text-zinc-500">{new Date(food.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                           </div>
                        </div>
                        <div className="text-right shrink-0">
                           <p className="font-bold text-gray-700 dark:text-zinc-300">{food.calories}</p>
                           <p className="text-[10px] text-gray-400 dark:text-zinc-500">kcal</p>
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="flex items-center justify-center gap-2 py-2 text-gray-400 dark:text-zinc-600">
                      <Activity size={14} />
                      <span className="text-xs italic">No meals logged for this day</span>
                   </div>
                 )}
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
