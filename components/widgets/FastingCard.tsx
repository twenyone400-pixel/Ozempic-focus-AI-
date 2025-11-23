
import React, { useEffect, useState } from 'react';
import { Timer, Play, Square, Zap, Flame, Brain } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FastingCard: React.FC = () => {
  const { fastingStart, toggleFasting } = useApp();
  const [elapsed, setElapsed] = useState<number>(0);

  useEffect(() => {
    if (!fastingStart) {
      setElapsed(0);
      return;
    }
    const interval = setInterval(() => {
      const start = new Date(fastingStart).getTime();
      const now = new Date().getTime();
      setElapsed(Math.floor((now - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [fastingStart]);

  // Time Formatting
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  // Fasting Stages Logic (Zero App Style)
  const getStage = (hrs: number) => {
      if (hrs < 4) return { label: 'Digesting', icon: Timer, color: 'text-gray-400', desc: 'Blood sugar rises' };
      if (hrs < 12) return { label: 'Stabilizing', icon: Zap, color: 'text-blue-400', desc: 'Insulin drops' };
      if (hrs < 18) return { label: 'Burning Fat', icon: Flame, color: 'text-orange-500', desc: 'Ketosis begins' };
      return { label: 'Autophagy', icon: Brain, color: 'text-purple-500', desc: 'Cell repair' };
  };

  const stage = getStage(hours);
  const StageIcon = stage.icon;

  // Progress Ring (16h Target)
  const goalSeconds = 16 * 3600;
  const progress = Math.min((elapsed / goalSeconds) * 100, 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden transition-all duration-300 min-h-[180px] flex flex-col justify-between group hover:border-orange-200 dark:hover:border-orange-900/50">
      
      {/* Header */}
      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-sm">
              <Timer size={16} className={`fill-current ${fastingStart ? 'animate-spin-slow' : ''}`} /> 
              Fasting Timer
            </div>
            {fastingStart && (
                <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-0.5 ml-6">Target: 16h</span>
            )}
        </div>
        {fastingStart && (
           <div className={`px-2 py-1 bg-gray-50 dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700 flex items-center gap-1.5 ${stage.color}`}>
             <StageIcon size={12} className="animate-pulse" />
             <span className="text-[10px] font-bold uppercase">{stage.label}</span>
           </div>
        )}
      </div>

      {/* Center Visual */}
      <div className="flex-1 flex items-center justify-center relative z-10 my-2">
        {fastingStart ? (
            <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Background Ring */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100 dark:text-zinc-800" />
                    <circle 
                        cx="56" cy="56" r={radius} 
                        stroke="#f97316" strokeWidth="6" fill="transparent" 
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                        className="transition-all duration-1000 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                    />
                </svg>
                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums tracking-tight">
                        {hours}:{minutes.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500">{stage.desc}</span>
                </div>
            </div>
        ) : (
            <div className="text-center scale-95 group-hover:scale-100 transition-transform">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-2 text-orange-500">
                    <Flame size={24} className="fill-current" />
                </div>
                <p className="text-gray-400 dark:text-zinc-500 text-xs mb-1">Window closed?</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">Start Fast</p>
            </div>
        )}
      </div>

      {/* Action Button */}
      <button 
        onClick={toggleFasting}
        className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all active:scale-95 ${
            fastingStart 
            ? 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 border border-transparent hover:border-red-100' 
            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/30 hover:shadow-xl'
        }`}
      >
        {fastingStart ? (
            <><Square size={14} fill="currentColor"/> End Fast</>
        ) : (
            <><Play size={14} fill="currentColor"/> Start Timer</>
        )}
      </button>
    </div>
  );
};
