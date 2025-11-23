
import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import { Target, Flame, FileText, Download, AlertCircle } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { theme, history, todayLog, userProfile, userGoals } = useApp();

  // Process real data from history and today's log
  const finalData = useMemo(() => {
    // 1. Combine History and Today
    const historyWithoutToday = history.filter(h => h.date !== todayLog.date);
    const combined = [...historyWithoutToday, todayLog];

    // 2. Sort by Date Ascending
    combined.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 3. Take last 7 entries for the weekly report
    const recent = combined.slice(-7);

    // 4. Map to Chart Format
    return recent.map(log => {
        const dateObj = new Date(log.date);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        
        let sScore = 0;
        if (log.symptoms && log.symptoms.symptoms) {
            // Explicitly cast to number[] to handle potential type inference issues with Object.values
            sScore = (Object.values(log.symptoms.symptoms) as number[]).reduce((sum: number, val: number) => sum + val, 0);
        }

        return {
            name: dayName,
            fullDate: log.date,
            weight: log.weight > 0 ? log.weight : (userProfile?.startWeight || 0),
            calories: log.caloriesConsumed,
            burn: log.caloriesBurned || 0,
            protein: log.proteinConsumed,
            symptomScore: sScore
        };
    });
  }, [history, todayLog, userProfile]);

  // Generate Dynamic Clinical Note based on the data
  const clinicalNote = useMemo(() => {
    if (finalData.length === 0) return "No clinical data recorded yet. Log your daily metrics to generate a report.";
    
    // Weight Logic
    const startW = finalData[0].weight;
    const endW = finalData[finalData.length - 1].weight;
    const deltaW = endW - startW;
    
    let weightPhrase = "Stable weight";
    if (deltaW < -0.1) weightPhrase = `Net reduction of ${Math.abs(deltaW).toFixed(1)}kg`;
    else if (deltaW > 0.1) weightPhrase = `Increase of ${Math.abs(deltaW).toFixed(1)}kg`;

    // Diet Logic
    const avgCal = finalData.reduce((acc, d) => acc + d.calories, 0) / finalData.length;
    const calDiff = avgCal - userGoals.calories;
    let dietPhrase = "Caloric intake aligns with protocol.";
    if (calDiff < -500) dietPhrase = "Caloric intake significantly below target.";
    else if (calDiff > 500) dietPhrase = "Caloric intake exceeds daily targets.";

    // Symptom Logic
    const maxSymp = Math.max(...finalData.map(d => d.symptomScore));
    let sympPhrase = "No significant adverse events reported.";
    if (maxSymp > 0) sympPhrase = "Mild side effects reported.";
    if (maxSymp > 4) sympPhrase = "Moderate side effect burden detected.";

    return `Patient demonstrates ${weightPhrase.toLowerCase()} over the current period. ${dietPhrase} ${sympPhrase} Adherence monitoring active.`;
  }, [finalData, userGoals]);

  const axisColor = theme === 'dark' ? '#71717a' : '#9ca3af';
  const barBgColor = theme === 'dark' ? '#27272a' : '#e5e7eb';

  return (
    <div className="px-4 pb-32 pt-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clinical Report</h1>
            <p className="text-xs text-gray-500">Patient: {userProfile?.name || 'Guest User'}</p>
        </div>
        <button className="text-xs font-bold bg-indigo-600 text-white px-3 py-2 rounded-full flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 hover:bg-indigo-700 transition-colors">
           <Download size={14} /> Export PDF
        </button>
      </div>

      {/* Weight Trend */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800">
         <div className="flex items-center gap-2 mb-6">
             <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Target size={16} />
             </div>
             <span className="font-bold text-gray-700 dark:text-zinc-300">Weight Response</span>
         </div>
         
         <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={finalData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: axisColor, fontSize: 10}} 
                />
                <Tooltip 
                    contentStyle={{backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                    labelStyle={{color: theme === 'dark' ? '#fff' : '#000', fontWeight: 'bold'}}
                />
                <Area 
                    type="monotone" 
                    dataKey="weight" 
                    name="Weight (kg)"
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                    animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Symptom Correlation */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800">
         <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <AlertCircle size={16} />
             </div>
             <span className="font-bold text-gray-700 dark:text-zinc-300">Side Effects Severity</span>
         </div>
         <p className="text-xs text-gray-400 mb-6">Cumulative intensity of reported symptoms.</p>
         
         <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={finalData}>
                 <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: axisColor, fontSize: 10}} 
                />
                <Tooltip 
                     contentStyle={{backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                     labelStyle={{color: theme === 'dark' ? '#fff' : '#000', fontWeight: 'bold'}}
                />
                <Line type="monotone" dataKey="symptomScore" name="Severity Score" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#ef4444'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Calorie Balance */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800">
         <div className="flex items-center gap-2 mb-6">
             <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Flame size={16} />
             </div>
             <span className="font-bold text-gray-700 dark:text-zinc-300">Net Caloric Intake</span>
         </div>
         
         <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finalData}>
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: axisColor, fontSize: 10}} 
                />
                <Tooltip 
                     contentStyle={{backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                     labelStyle={{color: theme === 'dark' ? '#fff' : '#000', fontWeight: 'bold'}}
                     cursor={{fill: theme === 'dark' ? '#3f3f46' : '#f3f4f6'}}
                />
                <Bar dataKey="calories" name="Consumed" fill={barBgColor} radius={[4, 4, 0, 0]} />
                <Bar dataKey="burn" name="Burned" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Dynamic Doctor's Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-3xl p-5">
          <div className="flex items-start gap-3">
             <FileText className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
             <div>
                 <h3 className="font-bold text-blue-900 dark:text-blue-300 text-sm">Clinical Insight</h3>
                 <p className="text-xs text-blue-800 dark:text-blue-400 mt-1 leading-relaxed">
                    {clinicalNote}
                 </p>
             </div>
          </div>
      </div>
    </div>
  );
};
