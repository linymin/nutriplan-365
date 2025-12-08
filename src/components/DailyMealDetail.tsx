import { DailyMealPlan } from '@/types/meal';
import { MealCard } from './MealCard';
import { DailyNutritionSummary } from './DailyNutritionSummary';
import { Coffee, Sun, Moon, ArrowLeft, Check } from 'lucide-react';
import { Button } from './ui/button';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { cn } from '@/lib/utils';

interface DailyMealDetailProps {
  day: DailyMealPlan;
  onBack: () => void;
}

export const DailyMealDetail = ({ day, onBack }: DailyMealDetailProps) => {
  const { mode, toggleDayAdoption } = useMealPlan();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold">{day.dayName} 食谱详情</h2>
            <p className="text-sm text-muted-foreground">{day.date}</p>
          </div>
        </div>
        
        <Button
          variant={day.adopted ? 'default' : 'outline'}
          onClick={() => toggleDayAdoption(day.dayIndex)}
          className={cn(
            'gap-2',
            day.adopted && 'bg-green-500 hover:bg-green-600'
          )}
        >
          <Check className="w-4 h-4" />
          {day.adopted ? '已采纳' : '标记为已采纳'}
        </Button>
      </div>

      <DailyNutritionSummary nutrition={day.totalNutrition} mode={mode || 'general'} />

      <div className="grid md:grid-cols-3 gap-6">
        <MealCard
          meal={day.meals.breakfast}
          mealLabel="早餐"
          mealIcon={<Coffee className="w-5 h-5" />}
          delay={100}
        />
        <MealCard
          meal={day.meals.lunch}
          mealLabel="午餐"
          mealIcon={<Sun className="w-5 h-5" />}
          delay={200}
        />
        <MealCard
          meal={day.meals.dinner}
          mealLabel="晚餐"
          mealIcon={<Moon className="w-5 h-5" />}
          delay={300}
        />
      </div>
    </div>
  );
};
