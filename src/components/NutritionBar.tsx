import { cn } from '@/lib/utils';

interface NutritionBarProps {
  label: string;
  value: number;
  unit: string;
  percentage: number;
  color: 'protein' | 'carbs' | 'fat' | 'fiber';
}

export const NutritionBar = ({ label, value, unit, percentage, color }: NutritionBarProps) => {
  const colorClasses = {
    protein: 'bg-protein',
    carbs: 'bg-carbs',
    fat: 'bg-fat',
    fiber: 'bg-fiber',
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}{unit}</span>
      </div>
      <div className="nutrition-bar">
        <div
          className={cn('nutrition-fill', colorClasses[color])}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
