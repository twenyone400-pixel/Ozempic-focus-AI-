import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, LogOut, ChevronRight, Target, Moon, Sun, Camera, Plus, Image as ImageIcon, Activity, Heart, Check, Edit2, MessageCircle, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

export const Profile: React.FC = () => {
  const { userProfile, userGoals, updateUserGoals, updateUserProfile, logout, theme, toggleTheme, addProgressPhoto, toggleHealthSync } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit State
  const [tempGoals, setTempGoals] = useState(userGoals);
  const [tempProfile, setTempProfile] = useState<Partial<UserProfile>>({});
  
  const [showCompare, setShowCompare] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock Community Data State
  const [communityStats, setCommunityStats] = useState({
    avgLoss: 3.8,
    topGoal: 'Confidence Boost',
    memberCount: '12.5k'
  });

  // Sync state when entering edit mode
  useEffect(() => {
    if (isEditing && userProfile) {
        setTempProfile({
            name: userProfile.name,
            height: userProfile.height,
            startWeight: userProfile.startWeight
        });
        setTempGoals(userGoals);
    }
  }, [isEditing, userProfile, userGoals]);

  // Mock Fetch Community Data
  useEffect(() => {
    const fetchCommunityData = async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate dynamic data based on "user goals" context conceptually
        const potentialGoals = ['Confidence', 'Longevity', 'Energy', 'Mobility'];
        const randomGoal = potentialGoals[Math.floor(Math.random() * potentialGoals.length)];
        const randomLoss = (3.0 + Math.random() * 2.0).toFixed(1);
        const randomMembers = (10 + Math.random() * 5).toFixed(1);

        setCommunityStats({
            avgLoss: Number(randomLoss),
            topGoal: randomGoal,
            memberCount: `${randomMembers}k`
        });
    };
    fetchCommunityData();
  }, []);

  const handleSave = () => {
    updateUserGoals(tempGoals);
    if (tempProfile) {
        updateUserProfile(tempProfile);
    }
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              if (ev.target?.result) {
                  addProgressPhoto({
                      id: Date.now().toString(),
                      date: new Date().toISOString(),
                      weight: userGoals.weight, // Assuming current weight logic exists
                      imageUrl: ev.target.result as string
                  });
              }
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  if (!userProfile) return null;

  const sortedPhotos = [...(userProfile.progressPhotos || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Compare View Logic
  const hasPhotos = sortedPhotos.length >= 2;
  const beforePhoto = sortedPhotos[sortedPhotos.length - 1]; // Oldest
  const afterPhoto = sortedPhotos[0]; // Newest
  
  // Calculate BMI
  const currentHeight = isEditing && tempProfile.height ? tempProfile.height : userProfile.height;
  const currentStartWeight = isEditing && tempProfile.startWeight ? tempProfile.startWeight : userProfile.startWeight;
  const bmi = (currentStartWeight / ((currentHeight/100)**2)).toFixed(1);

  return (
    <div className="px-4 pb-24 pt-6 space-y-6 animate-in fade-in duration-500">
      
      {/* Top Action Bar */}
      <div className="flex justify-between items-center px-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${isEditing ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}
          >
            {isEditing ? <Check size={14} /> : <Edit2 size={14} />}
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
      </div>

      {/* Header Card */}
      <div className="bg-black dark:bg-zinc-900 text-white rounded-3xl p-6 shadow-xl shadow-gray-300 dark:shadow-black/50 transition-all">
         <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl font-bold border border-white/30 shrink-0">
              {userProfile.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              {isEditing ? (
                  <input 
                    value={tempProfile.name || ''}
                    onChange={e => setTempProfile(prev => ({...prev, name: e.target.value}))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-lg font-bold text-white mb-1 focus:outline-none focus:bg-white/20"
                    placeholder="Your Name"
                  />
              ) : (
                  <h2 className="text-2xl font-bold truncate">{userProfile.name}</h2>
              )}
              <p className="text-white/60 text-sm truncate">{userProfile.email}</p>
            </div>
         </div>
         
         <div className="flex justify-between bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <div className="text-center">
               <p className="text-xs text-white/50 mb-1">Start Weight</p>
               {isEditing ? (
                   <div className="flex items-center justify-center gap-1">
                       <input 
                         type="number"
                         value={tempProfile.startWeight}
                         onChange={e => setTempProfile(prev => ({...prev, startWeight: Number(e.target.value)}))}
                         className="w-12 bg-transparent text-center border-b border-white/40 font-bold text-lg focus:outline-none"
                       />
                   </div>
               ) : (
                   <p className="font-bold text-lg">{userProfile.startWeight} kg</p>
               )}
            </div>
            <div className="w-px bg-white/10"></div>
             <div className="text-center">
               <p className="text-xs text-white/50 mb-1">Height</p>
               {isEditing ? (
                   <div className="flex items-center justify-center gap-1">
                       <input 
                         type="number"
                         value={tempProfile.height}
                         onChange={e => setTempProfile(prev => ({...prev, height: Number(e.target.value)}))}
                         className="w-12 bg-transparent text-center border-b border-white/40 font-bold text-lg focus:outline-none"
                       />
                   </div>
               ) : (
                   <p className="font-bold text-lg">{userProfile.height} cm</p>
               )}
            </div>
            <div className="w-px bg-white/10"></div>
             <div className="text-center">
               <p className="text-xs text-white/50 mb-1">BMI</p>
               <p className={`font-bold text-lg ${Number(bmi) > 25 ? 'text-yellow-300' : 'text-green-300'}`}>{bmi}</p>
            </div>
         </div>
      </div>

      {/* Goals Section (Editable) */}
      <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white px-2 flex items-center gap-2">
             <Target size={18} /> Daily Goals
          </h3>
          <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                  <p className="text-xs text-gray-500 mb-1">Calories</p>
                  {isEditing ? (
                      <input 
                        type="number" 
                        value={tempGoals.calories}
                        onChange={(e) => setTempGoals(prev => ({...prev, calories: Number(e.target.value)}))}
                        className="w-full font-bold text-xl bg-gray-50 dark:bg-zinc-800 rounded px-2 py-1 outline-none"
                      />
                  ) : (
                      <p className="text-xl font-bold">{userGoals.calories}</p>
                  )}
              </div>
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                  <p className="text-xs text-gray-500 mb-1">Protein (g)</p>
                   {isEditing ? (
                      <input 
                        type="number" 
                        value={tempGoals.protein}
                        onChange={(e) => setTempGoals(prev => ({...prev, protein: Number(e.target.value)}))}
                         className="w-full font-bold text-xl bg-gray-50 dark:bg-zinc-800 rounded px-2 py-1 outline-none"
                      />
                  ) : (
                      <p className="text-xl font-bold">{userGoals.protein}g</p>
                  )}
              </div>
               <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                  <p className="text-xs text-gray-500 mb-1">Water (ml)</p>
                   {isEditing ? (
                      <input 
                        type="number" 
                        value={tempGoals.water}
                        onChange={(e) => setTempGoals(prev => ({...prev, water: Number(e.target.value)}))}
                         className="w-full font-bold text-xl bg-gray-50 dark:bg-zinc-800 rounded px-2 py-1 outline-none"
                      />
                  ) : (
                      <p className="text-xl font-bold">{userGoals.water}ml</p>
                  )}
              </div>
               <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                  <p className="text-xs text-gray-500 mb-1">Goal Weight</p>
                   {isEditing ? (
                      <input 
                        type="number" 
                        value={tempGoals.weight}
                        onChange={(e) => setTempGoals(prev => ({...prev, weight: Number(e.target.value)}))}
                         className="w-full font-bold text-xl bg-gray-50 dark:bg-zinc-800 rounded px-2 py-1 outline-none"
                      />
                  ) : (
                      <p className="text-xl font-bold">{userGoals.weight}kg</p>
                  )}
              </div>
          </div>
      </div>

      {/* Progress Photos Section */}
      <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
             <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Camera size={18} /> Progress Photos
             </h3>
             <div className="flex gap-2">
                {hasPhotos && (
                    <button 
                        onClick={() => setShowCompare(!showCompare)} 
                        className="text-xs font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full"
                    >
                        {showCompare ? 'Gallery' : 'Compare'}
                    </button>
                )}
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                >
                    <Plus size={16} />
                </button>
             </div>
          </div>

          <input 
            ref={fileInputRef} 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handlePhotoUpload}
          />

          {showCompare && hasPhotos ? (
             <div className="grid grid-cols-2 gap-4 h-64">
                <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-500">
                   <img src={beforePhoto.imageUrl} alt="Start" className="w-full h-full object-cover" />
                   <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md">Start</div>
                </div>
                <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-500">
                   <img src={afterPhoto.imageUrl} alt="Now" className="w-full h-full object-cover" />
                   <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-md">Current</div>
                </div>
             </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                {sortedPhotos.length > 0 ? (
                    sortedPhotos.map((photo) => (
                        <div key={photo.id} className="w-32 h-40 flex-shrink-0 bg-gray-100 dark:bg-zinc-800 rounded-2xl overflow-hidden relative shadow-sm snap-start">
                            <img src={photo.imageUrl} alt="Progress" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                <p className="text-white text-[10px] font-medium">{new Date(photo.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="w-full h-32 bg-gray-50 dark:bg-zinc-800/50 border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-2">
                        <ImageIcon size={24} />
                        <p className="text-xs">No photos yet</p>
                    </div>
                )}
            </div>
          )}
      </div>

      {/* Community Success Card (NEW) */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
         
         <div className="flex items-center gap-2 mb-4 relative z-10">
             <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Users size={16} />
             </div>
             <h3 className="font-bold text-lg">Community Success</h3>
         </div>

         <div className="grid grid-cols-2 gap-4 relative z-10">
             <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-xs text-indigo-200 mb-1">Avg Loss / Month</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{communityStats.avgLoss}</span>
                    <span className="text-xs font-medium">kg</span>
                </div>
             </div>
             <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-xs text-indigo-200 mb-1">Top Motivation</p>
                <p className="font-bold text-sm leading-tight">{communityStats.topGoal}</p>
             </div>
         </div>

         <div className="mt-4 flex items-center justify-between text-xs text-indigo-200 relative z-10">
            <div className="flex items-center gap-1">
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-5 h-5 rounded-full bg-indigo-300 border border-indigo-600"></div>
                    ))}
                </div>
                <span className="ml-1">{communityStats.memberCount} active</span>
            </div>
            <button className="flex items-center gap-1 font-bold hover:text-white transition-colors">
                Join Group <ArrowRight size={12} />
            </button>
         </div>
      </div>

      {/* Settings Section */}
      <div className="space-y-2 pt-2">
         <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800">
             
             {/* Appearance */}
             <button 
                onClick={toggleTheme}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors border-b border-gray-100 dark:border-zinc-800"
             >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Appearance</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
             </button>

             {/* Health Sync */}
             <button 
                onClick={toggleHealthSync}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
             >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center">
                        <Heart size={16} />
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">Health Sync</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${userProfile.healthSync ? 'text-green-500' : 'text-gray-400'}`}>
                        {userProfile.healthSync ? 'Connected' : 'Off'}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                </div>
             </button>
         </div>

         <button 
            onClick={logout}
            className="w-full p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
         >
            <LogOut size={16} /> Sign Out
         </button>
         
         <p className="text-center text-[10px] text-gray-400 pt-4 pb-8">
            GlucoTrack v1.0.2 • Build 4059
         </p>
      </div>
    </div>
  );
};