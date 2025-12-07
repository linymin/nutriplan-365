import { createContext, useContext, useState, ReactNode } from 'react';
import { DietaryMode, Ingredient, Meal } from '@/types/meal';

interface MealPlanContextType {
  mode: DietaryMode | null;
  setMode: (mode: DietaryMode) => void;
  weeklyIngredients: Ingredient[];
  setWeeklyIngredients: (ingredients: Ingredient[]) => void;
  dailyMeals: { breakfast: Meal; lunch: Meal; dinner: Meal } | null;
  setDailyMeals: (meals: { breakfast: Meal; lunch: Meal; dinner: Meal }) => void;
  pushDay: number; // 0-6, Sunday-Saturday
  setPushDay: (day: number) => void;
  pushTime: string;
  setPushTime: (time: string) => void;
}

const MealPlanContext = createContext<MealPlanContextType | undefined>(undefined);

export const MealPlanProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<DietaryMode | null>(null);
  const [weeklyIngredients, setWeeklyIngredients] = useState<Ingredient[]>([]);
  const [dailyMeals, setDailyMeals] = useState<{ breakfast: Meal; lunch: Meal; dinner: Meal } | null>(null);
  const [pushDay, setPushDay] = useState(0); // Sunday
  const [pushTime, setPushTime] = useState('09:00');

  return (
    <MealPlanContext.Provider value={{
      mode,
      setMode,
      weeklyIngredients,
      setWeeklyIngredients,
      dailyMeals,
      setDailyMeals,
      pushDay,
      setPushDay,
      pushTime,
      setPushTime,
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
