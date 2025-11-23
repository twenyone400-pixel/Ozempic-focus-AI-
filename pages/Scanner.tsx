
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader2, ChevronRight, Sparkles, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { analyzeFoodImage } from '../services/geminiService';
import { useApp } from '../context/AppContext';
import { View } from '../types';

export const Scanner: React.FC = () => {
  const { setCurrentView, logFood } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeFoodImage(image);
      
      // Generate Adaptive GLP-1 Advice locally (simulated for speed, or could be AI)
      let advice = "Great meal choice!";
      if (analysis.protein < 15) {
        advice = "Low Protein: Consider adding greek yogurt or a protein shake to maintain muscle mass while on GLP-1.";
      } else if (analysis.fiber < 5) {
        advice = "Low Fiber: Add some leafy greens or chia seeds to help digestion and prevent constipation.";
      } else if (analysis.calories > 800) {
        advice = "High Volume: Eat slowly. GLP-1 delays gastric emptying, so you might feel full sooner than you think.";
      } else {
        advice = "Excellent balance! High protein and moderate fiber supports your GLP-1 therapy perfectly.";
      }

      setResult({ ...analysis, aiAdvice: advice });
    } catch (error) {
      alert("Failed to analyze food. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (result) {
      logFood({
        id: Date.now().toString(),
        name: result.foodName,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        fiber: result.fiber,
        timestamp: new Date().toISOString(),
        aiAdvice: result.aiAdvice
      });
      setCurrentView(View.DASHBOARD);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-white relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <button onClick={() => setCurrentView(View.DASHBOARD)} className="p-2 rounded-full bg-white/10 backdrop-blur-md">
          <X size={20} />
        </button>
        <span className="font-medium">AI Nutrition Lens</span>
        <div className="w-10" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        {!image ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-gray-900 p-6">
            <div className="w-full max-w-sm aspect-square border-2 border-dashed border-gray-700 rounded-[2rem] flex flex-col items-center justify-center text-gray-500 bg-gray-800/30">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                 <Camera size={32} className="text-gray-400" />
              </div>
              <p className="font-medium text-lg text-gray-300">Snap your meal</p>
              <p className="text-sm opacity-50">AI will detect macros & GLP-1 impact</p>
            </div>
            
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <button 
                onClick={() => cameraInputRef.current?.click()}
                className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-gray-100 active:scale-95 transition-all"
              >
                <Camera size={20} /> Take Photo
              </button>
              
              <button 
                onClick={() => galleryInputRef.current?.click()}
                className="w-full py-4 bg-gray-800 text-white border border-gray-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-700 active:scale-95 transition-all"
              >
                <ImageIcon size={20} /> Upload from Gallery
              </button>
            </div>

            <input 
                ref={cameraInputRef}
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
            />
            <input 
                ref={galleryInputRef}
                type="file" 
                accept="image/*" 
                className="hidden"
                onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="relative w-full h-full">
            <img src={image} alt="Food" className="w-full h-full object-cover" />
            
            {/* Analysis Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-white text-black rounded-t-[2.5rem] p-6 transition-transform duration-500 ease-out shadow-2xl max-h-[80vh] overflow-y-auto">
              {!result ? (
                <div className="flex flex-col gap-4 pb-8">
                   <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">Ready to analyze?</h3>
                      <button onClick={() => setImage(null)} className="text-sm text-gray-500 underline">Retake</button>
                   </div>
                   <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                    {isAnalyzing ? 'Identifying Macros...' : 'Analyze Meal'}
                  </button>
                </div>
              ) : (
                <div className="animate-in slide-in-from-bottom-10 fade-in duration-500 pb-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold capitalize">{result.foodName}</h2>
                      <div className="flex gap-2 mt-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold flex items-center gap-1">
                          {result.calories} kcal
                        </span>
                        <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold">
                          {result.protein}g Prot
                        </span>
                        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
                           {result.fiber}g Fiber
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200">
                      <Check size={24} strokeWidth={3} />
                    </div>
                  </div>

                  {/* Adaptive Coach Tip */}
                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl mb-6 flex gap-3">
                      <div className="mt-1"><Sparkles size={18} className="text-indigo-600 fill-indigo-200" /></div>
                      <div>
                          <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-1">GLP-1 Coach Tip</h4>
                          <p className="text-sm text-indigo-800 leading-relaxed">{result.aiAdvice}</p>
                      </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-gray-50 p-3 rounded-2xl text-center">
                      <p className="text-xs text-gray-500 mb-1">Carbs</p>
                      <p className="text-xl font-bold text-gray-800">{result.carbs}g</p>
                    </div>
                     <div className="bg-gray-50 p-3 rounded-2xl text-center">
                      <p className="text-xs text-gray-500 mb-1">Fat</p>
                      <p className="text-xl font-bold text-gray-800">{result.fat}g</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl text-center">
                      <p className="text-xs text-gray-500 mb-1">Score</p>
                      <p className="text-xl font-bold text-green-600">A</p>
                    </div>
                  </div>

                  <button 
                    onClick={handleSave}
                    className="w-full py-4 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    Log this Meal <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
    