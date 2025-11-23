
import { UserGoals, MedicationSchedule, PsychologyTip } from './types';

export const DEFAULT_GOALS: UserGoals = {
  calories: 2000,
  protein: 130,
  fiber: 30,
  water: 2500,
  weight: 75,
  steps: 10000
};

export const INITIAL_MEDICATION: MedicationSchedule = {
  drugName: "Semaglutide",
  dosage: "0.26mg",
  frequency: "Weekly",
  injectionDay: 4, // Thursday
  history: {},
  startDate: new Date().toISOString()
};

export const MOCK_WEIGHT_HISTORY = [
  { day: 'Mon', value: 83.5 },
  { day: 'Tue', value: 83.2 },
  { day: 'Wed', value: 82.8 },
  { day: 'Thu', value: 82.5 },
  { day: 'Fri', value: 82.1 },
  { day: 'Sat', value: 82.0 },
  { day: 'Sun', value: 82.0 },
];

export const PSYCHOLOGY_TIPS: PsychologyTip[] = [
  {
    id: '1',
    title: 'Hunger is not an emergency',
    content: 'Physical hunger builds gradually. Emotional hunger hits suddenly. Pause for 5 minutes before eating.',
    category: 'mindset'
  },
  {
    id: '2',
    title: 'The 20-minute rule',
    content: 'It takes 20 minutes for your brain to register fullness. Eat slowly to let your body catch up.',
    category: 'science'
  },
  {
    id: '3',
    title: 'Slip-ups are data',
    content: 'Overate? Don’t beat yourself up. Ask "why" it happened and learn for next time.',
    category: 'mindset'
  },
  {
    id: '4',
    title: 'Volume Eating',
    content: 'Prioritize low-calorie, high-volume foods (like leafy greens) to feel full without the calorie density.',
    category: 'science'
  },
  {
    id: '5',
    title: 'Environment Design',
    content: 'Keep healthy snacks visible and hide the junk. We eat what we see.',
    category: 'habit'
  }
];
