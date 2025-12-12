import { Ingredient, DietaryMode } from '@/types/meal';
import { calculateBMR, calculateTDEE, getPersonalizedNutritionTargets } from '@/utils/nutrition';
import { Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { UserProfile } from '@/hooks/useUserProfile';

interface NutritionSummaryCardProps {
  ingredients: Ingredient[];
  mode: DietaryMode;
  profile: UserProfile | null;
}

export const NutritionSummaryCard = ({ ingredients, mode, profile }: NutritionSummaryCardProps) => {
  // Calculate total nutrition from selected ingredients (assuming average 100g per ingredient per day)
  const avgDailyGramsPerIngredient = 100;
  
  const totalDailyNutrition = ingredients.reduce((acc, ing) => {
    return {
      calories: acc.calories + (ing.caloriesPer100g * avgDailyGramsPerIngredient) / 100,
      protein: acc.protein + (ing.proteinPer100g * avgDailyGramsPerIngredient) / 100,
      carbs: acc.carbs + (ing.carbsPer100g * avgDailyGramsPerIngredient) / 100,
      fat: acc.fat + (ing.fatPer100g * avgDailyGramsPerIngredient) / 100,
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // Get personalized targets
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile?.exerciseFrequency || null);
  const targets = getPersonalizedNutritionTargets(mode, profile);

  // Calculate target macros in grams
  const targetCalories = (targets.calories.min + targets.calories.max) / 2;
  const targetProtein = (targetCalories * targets.proteinRatio) / 4; // 4 cal per gram protein
  const targetCarbs = (targetCalories * targets.carbsRatio) / 4; // 4 cal per gram carbs
  const targetFat = (targetCalories * targets.fatRatio) / 9; // 9 cal per gram fat

  // Average daily based on selected ingredients - adjusted calculation
  // Assuming we'll use varied amounts across the week
  const estimatedDailyCalories = Math.round(totalDailyNutrition.calories / 3); // Divide by 3 meals rough estimate
  const estimatedDailyProtein = Math.round(totalDailyNutrition.protein / 3);
  const estimatedDailyCarbs = Math.round(totalDailyNutrition.carbs / 3);
  const estimatedDailyFat = Math.round(totalDailyNutrition.fat / 3);

  const getProgressColor = (actual: number, target: number) => {
    const ratio = actual / target;
    if (ratio < 0.7) return 'bg-amber-500';
    if (ratio > 1.3) return 'bg-rose-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="glass-card rounded-xl p-4 mb-6 border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Flame className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">日均营养估算</h4>
          <p className="text-xs text-muted-foreground">
            基于您的BMR({Math.round(bmr)}卡)和TDEE({Math.round(tdee)}卡)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Calories */}
        <div className="bg-background/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-xs font-medium text-muted-foreground">热量</span>
          </div>
          <div className="text-lg font-bold text-foreground">
            {estimatedDailyCalories}
            <span className="text-xs font-normal text-muted-foreground ml-1">
              / {Math.round(targetCalories)}卡
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${getProgressColor(estimatedDailyCalories, targetCalories)}`}
              style={{ width: `${Math.min((estimatedDailyCalories / targetCalories) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Protein */}
        <div className="bg-background/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Beef className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-xs font-medium text-muted-foreground">蛋白质</span>
          </div>
          <div className="text-lg font-bold text-foreground">
            {estimatedDailyProtein}
            <span className="text-xs font-normal text-muted-foreground ml-1">
              / {Math.round(targetProtein)}g
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${getProgressColor(estimatedDailyProtein, targetProtein)}`}
              style={{ width: `${Math.min((estimatedDailyProtein / targetProtein) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="bg-background/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Wheat className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-medium text-muted-foreground">碳水</span>
          </div>
          <div className="text-lg font-bold text-foreground">
            {estimatedDailyCarbs}
            <span className="text-xs font-normal text-muted-foreground ml-1">
              / {Math.round(targetCarbs)}g
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${getProgressColor(estimatedDailyCarbs, targetCarbs)}`}
              style={{ width: `${Math.min((estimatedDailyCarbs / targetCarbs) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Fat */}
        <div className="bg-background/50 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Droplet className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-muted-foreground">脂肪</span>
          </div>
          <div className="text-lg font-bold text-foreground">
            {estimatedDailyFat}
            <span className="text-xs font-normal text-muted-foreground ml-1">
              / {Math.round(targetFat)}g
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${getProgressColor(estimatedDailyFat, targetFat)}`}
              style={{ width: `${Math.min((estimatedDailyFat / targetFat) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground mt-3 text-center">
        * 以上为根据选中食材的粗略估算，实际食谱会根据用量进行精确计算
      </p>
    </div>
  );
};
