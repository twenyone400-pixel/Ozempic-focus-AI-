
import React, { useState } from 'react';
import { LifeBuoy, X, HeartPulse, Battery, CloudRain } from 'lucide-react';

interface ReliefTip {
  title: string;
  content: string;
  action: string;
}

const SOS_DATA: Record<string, ReliefTip> = {
  Nausea: {
    title: 'Deep Breaths & Cool Air',
    content: 'Nausea is common after injection. Sit in front of a fan or step outside. Smell an alcohol pad if available—it stops nausea signals.',
    action: 'Start Breathing Exercise'
  },
  Headache: {
    title: 'Hydrate & Electrolytes',
    content: 'GLP-1s reduce thirst signals. You might be dehydrated. Drink 500ml of water with electrolytes now.',
    action: 'Track Water'
  },
  Fatigue: {
    title: 'Glucose Dip?',
    content: 'Your blood sugar might be low. Eat a small piece of fruit (apple or berries) to get a steady energy release.',
    action: 'Log Snack'
  }
};

export const SOSButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<string | null>(null);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 z-30 bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-500 p-2 rounded-full shadow-lg animate-pulse hover:bg-red-500 hover:text-white transition-all"
      >
        <LifeBuoy size={20} />
      </button>

      {/* SOS Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-red-100 dark:border-red-900/30 relative">
            <button 
              onClick={() => { setIsOpen(false); setSelectedSymptom(null); }}
              className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-zinc-800 rounded-full"
            >
              <X size={16} className="text-gray-500" />
            </button>

            {!selectedSymptom ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto text-red-500 mb-4">
                  <LifeBuoy size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Not feeling well?</h2>
                <p className="text-gray-500 dark:text-zinc-400">Select what you are experiencing for immediate relief.</p>
                
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => setSelectedSymptom('Nausea')} className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-100">
                     <CloudRain size={24} className="text-blue-400" />
                     <span className="text-xs font-bold dark:text-zinc-300">Nausea</span>
                  </button>
                  <button onClick={() => setSelectedSymptom('Headache')} className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-100">
                     <HeartPulse size={24} className="text-red-400" />
                     <span className="text-xs font-bold dark:text-zinc-300">Headache</span>
                  </button>
                  <button onClick={() => setSelectedSymptom('Fatigue')} className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-100">
                     <Battery size={24} className="text-orange-400" />
                     <span className="text-xs font-bold dark:text-zinc-300">Fatigue</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-right-8 duration-300">
                 <h2 className="text-xl font-bold text-red-500 mb-2 flex items-center gap-2">
                    <LifeBuoy size={20} /> {selectedSymptom} SOS
                 </h2>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {SOS_DATA[selectedSymptom].title}
                 </h3>
                 <p className="text-gray-600 dark:text-zinc-400 leading-relaxed mb-6 text-sm">
                    {SOS_DATA[selectedSymptom].content}
                 </p>
                 
                 <button className="w-full py-3 bg-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-200 dark:shadow-red-900/40 active:scale-95 transition-transform">
                    {SOS_DATA[selectedSymptom].action}
                 </button>
                 <button 
                    onClick={() => setSelectedSymptom(null)}
                    className="w-full py-3 mt-2 text-gray-400 text-sm"
                 >
                    Back
                 </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};