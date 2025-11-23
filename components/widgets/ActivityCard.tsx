import React, { useState, useEffect } from 'react';
import { Flame, Footprints, Dumbbell, PersonStanding, Zap, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Simple CountUp Hook
const useCountUp = (end: number, duration: number = 1500) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            
            // Ease Out Quart
            const ease = 1 - Math.pow(1 - percentage, 4);
            
            setCount(Math.floor(end * ease));

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(end); // Ensure exact final value
            }
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [end, duration]);
    return count;
};

export const ActivityCard: React.FC = () => {
  const { todayLog, userGoals, addActivity } = useApp();

  // Animated Values
  const displaySteps = useCountUp(todayLog.stepsTaken);
  const displayCalories = useCountUp(todayLog.caloriesBurned || 0);

  // Calculate percentages
  const rawPercent = (displaySteps / userGoals.steps) * 100;
  const visualPercent = Math.min(rawPercent, 120);
  
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (visualPercent / 100) * circumference;

  const isGoalMet = rawPercent >= 100;
  const isMaxed = rawPercent >= 120;

  const handleAddWalk = (e: React.MouseEvent) => {
    e.stopPropagation();
    addActivity(1500, 15, 60);
  };

  const handleAddRun = (e: React.MouseEvent) => {
    e.stopPropagation();
    addActivity(3000, 20, 220);
  };

  const handleAddGym = (e: React.MouseEvent) => {
    e.stopPropagation();
    addActivity(0, 45, 300);
  };

  return (
    <div className={`col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border relative overflow-hidden transition-all duration-500 group ${isMaxed ? 'border-yellow-200 dark:border-yellow-900/30' : 'border-gray-100 dark:border-zinc-800'}`}>
      <style>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.8; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
          75% { opacity: 0.9; transform: scale(0.98); }
        }
        @keyframes glow-gold {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(234, 179, 8, 0.4)); }
          50% { filter: drop-shadow(0 0 15px rgba(234, 179, 8, 0.7)); }
        }
      `}</style>

      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className={`flex items-center gap-2 font-medium text-sm transition-colors duration-500 ${isMaxed ? 'text-yellow-500' : isGoalMet ? 'text-purple-500' : 'text-red-500'}`}>
          {isMaxed ? (
             <Trophy size={16} className="fill-current animate-bounce" />
          ) : isGoalMet ? (
             <Zap size={16} className="fill-current animate-pulse" />
          ) : (
             <Flame size={16} className="fill-current" style={{ animation: 'flicker 2s infinite' }} />
          )}
          {isMaxed ? 'Unstoppable!' : isGoalMet ? 'Metabolic Fire Ignited' : 'Activity & Burn'}
        </div>
        <div className="flex flex-col items-end">
             <span className="text-xs text-gray-400 dark:text-zinc-500">Burned</span>
             <span className="font-bold text-gray-800 dark:text-white tabular-nums">{displayCalories} <span className="text-xs font-normal">kcal</span></span>
        </div>
      </div>

      <div className="flex items-center gap-6 my-4 relative z-10">
        {/* 120% Interval Gauge */}
        <div className="relative w-24 h-24 flex-shrink-0 group">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
                <defs>
                    <linearGradient id="gradStandard" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                    <linearGradient id="gradSuccess" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="50%" stopColor="#d946ef" />
                        <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                    <linearGradient id="gradMax" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#facc15" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#ca8a04" />
                    </linearGradient>
                </defs>
                
                {/* Track */}
                <circle
                    cx="48" cy="48" r={radius}
                    stroke="currentColor" strokeWidth="8" fill="transparent"
                    className="text-gray-100 dark:text-zinc-800"
                />
                
                {/* Progress Ring */}
                <circle
                    cx="48" cy="48" r={radius}
                    stroke={isMaxed ? "url(#gradMax)" : isGoalMet ? "url(#gradSuccess)" : "url(#gradStandard)"}
                    strokeWidth="8" fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    style={{ 
                        filter: isMaxed 
                          ? 'drop-shadow(0 0 6px rgba(234, 179, 8, 0.6))' 
                          : isGoalMet 
                            ? 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.5))' 
                            : 'none'
                    }}
                />
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-bold transition-colors duration-500 tabular-nums ${
                  isMaxed 
                    ? 'text-yellow-500' 
                    : isGoalMet 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'text-gray-800 dark:text-white'
                }`}>
                    {Math.round(rawPercent)}<span className="text-xs">%</span>
                </span>
                <span className="text-[10px] text-gray-400">of Goal</span>
            </div>

            {/* 120% Achievement Badge */}
            {isMaxed && (
                 <div className="absolute top-0 right-0 -mr-2 -mt-2 pointer-events-none z-30">
                    <span className="flex h-6 w-6">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-gradient-to-br from-yellow-300 to-amber-500 border-2 border-white dark:border-zinc-900 items-center justify-center shadow-lg">
                        <Trophy size={12} className="text-white fill-white" />
                      </span>
                    </span>
                 </div>
            )}

            {/* 100% Achievement Badge (Only show if not maxed yet) */}
            {!isMaxed && isGoalMet && (
                 <div className="absolute top-0 right-0 -mr-1 -mt-1 pointer-events-none z-20">
                    <span className="flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white dark:border-zinc-900"></span>
                    </span>
                 </div>
            )}
        </div>

        <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">Steps</p>
                    <p className="font-bold text-lg text-gray-900 dark:text-white tabular-nums">{displaySteps.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400 dark:text-zinc-500">Active</p>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{todayLog.activeMinutes}<span className="text-xs font-normal ml-0.5">min</span></p>
                </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
                <button onClick={handleAddWalk} className="flex-1 py-2 bg-gray-50 dark:bg-zinc-800 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors active:scale-95 group/btn border border-transparent hover:border-gray-200 dark:hover:border-zinc-700">
                    <PersonStanding size={16} className="text-blue-500 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-gray-600 dark:text-zinc-400">Walk</span>
                </button>
                <button onClick={handleAddRun} className="flex-1 py-2 bg-gray-50 dark:bg-zinc-800 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors active:scale-95 group/btn border border-transparent hover:border-gray-200 dark:hover:border-zinc-700">
                    <Footprints size={16} className="text-orange-500 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-gray-600 dark:text-zinc-400">Run</span>
                </button>
                <button onClick={handleAddGym} className="flex-1 py-2 bg-gray-50 dark:bg-zinc-800 rounded-xl flex flex-col items-center gap-1 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors active:scale-95 group/btn border border-transparent hover:border-gray-200 dark:hover:border-zinc-700">
                    <Dumbbell size={16} className="text-purple-500 group-hover/btn:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-gray-600 dark:text-zinc-400">Gym</span>
                </button>
            </div>
        </div>
      </div>
      
      {/* Background Decoration */}
      {isMaxed ? (
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      ) : isGoalMet ? (
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      ) : null}
    </div>
  );
};