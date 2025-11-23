
export interface UserGoals {
  calories: number;
  protein: number; // grams
  fiber: number; // grams
  water: number; // ml
  weight: number; // kg
  steps: number;
  pace?: 'slow' | 'moderate' | 'fast';
}

export interface PhotoEntry {
  id: string;
  date: string;
  weight: number;
  imageUrl?: string; // In a real app, this is a URL. For demo, we might use a placeholder or base64
  note?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  height: number; // cm
  startWeight: number; // kg
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  motivations?: string[];
  fearedSideEffects?: string[];
  foodCravingsDay?: string;
  progressPhotos?: PhotoEntry[]; // New: Progress tracking
  healthSync?: boolean; // New: Health Kit integration status
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  timestamp: string;
  imageUrl?: string;
  aiAdvice?: string; 
}

export interface SymptomLog {
  id: string;
  date: string;
  symptoms: Record<string, number>; // e.g., { nausea: 4, headache: 2 } (1-10 scale)
  notes?: string;
}

export interface DailyLog {
  date: string;
  waterIntake: number;
  caloriesConsumed: number;
  proteinConsumed: number;
  fiberConsumed: number;
  stepsTaken: number;
  activeMinutes: number;
  caloriesBurned: number; 
  medicationTaken: boolean;
  weight: number;
  foods: FoodItem[];
  symptoms?: SymptomLog;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: 'protein' | 'fiber' | 'hydration' | 'snack';
  isChecked: boolean;
  reason?: string; // Why this was recommended
}

export enum View {
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  SCANNER = 'SCANNER',
  JOURNAL = 'JOURNAL',
  PROFILE = 'PROFILE',
  ANALYTICS = 'ANALYTICS',
  AI_CHAT = 'AI_CHAT'
}

export type Theme = 'light' | 'dark';

export interface MedicationSchedule {
  drugName: string;
  dosage: string;
  frequency: string; // e.g., "Weekly"
  injectionDay: number; // 0 = Sunday, 1 = Monday, etc.
  injectionSite?: 'arm' | 'stomach' | 'thigh' | 'buttocks'; 
  history: Record<string, boolean>; // date string -> taken
  startDate: string;
}

export interface ChartDataPoint {
  day: string;
  value: number;
}

export interface PsychologyTip {
  id: string;
  title: string;
  content: string;
  category: 'mindset' | 'science' | 'habit';
}