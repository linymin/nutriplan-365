import { NutritionInfo, DietaryMode } from '@/types/meal';
import { nutritionTargets } from '@/data/meals';
import { cn } from '@/lib/utils';

interface DailyNutritionSummaryProps {
  nutrition: NutritionInfo;
  mode: DietaryMode;
}

export const DailyNutritionSummary = ({ nutrition, mode }: DailyNutritionSummaryProps) => {
  const target = nutritionTargets[mode];
  const avgTargetCalories = (target.calories.min + target.calories.max) / 2;

  const items = [
    { label: '总热量', value: nutrition.calories, unit: '卡', target: avgTargetCalories, color: 'bg-accent' },
    { label: '蛋白质', value: nutrition.protein, unit: 'g', target: (avgTargetCalories * target.proteinRatio) / 4, color: 'bg-protein' },
    { label: '碳水化合物', value: nutrition.carbs, unit: 'g', target: (avgTargetCalories * target.carbsRatio) / 4, color: 'bg-carbs' },
    { label: '脂肪', value: nutrition.fat, unit: 'g', target: (avgTargetCalories * target.fatRatio) / 9, color: 'bg-fat' },
  ];

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-semibold text-lg mb-6">今日营养摄入</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => {
          const percentage = Math.round((item.value / item.target) * 100);
          const isInRange = percentage >= 80 && percentage <= 120;

          return (
            <div key={item.label} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="6"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    fill="none"
                    stroke={item.label === '总热量' ? 'hsl(var(--accent))' : 
                           item.label === '蛋白质' ? 'hsl(var(--protein))' :
                           item.label === '碳水化合物' ? 'hsl(var(--carbs))' : 'hsl(var(--fat))'}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min(percentage, 100) * 2.26} 226`}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn(
                    "text-lg font-bold",
                    isInRange ? "text-primary" : percentage > 120 ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {percentage}%
                  </span>
                </div>
              </div>
              <p className="font-medium">{item.value}{item.unit}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-6">
        * 目标热量范围: {target.calories.min} - {target.calories.max} 卡路里/天
      </p>
    </div>
  );
};
