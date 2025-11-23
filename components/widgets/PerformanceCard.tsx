import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Flame } from 'lucide-react';

export const PerformanceCard: React.FC = () => {
  const { theme, history, todayLog } = useApp();

  // Helper to get day name
  const getDayName = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });

  let chartData = [];
  
  // Combine history (sorted by date desc in context usually, so we take top 6 and reverse for chart)
  if (history.length > 0) {
      const recentHistory = history.slice(0, 6).reverse();
      chartData = recentHistory.map(log => ({
          day: getDayName(log.date),
          in: log.caloriesConsumed,
          out: log.caloriesBurned || 0
      }));
  }
  
  chartData.push({
      day: 'Today',
      in: todayLog.caloriesConsumed,
      out: todayLog.caloriesBurned || 0
  });
  
  // Mock data fallback
  if (chartData.length <= 1 && chartData[0].in === 0 && chartData[0].out === 0) {
      chartData = [
        { day: 'Mon', in: 1800, out: 2100 },
        { day: 'Tue', in: 2100, out: 2400 },
        { day: 'Wed', in: 1950, out: 1800 },
        { day: 'Thu', in: 1600, out: 2200 },
        { day: 'Fri', in: 2300, out: 2000 },
        { day: 'Sat', in: 1900, out: 2500 },
        { day: 'Sun', in: 2000, out: 2100 },
      ];
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-700 text-xs backdrop-blur-md bg-opacity-90">
          <p className="font-bold text-gray-900 dark:text-white mb-2 border-b border-gray-100 dark:border-zinc-700 pb-1">{label}</p>
          <div className="space-y-1.5">
              <p className="text-gray-500 dark:text-zinc-400 flex justify-between items-center w-28">
                  <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div> In</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{payload[0].value}</span>
              </p>
              <p className="text-orange-500 dark:text-orange-400 flex justify-between items-center w-28">
                   <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Out</span>
                  <span className="font-mono font-bold">{payload[1].value}</span>
              </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col justify-between relative overflow-hidden min-h-[220px] group">
      <div className="flex justify-between items-start mb-4 z-10">
        <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 transition-transform group-hover:scale-110">
              <TrendingUp size={16} />
            </div>
            Calorie Balance
        </div>
        <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded-lg">
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-600"></div> In</span>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Out</span>
        </div>
      </div>

      <div className="h-40 w-full z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4}>
             <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: theme === 'dark' ? '#71717a' : '#9ca3af', fontSize: 10}} 
                dy={10}
             />
             <Tooltip content={<CustomTooltip />} cursor={{fill: theme === 'dark' ? '#3f3f46' : '#f3f4f6', opacity: 0.4}} />
             <Bar dataKey="in" fill={theme === 'dark' ? '#27272a' : '#e5e7eb'} radius={[4, 4, 4, 4]} animationDuration={1500} animationBegin={0} barSize={12} />
             <Bar dataKey="out" fill="#f97316" radius={[4, 4, 4, 4]} animationDuration={1500} animationBegin={200} barSize={12}>
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.out > entry.in ? '#f97316' : '#fb923c'} />
                ))}
             </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};