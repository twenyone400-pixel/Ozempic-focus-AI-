
import React, { useState } from 'react';
import { Info, Check, AlertCircle, X, Save, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from 'recharts';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SYMPTOMS_LIST = ['Nausea', 'Headache', 'Fatigue', 'Constipation', 'Dizziness', 'Heartburn'];

export const MedicationCard: React.FC = () => {
  const { medicationSchedule, toggleMedication, logSymptom, theme } = useApp();
  const [showSideEffects, setShowSideEffects] = useState(false);
  const [symptomLevels, setSymptomLevels] = useState<Record<string, number>>({});

  const getWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); 
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const today = new Date().toISOString().split('T')[0];

  // SCIENTIFIC PHARMACOKINETIC SIMULATION (Sawtooth Wave with Decay)
  const generatePharmacokinetics = () => {
     const data = [];
     const halfLifeDays = 7; 
     const decayRate = Math.pow(0.5, 1/halfLifeDays); // Daily decay factor
     
     // Simulate a previous build up (steady state assumption for visuals)
     let currentConcentration = 50; 

     for(let i=0; i<7; i++) {
        // If it's injection day (and taken), spike the concentration
        const isInjDay = ((i + 1) % 7) === medicationSchedule.injectionDay;
        
        if (isInjDay) {
            currentConcentration += 50; // Add dose
        }

        // Decay
        currentConcentration = currentConcentration * decayRate;

        data.push({ 
            day: DAYS[i], 
            level: Math.round(currentConcentration),
            isPeak: isInjDay
        });
     }
     return data;
  };

  const curveData = generatePharmacokinetics();

  const handleSymptomChange = (symptom: string, level: number) => {
      setSymptomLevels(prev => ({ ...prev, [symptom]: level }));
  };

  const saveSymptoms = () => {
      logSymptom(symptomLevels);
      setShowSideEffects(false);
      setSymptomLevels({});
      // Show success feedback logic could go here
  };

  return (
    <div className="col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden transition-colors duration-300 group">
      
      {/* Top Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wide mb-1">
            <Activity size={12} /> Pharmacokinetics
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{medicationSchedule.drugName}</h2>
          <div className="flex gap-2 mt-1">
             <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 text-[10px] rounded-md font-mono">
                {medicationSchedule.dosage}
             </span>
             <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 text-[10px] rounded-md font-mono">
                HL: ~7 Days
             </span>
          </div>
        </div>
        
        <button 
            onClick={() => setShowSideEffects(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
        >
            <AlertCircle size={12} /> Log Symptoms
        </button>
      </div>

      {/* Main Graph - Pharmacokinetics */}
      <div className="h-24 w-full mb-4 relative">
         <div className="absolute top-2 left-2 text-[10px] text-gray-400 z-20 font-medium">Est. Concentration</div>
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={curveData}>
                <defs>
                    <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <Tooltip 
                    contentStyle={{backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '8px', border: 'none', fontSize: '10px'}}
                    formatter={(val: any) => [`${val}%`, 'Level']}
                    cursor={{stroke: '#a1a1aa', strokeWidth: 1, strokeDasharray: '3 3'}}
                />
                <Area 
                    type="monotone" 
                    dataKey="level" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    fill="url(#colorLevel)"
                    animationDuration={2000}
                />
            </AreaChart>
         </ResponsiveContainer>
      </div>

      {/* Weekly Tracker */}
      <div className="flex justify-between items-end relative z-10">
        {DAYS.map((day, index) => {
          const dateKey = weekDates[index];
          const isTaken = medicationSchedule.history[dateKey];
          const isToday = dateKey === today;
          const isInjectionDay = ((index + 1) % 7) === medicationSchedule.injectionDay;

          return (
            <div key={day} className="flex flex-col items-center gap-2 group/day">
              {/* Concentration Dot Indicator */}
              <div 
                className="w-1 h-1 rounded-full transition-all"
                style={{ 
                    backgroundColor: isToday ? '#6366f1' : '#d4d4d8', 
                    opacity: curveData[index].level / 100 
                }} 
              />
              
              <button
                onClick={() => toggleMedication(dateKey)}
                className={`relative w-8 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isTaken 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40' 
                    : isInjectionDay
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-400'
                      : 'bg-gray-50 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600'
                }`}
              >
                {isTaken ? (
                    <Check size={16} strokeWidth={4} />
                ) : (
                    <div className={`w-1.5 h-1.5 rounded-full ${isInjectionDay ? 'bg-indigo-400' : 'bg-gray-200 dark:bg-zinc-600'}`} />
                )}
              </button>
              
              <span className={`text-[9px] font-bold uppercase ${isToday ? 'text-indigo-600' : 'text-gray-300 dark:text-zinc-600'}`}>
                {day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Side Effects Modal Overlay */}
      {showSideEffects && (
        <div className="absolute inset-0 z-50 bg-white dark:bg-zinc-900 p-5 animate-in slide-in-from-bottom-10 duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg dark:text-white">How do you feel?</h3>
                <button onClick={() => setShowSideEffects(false)} className="p-1 bg-gray-100 dark:bg-zinc-800 rounded-full">
                    <X size={16} className="text-gray-500" />
                </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">Log intensity from 0 (None) to 3 (Severe)</p>
            
            <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[140px] mb-4 pr-1">
                {SYMPTOMS_LIST.map(symptom => (
                    <div key={symptom} className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-xl">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold dark:text-zinc-300">{symptom}</span>
                            <span className="text-xs font-mono text-indigo-500">{symptomLevels[symptom] || 0}</span>
                        </div>
                        <input 
                            type="range" min="0" max="3" step="1"
                            value={symptomLevels[symptom] || 0}
                            onChange={(e) => handleSymptomChange(symptom, Number(e.target.value))}
                            className="w-full accent-indigo-600 h-1 bg-gray-200 dark:bg-zinc-700 rounded-full appearance-none"
                        />
                    </div>
                ))}
            </div>
            
            <button 
                onClick={saveSymptoms}
                className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
                <Save size={16} /> Save Log
            </button>
        </div>
      )}
    </div>
  );
};
