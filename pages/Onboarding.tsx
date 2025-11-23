
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Check, Star, Activity, ArrowRight, Lock, MessageCircle } from 'lucide-react';
import { UserProfile, UserGoals, MedicationSchedule } from '../types';
import { DEFAULT_GOALS, INITIAL_MEDICATION } from '../constants';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

// Mock Data for Graph
const PREDICTION_DATA = [
  { month: 'Start', without: 85, with: 85 },
  { month: '1mo', without: 84.5, with: 80 },
  { month: '2mo', without: 84, with: 76 },
  { month: '3mo', without: 83.5, with: 72 },
  { month: '4mo', without: 83, with: 69 },
  { month: '5mo', without: 82.5, with: 67 },
  { month: '6mo', without: 82, with: 65 },
];

export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Form State
  const [gender, setGender] = useState<'male'|'female'|'other'>('female');
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const [height, setHeight] = useState(165);
  const [weight, setWeight] = useState(82);
  const [goalWeight, setGoalWeight] = useState(65);
  const [pace, setPace] = useState<'slow'|'moderate'|'fast'>('moderate');
  const [activity, setActivity] = useState('moderate');
  const [cravingDay, setCravingDay] = useState('Monday');
  
  const [medName, setMedName] = useState('');
  const [medFrequency, setMedFrequency] = useState('Weekly');
  const [medDose, setMedDose] = useState('');
  
  const [motivations, setMotivations] = useState<string[]>([]);
  const [fears, setFears] = useState<string[]>([]);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const totalSteps = 18;

  // Auto-advance loading screen - Adjusted for 5-8 seconds duration
  useEffect(() => {
    if (step === 17) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(18), 300);
            return 100;
          }
          // Random increment between 1% and 4% to simulate processing
          // Runs every 200ms. Avg increment 2.5%. 
          // 100 / 2.5 = 40 ticks. 40 * 200ms = 8000ms (8 seconds max)
          // Minimum speed: 100 / 1 = 100 ticks * 200ms = 20s (Too slow)
          // Let's boost the jump to 2-6% for 5-8s target
          const jump = Math.floor(Math.random() * 5) + 2; 
          return Math.min(prev + jump, 100);
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleFinish = () => {
    const birthDate = `${dob.year}-${dob.month}-${dob.day}`;
    
    const profile: UserProfile = {
      name,
      email: email || 'user@example.com',
      height,
      startWeight: weight,
      birthDate,
      gender,
      activityLevel: activity as any,
      motivations,
      fearedSideEffects: fears,
      foodCravingsDay: cravingDay
    };

    const goals: UserGoals = {
      ...DEFAULT_GOALS,
      weight: goalWeight,
      calories: gender === 'male' ? 2400 : 1800,
      protein: Math.round(weight * 1.8), // High protein for GLP-1
      fiber: 35, // High fiber for GLP-1
      water: 3000,
      pace
    };

    const meds: MedicationSchedule = {
      ...INITIAL_MEDICATION,
      drugName: medName || 'Semaglutide',
      dosage: medDose || 'Starting Dose',
      injectionDay: new Date().getDay(), // Today
      frequency: medFrequency,
      startDate: new Date().toISOString()
    };

    completeOnboarding(profile, goals, meds);
  };

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => Math.max(1, s - 1));

  const toggleSelection = (list: string[], setList: any, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i: string) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const ProgressBar = () => (
    <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1 mb-8 rounded-full overflow-hidden">
      <div 
        className="bg-black dark:bg-white h-full transition-all duration-500 ease-out" 
        style={{ width: `${(step / totalSteps) * 100}%` }}
      />
    </div>
  );

  const Header = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
        {subtitle && <p className="text-gray-500 dark:text-zinc-400">{subtitle}</p>}
    </div>
  );

  const ContinueBtn = ({ disabled = false, onClick = next, text = "Continue" }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
    >
      {text}
    </button>
  );

  const SelectionBtn = ({ selected, onClick, children }: any) => (
    <button
        onClick={onClick}
        className={`w-full p-4 rounded-xl text-left font-medium border transition-all flex justify-between items-center ${
            selected
            ? 'border-black bg-black text-white dark:bg-white dark:text-black dark:border-white' 
            : 'border-gray-100 bg-white dark:bg-zinc-900 dark:border-zinc-800 text-gray-900 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800'
        }`}
    >
        {children}
    </button>
  );

  // ---------------- STEPS ----------------

  // 1. Gender
  if (step === 1) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center mb-4"><ChevronLeft className="opacity-0" /></div>
      <ProgressBar />
      <Header title="How do you identify?" subtitle="We use this to calculate your metabolic rate." />
      <div className="space-y-3">
        {['Female', 'Male', 'Non-binary', 'Prefer not to say'].map(g => (
            <SelectionBtn key={g} selected={gender === g.toLowerCase()} onClick={() => { setGender(g.toLowerCase() as any); next(); }}>
                {g}
            </SelectionBtn>
        ))}
      </div>
    </div>
  );

  // 2. DOB
  if (step === 2) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="What is your date of birth?" />
      <div className="flex gap-3 justify-center mt-8">
        <input 
          placeholder="DD" className="w-20 h-20 bg-gray-50 dark:bg-zinc-900 rounded-2xl text-center text-2xl font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          value={dob.day} onChange={e => setDob({...dob, day: e.target.value})} maxLength={2} type="tel"
        />
        <input 
          placeholder="MM" className="w-20 h-20 bg-gray-50 dark:bg-zinc-900 rounded-2xl text-center text-2xl font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          value={dob.month} onChange={e => setDob({...dob, month: e.target.value})} maxLength={2} type="tel"
        />
        <input 
          placeholder="YYYY" className="w-32 h-20 bg-gray-50 dark:bg-zinc-900 rounded-2xl text-center text-2xl font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          value={dob.year} onChange={e => setDob({...dob, year: e.target.value})} maxLength={4} type="tel"
        />
      </div>
      <ContinueBtn disabled={dob.year.length < 4} />
    </div>
  );

  // 3. Measurements
  if (step === 3) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="What are your measurements?" subtitle="This helps us track your BMI and progress." />
      
      <div className="space-y-8 mt-4">
        <div>
           <div className="flex justify-between mb-2">
             <label className="font-bold text-gray-900 dark:text-white">Height</label>
             <span className="font-bold text-indigo-600">{height} cm</span>
           </div>
           <input type="range" min="140" max="220" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full accent-black dark:accent-white" />
        </div>
        <div>
           <div className="flex justify-between mb-2">
             <label className="font-bold text-gray-900 dark:text-white">Current Weight</label>
             <span className="font-bold text-indigo-600">{weight} kg</span>
           </div>
           <input type="range" min="50" max="200" value={weight} onChange={e => setWeight(Number(e.target.value))} className="w-full accent-black dark:accent-white" />
        </div>
      </div>
      <ContinueBtn />
    </div>
  );

  // 4. Goal Weight
  if (step === 4) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="What weight do you want to reach?" />
      
      <div className="flex flex-col items-center justify-center my-10">
        <span className="text-6xl font-bold tracking-tighter text-gray-900 dark:text-white">{goalWeight} <span className="text-2xl text-gray-400 font-normal">kg</span></span>
      </div>

      <div className="relative h-12 flex items-center justify-center mb-10">
         <div className="absolute w-px h-8 bg-red-500 z-10 bottom-0"></div>
         <input 
            type="range" min="45" max={weight - 1} value={goalWeight} 
            onChange={e => setGoalWeight(Number(e.target.value))} 
            className="w-full accent-black dark:accent-white" 
         />
         <div className="flex justify-between w-full text-xs text-gray-400 mt-8 absolute top-2">
            <span>45kg</span>
            <span>{weight}kg</span>
         </div>
      </div>
      
      <div className="text-center">
        <p className="text-red-500 font-bold text-xl mb-1">-{weight - goalWeight} kg</p>
        <p className="text-gray-400 text-sm">to lose</p>
      </div>

      <ContinueBtn />
    </div>
  );

  // 5. Speed (Interactive Slider)
  if (step === 5) {
    const paceValues = ['slow', 'moderate', 'fast'];
    const currentPaceIndex = paceValues.indexOf(pace);
    
    return (
        <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
        <button onClick={back} className="mb-4"><ChevronLeft /></button>
        <ProgressBar />
        <Header title="How fast do you want to reach your goal?" subtitle="Don't worry, we'll help you stay healthy regardless of the speed." />

        {/* Value Display */}
        <div className="flex items-center justify-center my-8">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                {pace === 'slow' ? '0.5' : pace === 'moderate' ? '1.0' : '1.5'} <span className="text-lg font-normal text-gray-500">kg/week</span>
            </h2>
        </div>

        <div className="px-2 mb-12 relative">
             {/* Visual Icons */}
            <div className="flex justify-between text-4xl mb-6 px-2">
                <span className={`transition-all duration-300 transform ${pace === 'slow' ? 'scale-125 grayscale-0 translate-y-0' : 'grayscale opacity-30 translate-y-2'}`}>🦥</span>
                <span className={`transition-all duration-300 transform ${pace === 'moderate' ? 'scale-125 translate-y-0' : 'opacity-30 translate-y-2'}`}>🐇</span>
                <span className={`transition-all duration-300 transform ${pace === 'fast' ? 'scale-125 grayscale-0 translate-y-0' : 'grayscale opacity-30 translate-y-2'}`}>🐆</span>
            </div>

            {/* Interactive Slider */}
            <div className="relative h-10 flex items-center">
                <input
                    type="range"
                    min="0"
                    max="2"
                    step="1"
                    value={currentPaceIndex}
                    onChange={(e) => setPace(paceValues[Number(e.target.value)] as any)}
                    className="w-full absolute z-20 opacity-0 cursor-pointer h-full" 
                />
                {/* Custom Track */}
                <div className="w-full h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden relative z-10 pointer-events-none">
                    <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
                        style={{ width: `${(currentPaceIndex / 2) * 100}%` }}
                    />
                </div>
                {/* Custom Thumb */}
                <div 
                    className="absolute h-8 w-8 bg-white border-[3px] border-indigo-600 dark:bg-black dark:border-white rounded-full shadow-xl z-10 pointer-events-none transition-all duration-300 ease-out flex items-center justify-center"
                    style={{ left: `calc(${(currentPaceIndex / 2) * 100}% - 16px)` }}
                >
                    <div className="w-2 h-2 bg-indigo-600 dark:bg-white rounded-full" />
                </div>
            </div>
            
            {/* Labels */}
            <div className="flex justify-between text-xs font-bold text-gray-400 mt-4 px-1 uppercase tracking-wide">
                <span>Sustainable</span>
                <span>Balanced</span>
                <span>Aggressive</span>
            </div>
        </div>

        <div className={`bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl text-center text-sm text-indigo-800 dark:text-indigo-300 transition-opacity duration-300 ${pace === 'fast' ? 'opacity-100' : 'opacity-0'}`}>
           <Activity className="inline-block mr-2 mb-0.5" size={14}/>
           Rapid weight loss requires medical supervision.
        </div>
        
        <ContinueBtn />
        </div>
    );
  }

  // 6. Activity Level
  if (step === 6) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="What is your physical activity level?" subtitle="We will adjust your calorie and weight goals." />
      
      <div className="space-y-3">
        {[
           { id: 'sedentary', label: 'Sedentary', icon: '🛋️' },
           { id: 'light', label: 'Lightly Active', icon: '🚶' },
           { id: 'moderate', label: 'Moderately Active', icon: '🚴' },
           { id: 'active', label: 'Active', icon: '🏋️' },
           { id: 'very_active', label: 'Very Active', icon: '🔥' }
        ].map(a => (
          <SelectionBtn key={a.id} selected={activity === a.id} onClick={() => { setActivity(a.id); next(); }}>
             <span className="flex items-center gap-3">
                <span className="text-xl">{a.icon}</span>
                {a.label}
             </span>
          </SelectionBtn>
        ))}
      </div>
      <ContinueBtn disabled={!activity} />
    </div>
  );

  // 7. Cravings Day
  if (step === 7) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="Which day is your food craving strongest?" subtitle="We will schedule your GLP-1 dose to work hardest when you need it most." />
      
      <div className="grid grid-cols-1 gap-2">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
          <SelectionBtn key={d} selected={cravingDay === d} onClick={() => { setCravingDay(d); next(); }}>
             {d}
          </SelectionBtn>
        ))}
      </div>
    </div>
  );

  // 8. Medication Selection
  if (step === 8) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="Which GLP-1 medication do you want to use?" subtitle="If not listed, choose 'Other'." />
      
      <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-1">
        {[
          'Ozempic®', 'Wegovy®', 'Mounjaro®', 'Zepbound®', 
          'Saxenda®', 'Trulicity®', 'Rybelsus®', 
          'Compounded Semaglutide', 'Compounded Tirzepatide', 'Other'
        ].map(m => (
          <SelectionBtn key={m} selected={medName === m} onClick={() => { setMedName(m); next(); }}>
            {m}
          </SelectionBtn>
        ))}
      </div>
    </div>
  );

  // 9. Medication Frequency
  if (step === 9) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="How often will you apply?" subtitle="We define the best moment for each dose." />
      
      <div className="space-y-3">
        {['Daily', 'Weekly', 'Every 2 weeks', 'Monthly', 'I don\'t know yet'].map(f => (
          <SelectionBtn key={f} selected={medFrequency === f} onClick={() => { setMedFrequency(f); next(); }}>
            {f}
          </SelectionBtn>
        ))}
      </div>
    </div>
  );

  // 10. Dose
  if (step === 10) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="What dose will you start with?" subtitle="Usually starts with the lowest dose." />
      
      <div className="space-y-3">
        {['Custom Dose', 'I don\'t know my dose yet'].map(d => (
          <SelectionBtn key={d} selected={false} onClick={() => { setMedDose(d === 'Custom Dose' ? '0.25mg' : 'Starting Dose'); next(); }}>
            {d}
          </SelectionBtn>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-400 text-center">Always consult your doctor regarding dosage.</p>
    </div>
  );

  // 11. Motivation
  if (step === 11) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="What is driving you to reach this goal?" subtitle="I'm doing this for..." />
      
      <div className="space-y-3">
        {[
          'I want to feel more confident in my body', 
          'I just want a fresh start',
          'I want to improve my energy and strength', 
          'To improve my health and manage GLP-1', 
          'I want to do this for the people I love'
        ].map(m => (
          <SelectionBtn key={m} selected={motivations.includes(m)} onClick={() => toggleSelection(motivations, setMotivations, m)}>
             <span className="text-sm">{m}</span>
             {motivations.includes(m) && <Check size={16} />}
          </SelectionBtn>
        ))}
      </div>
      <ContinueBtn />
    </div>
  );

  // 12. Side Effects Fear
  if (step === 12) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="Which side effect do you fear most?" subtitle="Let us know so we can help prevent it." />
      
      <div className="space-y-3">
        {['Nausea', 'Fatigue', 'Constipation', 'Diarrhea', 'Headache', 'Loss of Appetite'].map(f => (
          <SelectionBtn key={f} selected={fears.includes(f)} onClick={() => toggleSelection(fears, setFears, f)}>
             {f}
             {fears.includes(f) && <Check size={16} />}
          </SelectionBtn>
        ))}
      </div>
      <ContinueBtn />
    </div>
  );

  // 13. Success Graph
  if (step === 13) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title={`Your Potential for Success with ${medName || 'GLP-1'}`} subtitle="Data from clinical studies shows users with structured tracking achieve better results." />
      
      <div className="h-64 w-full bg-white dark:bg-zinc-900 rounded-3xl p-2 mb-4 shadow-sm">
         <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={PREDICTION_DATA}>
             <defs>
               <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
               </linearGradient>
             </defs>
             <XAxis dataKey="month" hide />
             <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
             <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}
                formatter={(value: any) => [`${value}kg`, 'Weight']} 
             />
             <Area type="monotone" dataKey="without" stroke="#9ca3af" strokeDasharray="5 5" fill="transparent" strokeWidth={2} />
             <Area type="monotone" dataKey="with" stroke="#10b981" fill="url(#colorWith)" strokeWidth={3} />
           </AreaChart>
         </ResponsiveContainer>
         <div className="flex justify-between px-4 text-xs font-bold mt-2">
            <span className="text-emerald-500">With GlucoTrack</span>
            <span className="text-gray-400">Without Support</span>
         </div>
      </div>

      <p className="text-center text-sm text-gray-500">
        Over 80% of members see progress in the first month without scary side effects.
      </p>

      <ContinueBtn />
    </div>
  );

  // 14. Success Stories
  if (step === 14) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="Success Stories" subtitle="See what our users have achieved" />
      
      <div className="flex justify-center gap-2 text-yellow-400 mb-6">
         {[1,2,3,4,5].map(i => <Star key={i} fill="currentColor" size={32} />)}
      </div>

      <div className="flex justify-center -space-x-4 mb-8">
         {[1,2,3].map(i => (
             <div key={i} className="w-16 h-16 rounded-full border-4 border-white dark:border-black overflow-hidden bg-gray-200">
                 <img src={`https://i.pravatar.cc/150?img=${10+i}`} alt="User" className="w-full h-full object-cover" />
             </div>
         ))}
      </div>
      
      <p className="text-center font-medium text-gray-800 dark:text-white mb-2">+2K users have already lost weight with {medName || 'GLP-1'}.</p>
      <div className="w-12 h-1 bg-green-500 rounded-full mx-auto mb-8"></div>

      <ContinueBtn text="I'm Ready!" />
    </div>
  );

  // 15. Name
  if (step === 15) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="What is your name?" subtitle="We will personalize your experience." />
      <input 
        value={name} onChange={e => setName(e.target.value)}
        className="w-full border-b-2 border-gray-200 dark:border-zinc-800 py-4 text-2xl bg-transparent outline-none focus:border-black dark:focus:border-white transition-colors"
        placeholder="Type your name"
        autoFocus
      />
      <ContinueBtn disabled={!name} />
    </div>
  );

  // 16. Email
  if (step === 16) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-right-4">
      <button onClick={back} className="mb-4"><ChevronLeft /></button>
      <ProgressBar />
      <Header title="What is your email?" subtitle="To save your progress and send reminders." />
      <input 
        value={email} onChange={e => setEmail(e.target.value)}
        className="w-full border-2 border-gray-200 dark:border-zinc-800 p-4 rounded-xl text-lg bg-transparent outline-none focus:border-black dark:focus:border-white transition-colors"
        placeholder="your@email.com"
        type="email"
        autoFocus
      />
      <div className="mt-4">
        <p className="text-sm font-bold mb-2">Have a referral code?</p>
        <input 
            placeholder="Enter code (optional)"
            className="w-full border-b border-gray-200 dark:border-zinc-800 py-2 bg-transparent outline-none text-sm"
        />
      </div>
      <ContinueBtn disabled={!email} />
    </div>
  );

  // 17. Optimizing (Loading) - Linear Progressive Style
  if (step === 17) return (
    <div className="h-full flex flex-col items-center justify-center p-6 animate-in fade-in bg-white dark:bg-black">
      
      {/* Progressive Linear Chart */}
      <div className="w-full max-w-sm mb-12">
        <div className="flex justify-between items-end mb-4">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{loadingProgress}%</h2>
             <span className="text-sm font-medium text-gray-500 animate-pulse">Building Plan...</span>
        </div>
        
        <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden p-1 shadow-inner">
             <div 
                className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 rounded-full transition-all duration-100 ease-linear shadow-[0_0_15px_rgba(99,102,241,0.5)] relative"
                style={{ width: `${loadingProgress}%` }}
             >
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[2px]"></div>
             </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-8 text-center text-gray-900 dark:text-white">Optimizing your plan</h2>
      
      <div className="space-y-6 w-full max-w-xs px-2">
         {/* Checkpoints */}
         <div className="flex items-center gap-4 text-gray-500 dark:text-zinc-400 transition-all duration-500" style={{opacity: loadingProgress > 10 ? 1 : 0.4, transform: loadingProgress > 10 ? 'translateY(0)' : 'translateY(10px)'}}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-2 ${loadingProgress > 20 ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 dark:border-zinc-800 text-transparent'}`}>
                {loadingProgress > 20 && <Check size={16} strokeWidth={3} />}
            </div>
            <span className="font-medium text-lg">Analyzing health profile</span>
         </div>
         <div className="flex items-center gap-4 text-gray-500 dark:text-zinc-400 transition-all duration-500" style={{opacity: loadingProgress > 40 ? 1 : 0.4, transform: loadingProgress > 40 ? 'translateY(0)' : 'translateY(10px)'}}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-2 ${loadingProgress > 50 ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 dark:border-zinc-800 text-transparent'}`}>
                {loadingProgress > 50 && <Check size={16} strokeWidth={3} />}
            </div>
            <span className="font-medium text-lg">Calculating personalized metrics</span>
         </div>
         <div className="flex items-center gap-4 text-gray-500 dark:text-zinc-400 transition-all duration-500" style={{opacity: loadingProgress > 70 ? 1 : 0.4, transform: loadingProgress > 70 ? 'translateY(0)' : 'translateY(10px)'}}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-2 ${loadingProgress > 80 ? 'bg-green-500 border-green-500 text-white' : 'border-gray-200 dark:border-zinc-800 text-transparent'}`}>
                {loadingProgress > 80 && <Check size={16} strokeWidth={3} />}
            </div>
            <span className="font-medium text-lg">Finalizing your journey</span>
         </div>
      </div>
    </div>
  );

  // 18. Final Ready Screen (Translated to English)
  if (step === 18) return (
    <div className="h-full flex flex-col p-6 animate-in fade-in slide-in-from-bottom-8 text-center justify-center">
       <div className="w-20 h-20 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <Check size={40} className="text-white dark:text-black" strokeWidth={4} />
       </div>
       <h1 className="text-3xl font-bold mb-2">Your Personal Plan is Ready!</h1>
       
       <div className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-3xl my-6 text-left space-y-4 shadow-sm border border-gray-100 dark:border-zinc-800">
          <div className="flex justify-between items-center">
             <span className="text-gray-500 text-sm font-medium">Progress Timeline</span>
             <Lock size={16} className="text-gray-400" />
          </div>
          <div className="flex justify-between items-end">
             <div className="text-center">
                <p className="text-2xl font-bold">{weight}kg</p>
                <p className="text-xs text-gray-400">Current Weight</p>
             </div>
             <ArrowRight className="text-gray-300 mb-4" />
             <div className="text-center">
                <p className="text-2xl font-bold text-emerald-500">{goalWeight}kg</p>
                <p className="text-xs text-gray-400">Jan 19, 2026</p>
             </div>
          </div>
       </div>

       {/* WhatsApp Community Invite (Translated) */}
       <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-2xl border border-green-100 dark:border-green-800/30 mb-6 text-left">
            <div className="flex gap-3 items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-200 dark:shadow-green-900/40 shrink-0">
                    <MessageCircle size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Join the VIP Community</h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">Exclusive tips and support on WhatsApp</p>
                </div>
            </div>
            <a 
                href="https://whatsapp.com/channel/0029Vb6k3ZK0rGiRHcLX0X2p"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-white dark:bg-zinc-800 text-green-600 dark:text-green-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-green-200 dark:border-green-900/50 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
                Access WhatsApp Group
            </a>
       </div>

       <div className="mt-auto">
         <ContinueBtn onClick={handleFinish} text="Start My Journey" />
       </div>
    </div>
  );

  return null;
};
