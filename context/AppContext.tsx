
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DailyLog, UserGoals, View, MedicationSchedule, FoodItem, UserProfile, Theme, SymptomLog, PhotoEntry, ShoppingItem } from '../types';
import { DEFAULT_GOALS, INITIAL_MEDICATION } from '../constants';

interface AppContextType {
  currentView: View;
  setCurrentView: (view: View) => void;
  theme: Theme;
  toggleTheme: () => void;
  
  todayLog: DailyLog;
  history: DailyLog[];
  userGoals: UserGoals;
  userProfile: UserProfile | null;
  medicationSchedule: MedicationSchedule;
  isAuthenticated: boolean;
  shoppingList: ShoppingItem[];
  
  // Fasting
  fastingStart: string | null;
  toggleFasting: () => void;
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  completeOnboarding: (profile: UserProfile, goals: UserGoals, meds: MedicationSchedule) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addWater: (amount: number) => void;
  addProtein: (amount: number) => void;
  addFiber: (amount: number) => void;
  addActivity: (steps: number, minutes: number, calories: number) => void;
  logFood: (food: FoodItem) => void;
  logSymptom: (symptoms: Record<string, number>, notes?: string) => void;
  toggleMedication: (date: string) => void;
  updateWeight: (weight: number) => void;
  updateUserGoals: (goals: UserGoals) => void;
  addProgressPhoto: (photo: PhotoEntry) => void;
  toggleShoppingItem: (id: string) => void;
  generateShoppingList: () => void;
  toggleHealthSync: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getTodayStr = () => new Date().toISOString().split('T')[0];

const INITIAL_LOG: DailyLog = {
  date: getTodayStr(),
  waterIntake: 0,
  caloriesConsumed: 0,
  proteinConsumed: 0,
  fiberConsumed: 0,
  stepsTaken: 0,
  activeMinutes: 0,
  caloriesBurned: 0,
  medicationTaken: false,
  weight: 0,
  foods: []
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<View>(View.AUTH);
  const [theme, setTheme] = useState<Theme>('light');
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userGoals, setUserGoals] = useState<UserGoals>(DEFAULT_GOALS);
  const [medicationSchedule, setMedicationSchedule] = useState<MedicationSchedule>(INITIAL_MEDICATION);
  const [todayLog, setTodayLog] = useState<DailyLog>(INITIAL_LOG);
  const [history, setHistory] = useState<DailyLog[]>([]);
  const [fastingStart, setFastingStart] = useState<string | null>(null);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);

  // Initialization
  useEffect(() => {
    const storedAuth = localStorage.getItem('gluco_auth');
    const storedTheme = localStorage.getItem('gluco_theme') as Theme;
    const storedProfile = localStorage.getItem('gluco_profile');
    const storedGoals = localStorage.getItem('gluco_goals');
    const storedMed = localStorage.getItem('gluco_med');
    const storedHistory = localStorage.getItem('gluco_history');
    const storedFasting = localStorage.getItem('gluco_fasting');
    const storedShopping = localStorage.getItem('gluco_shopping');
    
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === 'dark') document.documentElement.classList.add('dark');
    } else {
       if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setTheme('dark');
          document.documentElement.classList.add('dark');
       }
    }

    const todayStr = getTodayStr();
    const storedToday = localStorage.getItem(`gluco_log_${todayStr}`);

    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
        setCurrentView(View.DASHBOARD);
      } else {
        setCurrentView(View.ONBOARDING);
      }
    } else {
      setCurrentView(View.AUTH);
    }

    if (storedGoals) setUserGoals(JSON.parse(storedGoals));
    if (storedMed) setMedicationSchedule(JSON.parse(storedMed));
    if (storedHistory) setHistory(JSON.parse(storedHistory));
    if (storedFasting) setFastingStart(storedFasting);
    if (storedShopping) setShoppingList(JSON.parse(storedShopping));
    
    if (storedToday) {
      const parsed = JSON.parse(storedToday);
      setTodayLog({ ...INITIAL_LOG, ...parsed });
    } else {
      setTodayLog(prev => ({
        ...INITIAL_LOG,
        date: todayStr,
        weight: userProfile?.startWeight || 0
      }));
    }
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('gluco_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('gluco_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (userProfile) localStorage.setItem('gluco_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('gluco_goals', JSON.stringify(userGoals));
  }, [userGoals]);

  useEffect(() => {
    localStorage.setItem('gluco_med', JSON.stringify(medicationSchedule));
  }, [medicationSchedule]);

  useEffect(() => {
    localStorage.setItem('gluco_shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    if (fastingStart) {
      localStorage.setItem('gluco_fasting', fastingStart);
    } else {
      localStorage.removeItem('gluco_fasting');
    }
  }, [fastingStart]);

  useEffect(() => {
    localStorage.setItem(`gluco_log_${todayLog.date}`, JSON.stringify(todayLog));
    setHistory(prev => {
      const filtered = prev.filter(log => log.date !== todayLog.date);
      const newHistory = [...filtered, todayLog].sort((a, b) => b.date.localeCompare(a.date));
      localStorage.setItem('gluco_history', JSON.stringify(newHistory));
      return newHistory;
    });
  }, [todayLog]);

  // Actions
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const login = (email: string) => {
    setIsAuthenticated(true);
    if (!userProfile) {
      setCurrentView(View.ONBOARDING);
    } else {
      setCurrentView(View.DASHBOARD);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentView(View.AUTH);
    localStorage.clear();
    setUserProfile(null);
    setTheme('light');
    document.documentElement.classList.remove('dark');
  };

  const completeOnboarding = (profile: UserProfile, goals: UserGoals, meds: MedicationSchedule) => {
    setUserProfile(profile);
    setUserGoals(goals);
    setMedicationSchedule(meds);
    setTodayLog(prev => ({ ...prev, weight: profile.startWeight }));
    setCurrentView(View.DASHBOARD);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
  };

  const addWater = (amount: number) => {
    setTodayLog(prev => ({
      ...prev,
      waterIntake: Math.max(0, Math.min(prev.waterIntake + amount, 5000))
    }));
  };

  const addProtein = (amount: number) => {
    setTodayLog(prev => ({
      ...prev,
      proteinConsumed: Math.max(0, prev.proteinConsumed + amount)
    }));
  };

  const addFiber = (amount: number) => {
    setTodayLog(prev => ({
      ...prev,
      fiberConsumed: Math.max(0, prev.fiberConsumed + amount)
    }));
  };

  const addActivity = (steps: number, minutes: number, calories: number) => {
    setTodayLog(prev => ({
      ...prev,
      stepsTaken: prev.stepsTaken + steps,
      activeMinutes: prev.activeMinutes + minutes,
      caloriesBurned: (prev.caloriesBurned || 0) + calories
    }));
  };

  const logFood = (food: FoodItem) => {
    setTodayLog(prev => ({
      ...prev,
      caloriesConsumed: Math.round(prev.caloriesConsumed + food.calories),
      proteinConsumed: Math.round(prev.proteinConsumed + food.protein),
      fiberConsumed: Math.round(prev.fiberConsumed + food.fiber),
      foods: [food, ...prev.foods]
    }));
  };

  const logSymptom = (symptoms: Record<string, number>, notes?: string) => {
      const newSymptomLog: SymptomLog = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          symptoms,
          notes
      };
      setTodayLog(prev => ({
          ...prev,
          symptoms: newSymptomLog
      }));
  };

  const toggleMedication = (date: string) => {
    setMedicationSchedule(prev => {
      const newHistory = { ...prev.history };
      newHistory[date] = !newHistory[date];
      return { ...prev, history: newHistory };
    });
    if (date === getTodayStr()) {
      setTodayLog(prev => ({ ...prev, medicationTaken: !prev.medicationTaken }));
    }
  };

  const updateWeight = (weight: number) => {
    setTodayLog(prev => ({ ...prev, weight }));
  };

  const updateUserGoals = (goals: UserGoals) => {
    setUserGoals(goals);
  };

  const toggleFasting = () => {
    if (fastingStart) {
      setFastingStart(null);
    } else {
      setFastingStart(new Date().toISOString());
    }
  };

  const addProgressPhoto = (photo: PhotoEntry) => {
      setUserProfile(prev => {
          if (!prev) return null;
          const currentPhotos = prev.progressPhotos || [];
          return { ...prev, progressPhotos: [...currentPhotos, photo] };
      });
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(prev => prev.map(item => 
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    ));
  };

  const generateShoppingList = () => {
    // Smart logic based on goals
    const list: ShoppingItem[] = [];
    
    if (userGoals.protein > 100) {
      list.push(
        { id: '1', name: 'Greek Yogurt (0% Fat)', category: 'protein', isChecked: false, reason: 'Essential for protein goal' },
        { id: '2', name: 'Chicken Breast', category: 'protein', isChecked: false, reason: 'High protein, low fat' },
        { id: '3', name: 'Whey/Plant Protein', category: 'protein', isChecked: false, reason: 'Quick post-workout intake' }
      );
    }
    
    if (userGoals.fiber > 25) {
      list.push(
        { id: '4', name: 'Chia Seeds', category: 'fiber', isChecked: false, reason: 'Digestion aid for GLP-1' },
        { id: '5', name: 'Raspberries', category: 'fiber', isChecked: false, reason: 'High fiber fruit' },
        { id: '6', name: 'Oats', category: 'fiber', isChecked: false, reason: 'Sustained energy' }
      );
    }

    list.push(
      { id: '7', name: 'Electrolyte Powder', category: 'hydration', isChecked: false, reason: 'Prevents headaches' },
      { id: '8', name: 'Ginger Tea', category: 'snack', isChecked: false, reason: 'Nausea relief' }
    );

    setShoppingList(list);
  };

  const toggleHealthSync = () => {
    setUserProfile(prev => {
      if (!prev) return null;
      const newState = !prev.healthSync;
      // Simulate sync data if turning on
      if (newState) {
         // Trigger some visual feedback or mock data update in components
         setTimeout(() => {
             addActivity(1543, 12, 85); // Mock sync
         }, 1000);
      }
      return { ...prev, healthSync: newState };
    });
  };

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      theme,
      toggleTheme,
      todayLog,
      history,
      userGoals,
      userProfile,
      medicationSchedule,
      isAuthenticated,
      fastingStart,
      shoppingList,
      login,
      logout,
      completeOnboarding,
      updateUserProfile,
      addWater,
      addProtein,
      addFiber,
      addActivity,
      logFood,
      logSymptom,
      toggleMedication,
      updateWeight,
      updateUserGoals,
      toggleFasting,
      addProgressPhoto,
      toggleShoppingItem,
      generateShoppingList,
      toggleHealthSync
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
