import React, { useEffect } from 'react';
import { X, ShoppingCart, Check, Sparkles, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ShoppingItem } from '../../types';

interface ShoppingListModalProps {
  onClose: () => void;
}

export const ShoppingListModal: React.FC<ShoppingListModalProps> = ({ onClose }) => {
  const { shoppingList, toggleShoppingItem, generateShoppingList } = useApp();

  // Auto-generate if empty on open
  useEffect(() => {
    if (shoppingList.length === 0) {
      generateShoppingList();
    }
  }, []);

  const categories = {
    protein: { label: 'Protein Power', color: 'bg-orange-100 text-orange-700' },
    fiber: { label: 'Gut Health (Fiber)', color: 'bg-green-100 text-green-700' },
    hydration: { label: 'Hydration', color: 'bg-blue-100 text-blue-700' },
    snack: { label: 'GLP-1 Essentials', color: 'bg-purple-100 text-purple-700' }
  };

  const groupedItems = shoppingList.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 w-full sm:max-w-md h-[85vh] sm:h-auto rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col animate-in slide-in-from-bottom-10 duration-500 cubic-bezier(0.32, 0.72, 0, 1)">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
           <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <ShoppingCart size={24} className="text-indigo-600" /> Smart List
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Based on your macro goals</p>
           </div>
           <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-gray-200 transition-colors">
              <X size={20} className="text-gray-600 dark:text-zinc-400" />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <button 
                onClick={generateShoppingList}
                className="w-full py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 transition-colors active:scale-95"
            >
                <Sparkles size={16} /> Regenerate Recommendations
            </button>

            {(Object.entries(groupedItems) as [string, ShoppingItem[]][]).map(([cat, items]) => (
                <div key={cat} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h3 className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide mb-3 ${(categories as any)[cat]?.color || 'bg-gray-100'}`}>
                        {(categories as any)[cat]?.label || cat}
                    </h3>
                    <div className="space-y-2">
                        {items.map(item => (
                            <button 
                                key={item.id}
                                onClick={() => toggleShoppingItem(item.id)}
                                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all duration-300 group ${
                                    item.isChecked 
                                    ? 'bg-gray-50 dark:bg-zinc-800/50 border-gray-100 dark:border-zinc-800 opacity-60 scale-[0.98]' 
                                    : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-zinc-600 scale-100'
                                }`}
                            >
                                <div className="flex items-center gap-3 text-left">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                                        item.isChecked 
                                        ? 'bg-green-500 border-green-500 text-white scale-110' 
                                        : 'border-gray-300 dark:border-zinc-600 group-hover:border-indigo-400'
                                    }`}>
                                        {item.isChecked && <Check size={12} strokeWidth={3} className="animate-in zoom-in duration-200" />}
                                    </div>
                                    <div>
                                        <p className={`font-medium text-sm transition-all duration-300 ${item.isChecked ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{item.name}</p>
                                        {item.reason && !item.isChecked && <p className="text-[10px] text-indigo-500">{item.reason}</p>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 rounded-b-[2rem]">
             <div className="flex gap-3">
                <div className="flex-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 flex items-center gap-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-shadow">
                    <Plus size={16} className="text-gray-400" />
                    <input 
                        placeholder="Add item..." 
                        className="w-full py-3 bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                    />
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};