
import React, { useState, useEffect, useRef } from 'react';
import { Target, Plus, ChevronRight, Scale, Check, X } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import { MOCK_WEIGHT_HISTORY } from '../../constants';

export const WeightCard: React.FC = () => {
  const { todayLog, userGoals, updateWeight, updateUserGoals, theme, userProfile } = useApp();
  
  // Goal Editing State
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(userGoals.weight);
  
  // Weight Editing State
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [tempWeight, setTempWeight] = useState('');
  const weightInputRef = useRef<HTMLInputElement>(null);
  
  // Animation state for weight
  const [displayWeight, setDisplayWeight] = useState(0);

  // Animate weight changes
  useEffect(() => {
    const duration = 1000;
    const end = todayLog.weight || userProfile?.startWeight || 0;
    const start = displayWeight || end - 2; // Approximate start for smoothness
    
    let startTime: number | null = null;
    let animId: number;
    
    const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        
        setDisplayWeight(Number((start + (end - start) * ease).toFixed(1)));
        
        if (progress < 1) {
            animId = requestAnimationFrame(animate);
        }
    };
    
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [todayLog.weight, userProfile?.startWeight]);

  // Sync temps
  useEffect(() => {
    setTempGoal(userGoals.weight);
  }, [userGoals.weight]);

  const percentage = Math.round((todayLog.weight / userGoals.weight) * 100);
  // Calculate change from start
  const startWeight = userProfile?.startWeight || 85; 
  const change = todayLog.weight - startWeight;

  // --- Handlers for Current Weight ---
  const handleEditWeight = (e: React.MouseEvent) => {
      e.stopPropagation();
      setTempWeight(todayLog.weight.toString());
      setIsEditingWeight(true);
  };

  const saveWeight = () => {
      const val = parseFloat(tempWeight);
      if (!isNaN(val) && val > 0) {
          updateWeight(val);
      }
      setIsEditingWeight(false);
  };

  const handleWeightKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          saveWeight();
      } else if (e.key === 'Escape') {
          setIsEditingWeight(false);
      }
  };

  // --- Handlers for Goal ---
  const saveGoal = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      updateUserGoals({ ...userGoals, weight: tempGoal });
      setIsEditingGoal(false);
  };

  const toggleEditGoal = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isEditingGoal) {
          setTempGoal(userGoals.weight);
      }
      setIsEditingGoal(!isEditingGoal);
  };

  const handleGoalKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          saveGoal(e);
      } else if (e.key === 'Escape') {
          setIsEditingGoal(false);
      }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-between relative overflow-hidden min-h-[180px] transition-all duration-300 group hover:shadow-md hover:border-purple-200 dark:hover:border-purple-900/40">
      
      {/* Header & Goal Interaction */}
      <div className="flex justify-between items-start mb-2 z-10 relative">
        <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400 font-medium text-sm">
          <Scale size={16} className="text-purple-500" /> 
          <span>Current Weight</span>
        </div>
        
        {/* Interactive Goal Pill */}
        <div 
            onClick={toggleEditGoal}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all duration-300 backdrop-blur-md border ${isEditingGoal ? 'bg-purple-600 border-purple-600 text-white w-auto shadow-lg shadow-purple-900/20' : 'bg-purple-50 dark:bg-purple-900/20 border-transparent text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40'}`}
        >
            <Target size={12} />
            {isEditingGoal ? (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                    <span className="whitespace-nowrap">Goal:</span>
                    <input 
                        type="number" 
                        value={tempGoal}
                        onChange={(e) => setTempGoal(Number(e.target.value))}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={handleGoalKeyDown}
                        className="w-12 bg-white/20 text-white border-b border-white/50 focus:outline-none text-center p-0 appearance-none font-bold"
                        autoFocus
                    />
                    <button onClick={saveGoal} className="bg-white text-purple-600 rounded-full w-4 h-4 flex items-center justify-center hover:scale-110 transition-transform">
                        <Check size={10} strokeWidth={3} />
                    </button>
                </div>
            ) : (
                <span>Goal: {userGoals.weight}kg</span>
            )}
        </div>
      </div>

      {/* Premium Background Chart */}
      <div className="absolute inset-x-0 bottom-0 h-32 z-0 opacity-30 pointer-events-none mask-image-gradient group-hover:opacity-40 transition-opacity duration-500">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_WEIGHT_HISTORY}>
                <defs>
                    <linearGradient id="colorWeightPurple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={theme === 'dark' ? '#c084fc' : '#a855f7'} 
                  strokeWidth={3} 
                  fill="url(#colorWeightPurple)" 
                  isAnimationActive={true}
                  animationDuration={2000}
                />
            </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Main Content */}
      <div className="mt-2 z-10 flex items-end justify-between relative">
        <div onClick={handleEditWeight} className="cursor-pointer group/weight relative">
            {isEditingWeight ? (
                 <div className="flex items-baseline animate-in fade-in duration-200">
                    <input
                        ref={weightInputRef}
                        type="number"
                        value={tempWeight}
                        onChange={(e) => setTempWeight(e.target.value)}
                        onBlur={saveWeight}
                        onKeyDown={handleWeightKeyDown}
                        className="text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-b-2 border-purple-500 outline-none w-28 p-0 m-0 tabular-nums"
                        autoFocus
                    />
                    <span className="text-sm text-gray-500 dark:text-zinc-500 font-medium ml-1">kg</span>
                 </div>
            ) : (
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-1 relative">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight tabular-nums group-hover/weight:text-purple-600 dark:group-hover/weight:text-purple-400 transition-colors duration-300">
                            {displayWeight.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-zinc-500 font-medium">kg</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-bold ${change <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {change > 0 ? '+' : ''}{change.toFixed(1)}kg
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-zinc-600">since start</span>
                    </div>
                </div>
            )}
        </div>
        
        <button 
            onClick={handleEditWeight}
            className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xl shadow-purple-900/20 active:scale-90 transition-all hover:scale-110 group-hover:bg-purple-600 dark:group-hover:bg-purple-400 group-hover:text-white"
        >
            <Plus size={24} />
        </button>
      </div>
    </div>
  );
};
