import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, ArrowRight, Apple, Droplet, Sparkles, Shield, Activity, Brain, ChevronRight, Loader2 } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login } = useApp();
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState(0);
  
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // Intro Slides Data
  const slides = [
    {
      icon: <Activity size={40} className="text-white" />,
      title: "Confidence in Control",
      desc: "Track your GLP-1 medication and side effects with precision. We turn your data into actionable peace of mind.",
      color: "from-blue-600 to-indigo-600"
    },
    {
      icon: <Brain size={40} className="text-white" />,
      title: "Intelligent Guidance",
      desc: "Our AI understands your journey. Get real-time nutrition advice and psychology tips tailored to your metabolism.",
      color: "from-indigo-600 to-purple-600"
    },
    {
      icon: <Shield size={40} className="text-white" />,
      title: "Your Health Fortress",
      desc: "Monitor weight, protein, and water intake in one secure place. Build the habits that make the results last.",
      color: "from-purple-600 to-pink-600"
    }
  ];

  const handleNextIntro = () => {
    if (introStep < slides.length - 1) {
      setIntroStep(prev => prev + 1);
    } else {
      setShowIntro(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === 'forgot') {
        alert('Password reset link sent.');
        setMode('login');
      } else {
        login(email);
      }
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setSocialLoading(provider);
    setTimeout(() => {
      setSocialLoading(null);
      // Simulate a Google/Apple email
      login(`user@${provider}.com`);
    }, 1500);
  };

  // --- RENDER INTRO SLIDER ---
  if (showIntro) {
    const slide = slides[introStep];
    return (
      <div className="h-full flex flex-col justify-between p-8 bg-black relative overflow-hidden transition-colors duration-700">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className={`absolute top-[-10%] left-[-10%] w-96 h-96 bg-gradient-to-br ${slide.color} rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-blob`}></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-900 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center mt-10">
           <div 
             key={introStep} 
             className="animate-in zoom-in-50 duration-500 mb-8 p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative"
           >
             <div className={`absolute inset-0 bg-gradient-to-br ${slide.color} opacity-20 rounded-[2rem]`}></div>
             <div className="relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
               {slide.icon}
             </div>
           </div>
           
           <div key={introStep + 'text'} className="animate-in slide-in-from-bottom-8 fade-in duration-500">
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">{slide.title}</h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-xs mx-auto">{slide.desc}</p>
           </div>
        </div>

        {/* Navigation */}
        <div className="relative z-10 flex justify-between items-center w-full mt-auto mb-4">
           <div className="flex gap-2">
              {slides.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === introStep ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} 
                />
              ))}
           </div>
           
           <button 
             onClick={handleNextIntro}
             className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all"
           >
             <ChevronRight size={24} />
           </button>
        </div>
      </div>
    );
  }

  // --- RENDER LOGIN FORM (With Transitions) ---
  return (
    <div className="h-full flex flex-col justify-between p-8 bg-black relative overflow-hidden animate-in fade-in duration-700">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-900/40 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-900/40 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-900/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center mt-12 w-full">
        
        {/* Animated Logo */}
        <div className="relative mb-8 group">
            {/* Glow Ring */}
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
            
            {/* Logo Container */}
            <div className="relative w-28 h-28 bg-gradient-to-br from-indigo-950/80 to-black/80 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl animate-float">
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/10 to-transparent opacity-50"></div>
                
                {/* Icon Composition */}
                <div className="relative">
                    <Droplet size={48} className="text-indigo-500 drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]" fill="currentColor" />
                    <Sparkles size={20} className="text-white absolute -top-1 -right-2 animate-pulse" />
                </div>
            </div>
        </div>

        {/* Text Animation */}
        <div className="text-center animate-slide-up" style={{animationDelay: '0.1s'}}>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Gluco<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Track</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-[240px] mx-auto leading-relaxed">
              {mode === 'login' 
                ? 'Welcome back. Your health data is secure and ready.' 
                : mode === 'register' 
                ? 'Begin your transformation journey.' 
                : 'Recover your account access.'}
            </p>
        </div>
      </div>

      <div className="relative z-10 w-full animate-slide-up" style={{animationDelay: '0.2s'}}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-600 transition-all outline-none backdrop-blur-md"
              />
            </div>
            
            {mode !== 'forgot' && (
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-600 transition-all outline-none backdrop-blur-md"
                />
              </div>
            )}
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <button type="button" onClick={() => setMode('forgot')} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || socialLoading !== null}
            className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 active:scale-98 transition-all relative overflow-hidden group bg-white text-black disabled:opacity-70"
          >
            {/* Shimmer Effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Link'}</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="space-y-6 mt-8">
            {mode !== 'forgot' && (
            <>
                <div className="relative flex items-center justify-center">
                <div className="absolute w-full h-px bg-white/10"></div>
                <span className="relative bg-black px-4 text-gray-500 text-xs uppercase tracking-wider">Or continue with</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    disabled={socialLoading !== null}
                    className="flex items-center justify-center gap-2 py-3 border border-white/10 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white backdrop-blur-md active:scale-95"
                  >
                      {socialLoading === 'google' ? (
                         <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center overflow-hidden">
                             <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" className="w-3 h-3" alt="G" />
                          </div>
                          <span className="font-medium text-sm">Google</span>
                        </>
                      )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleSocialLogin('apple')}
                    disabled={socialLoading !== null}
                    className="flex items-center justify-center gap-2 py-3 border border-white/10 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white backdrop-blur-md active:scale-95"
                  >
                    {socialLoading === 'apple' ? (
                         <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          <Apple size={20} fill="currentColor" /> 
                          <span className="font-medium text-sm">Apple</span>
                        </>
                      )}
                  </button>
                </div>
            </>
            )}

            <p className="text-center text-gray-500 text-sm">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-white font-bold hover:underline"
            >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
            </p>
        </div>
      </div>
    </div>
  );
};