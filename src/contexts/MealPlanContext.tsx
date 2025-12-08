import { createContext, useContext, useState, ReactNode } from 'react';
import { DietaryMode, Ingredient, Meal, WeeklyMealPlan, DailyMealPlan, WeeklyDietRecord } from '@/types/meal';

interface MealPlanContextType {
  mode: DietaryMode | null;
  setMode: (mode: DietaryMode) => void;
  weeklyIngredients: Ingredient[];
  setWeeklyIngredients: (ingredients: Ingredient[]) => void;
  dailyMeals: { breakfast: Meal; lunch: Meal; dinner: Meal } | null;
  setDailyMeals: (meals: { breakfast: Meal; lunch: Meal; dinner: Meal }) => void;
  weeklyMealPlan: WeeklyMealPlan | null;
  setWeeklyMealPlan: (plan: WeeklyMealPlan | null) => void;
  pushDay: number; // 0-6, Sunday-Saturday
  setPushDay: (day: number) => void;
  pushTime: string;
  setPushTime: (time: string) => void;
  selectedDayIndex: number | null;
  setSelectedDayIndex: (index: number | null) => void;
  dietRecords: WeeklyDietRecord[];
  addDietRecord: (record: WeeklyDietRecord) => void;
  toggleDayAdoption: (dayIndex: number) => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export const MealPlanProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<DietaryMode | null>(null);
  const [weeklyIngredients, setWeeklyIngredients] = useState<Ingredient[]>([]);
  const [dailyMeals, setDailyMeals] = useState<{ breakfast: Meal; lunch: Meal; dinner: Meal } | null>(null);
  const [weeklyMealPlan, setWeeklyMealPlan] = useState<WeeklyMealPlan | null>(null);
  const [pushDay, setPushDay] = useState(0); // Sunday
  const [pushTime, setPushTime] = useState('09:00');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [dietRecords, setDietRecords] = useState<WeeklyDietRecord[]>([]);

  const addDietRecord = (record: WeeklyDietRecord) => {
    setDietRecords(prev => [...prev, record]);
  };

  const toggleDayAdoption = (dayIndex: number) => {
    if (!weeklyMealPlan) return;
    
    const updatedDays = weeklyMealPlan.days.map((day, idx) => 
      idx === dayIndex ? { ...day, adopted: !day.adopted } : day
    );
    
    setWeeklyMealPlan({
      ...weeklyMealPlan,
      days: updatedDays,
    });
  };

  return (
    <MealPlanContext.Provider value={{
      mode,
      setMode,
      weeklyIngredients,
      setWeeklyIngredients,
      dailyMeals,
      setDailyMeals,
      weeklyMealPlan,
      setWeeklyMealPlan,
      pushDay,
      setPushDay,
      pushTime,
      setPushTime,
      selectedDayIndex,
      setSelectedDayIndex,
      dietRecords,
      addDietRecord,
      toggleDayAdoption,
    }}>
      {children}
    </MealPlanContext.Provider>
  );
};

export const useMealPlan = () => {
  const context = useContext(MealPlanContext);
  if (!context) {
    throw new Error('useMealPlan must be used within a MealPlanProvider');
  }
  return context;
};
