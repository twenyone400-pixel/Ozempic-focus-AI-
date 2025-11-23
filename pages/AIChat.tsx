
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { getHealthAdvice } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const AIChat: React.FC = () => {
  const { userProfile, todayLog, userGoals } = useApp();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${userProfile?.name || 'there'}! I'm your personal health assistant. Ask me anything about your medication, meals, or goals!`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Construct context
    const context = `
      User: ${userProfile?.name}, ${userProfile?.gender}, ${userProfile?.startWeight}kg.
      Goal: ${userGoals.weight}kg.
      Today's Log: 
      - Calories: ${todayLog.caloriesConsumed}/${userGoals.calories}
      - Protein: ${todayLog.proteinConsumed}/${userGoals.protein}g
      - Water: ${todayLog.waterIntake}/${userGoals.water}ml
      - Medication Taken: ${todayLog.medicationTaken ? 'Yes' : 'No'}
    `;

    try {
      const responseText = await getHealthAdvice(context, userMsg.text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black pt-6">
      {/* Header */}
      <div className="px-4 pb-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
             <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white text-lg">AI Coach</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 dark:text-zinc-400">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-black dark:bg-white text-white dark:text-black rounded-tr-none' 
                : 'bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 border border-gray-100 dark:border-zinc-800 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-white' : 'text-gray-500'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white dark:bg-zinc-900 rounded-2xl rounded-tl-none p-4 border border-gray-100 dark:border-zinc-800 flex gap-2 items-center">
                <Loader2 size={16} className="animate-spin text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs text-gray-400">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed Bottom handled by Layout padding, but here we need explicit styling */}
      <div className="absolute bottom-24 left-4 right-4">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="bg-white dark:bg-zinc-900 p-2 rounded-[2rem] shadow-xl border border-gray-100 dark:border-zinc-800 flex items-center gap-2"
        >
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about protein, weight..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white px-4 py-2 placeholder-gray-400 dark:placeholder-zinc-600"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
          >
            <Send size={18} className={input.trim() ? 'ml-1' : ''} />
          </button>
        </form>
      </div>
    </div>
  );
};
