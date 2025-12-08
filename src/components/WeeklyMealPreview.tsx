import { DailyMealPlan } from '@/types/meal';
import { cn } from '@/lib/utils';
import { Check, ChevronRight } from 'lucide-react';

interface WeeklyMealPreviewProps {
  days: DailyMealPlan[];
  selectedDayIndex: number | null;
  onDaySelect: (index: number) => void;
  onToggleAdoption: (index: number) => void;
}

export const WeeklyMealPreview = ({
  days,
  selectedDayIndex,
  onDaySelect,
  onToggleAdoption,
}: WeeklyMealPreviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
      {days.map((day) => {
        const isSelected = selectedDayIndex === day.dayIndex;
        const dishCount = 
          day.meals.breakfast.dishes.length + 
          day.meals.lunch.dishes.length + 
          day.meals.dinner.dishes.length;
        
        return (
          <div
            key={day.dayIndex}
            className={cn(
              'glass-card rounded-xl p-4 cursor-pointer transition-all relative group',
              isSelected
                ? 'ring-2 ring-primary shadow-lg'
                : 'hover:shadow-md hover:border-primary/30',
              day.adopted && 'border-green-500/30 bg-green-500/5'
            )}
            onClick={() => onDaySelect(day.dayIndex)}
          >
            {/* Adoption checkbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleAdoption(day.dayIndex);
              }}
              className={cn(
                'absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                day.adopted
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-muted-foreground/50 hover:border-primary'
              )}
            >
              {day.adopted && <Check className="w-3 h-3" />}
            </button>

            <div className="text-center mb-3">
              <p className="font-semibold text-lg">{day.dayName}</p>
              <p className="text-xs text-muted-foreground">{day.date}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>🍳</span>
                <span className="truncate">{day.meals.breakfast.dishes[0]?.name || '早餐'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>🍱</span>
                <span className="truncate">{day.meals.lunch.dishes[0]?.name || '午餐'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>🌙</span>
                <span className="truncate">{day.meals.dinner.dishes[0]?.name || '晚餐'}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{dishCount} 道菜</p>
                <p className="text-sm font-medium text-primary">{Math.round(day.totalNutrition.calories)} 千卡</p>
              </div>
              <ChevronRight className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                isSelected && 'text-primary rotate-90'
              )} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
