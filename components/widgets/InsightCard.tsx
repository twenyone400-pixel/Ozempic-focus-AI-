
import React, { useState, useEffect } from 'react';
import { Lightbulb, ArrowRight, Quote, X, BookOpen, CheckCircle2 } from 'lucide-react';
import { PSYCHOLOGY_TIPS } from '../../constants';
import { useApp } from '../../context/AppContext';

export const InsightCard: React.FC = () => {
  const { userProfile } = useApp();
  const [tip, setTip] = useState(PSYCHOLOGY_TIPS[0]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % PSYCHOLOGY_TIPS.length;
    setTip(PSYCHOLOGY_TIPS[index]);
  }, []);

  const handleComplete = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsRead(true);
      setIsExpanded(false);
  };

  return (
    <>
        {/* Standard Card */}
        <div 
            onClick={() => setIsExpanded(true)}
            className={`cursor-pointer rounded-3xl p-5 relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-full border ${
                isRead 
                ? 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800' 
                : 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-zinc-900 dark:to-zinc-900 border-emerald-100 dark:border-zinc-800'
            }`}
        >
          {/* Ambient Background */}
          {!isRead && (
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none animate-pulse"></div>
          )}
          
          <div className="flex justify-between items-start mb-3 relative z-10">
             <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${isRead ? 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600' : 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400'}`}>
                    {isRead ? <CheckCircle2 size={16} /> : <Lightbulb size={16} className="fill-current" />}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${isRead ? 'text-gray-400' : 'text-emerald-800 dark:text-emerald-300'}`}>
                    {isRead ? 'Completed' : 'Daily Lesson'}
                </span>
             </div>
          </div>

          <div className="relative z-10 pr-4 min-h-[60px] flex flex-col justify-center">
              <h3 className={`font-bold text-lg mb-1 leading-tight line-clamp-2 ${isRead ? 'text-gray-400 dark:text-zinc-600' : 'text-gray-900 dark:text-white'}`}>{tip.title}</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2">{tip.content}</p>
          </div>
          
          <div className="mt-3 flex justify-end relative z-10">
             {!isRead && (
                 <button className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-full transition-colors group-hover:bg-white dark:group-hover:bg-black/40">
                    Start <ArrowRight size={10} />
                 </button>
             )}
          </div>
        </div>

        {/* Expanded Modal (Noom Style) */}
        {isExpanded && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 relative flex flex-col max-h-[90vh]">
                    <div className="h-40 bg-emerald-100 dark:bg-emerald-900/30 relative flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <div className="absolute w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
                        <BookOpen size={64} className="text-emerald-600 dark:text-emerald-400 relative z-10 opacity-80" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                            className="absolute top-4 right-4 w-8 h-8 bg-black/10 dark:bg-white/10 hover:bg-black/20 rounded-full flex items-center justify-center text-gray-800 dark:text-white transition-colors z-20"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    
                    <div className="p-8 overflow-y-auto">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Psychology</span>
                            <span className="text-xs text-gray-400">3 min read</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{tip.title}</h2>
                        <div className="prose dark:prose-invert text-gray-600 dark:text-zinc-300 leading-relaxed text-lg mb-8">
                            <p>{tip.content}</p>
                            <p className="mt-4">Small habits beat motivation every time. This journey is about consistency, not perfection. Focus on the next meal, not the whole week.</p>
                        </div>
                        
                        <button 
                            onClick={handleComplete}
                            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-colors active:scale-95 shadow-xl shadow-emerald-200 dark:shadow-emerald-900/20"
                        >
                            I've read this!
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};
