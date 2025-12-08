import { WeeklyMealPlan, NutritionInfo } from '@/types/meal';
import { Progress } from './ui/progress';
import { TrendingUp, TrendingDown, Minus, Award, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DietAnalysisCardProps {
  weeklyPlan: WeeklyMealPlan;
  previousWeekNutrition?: NutritionInfo;
}

export const DietAnalysisCard = ({ weeklyPlan, previousWeekNutrition }: DietAnalysisCardProps) => {
  // Calculate adoption rate
  const adoptedDays = weeklyPlan.days.filter(d => d.adopted).length;
  const adoptionRate = Math.round((adoptedDays / weeklyPlan.days.length) * 100);

  // Calculate daily averages
  const avgCalories = Math.round(weeklyPlan.totalNutrition.calories / 7);
  const avgProtein = Math.round(weeklyPlan.totalNutrition.protein / 7);
  const avgCarbs = Math.round(weeklyPlan.totalNutrition.carbs / 7);
  const avgFat = Math.round(weeklyPlan.totalNutrition.fat / 7);

  // Calculate category distribution
  const categoryCount = new Map<string, number>();
  weeklyPlan.ingredientsUsed.forEach(ing => {
    categoryCount.set(ing.category, (categoryCount.get(ing.category) || 0) + 1);
  });
  const totalIngredients = weeklyPlan.ingredientsUsed.length;

  // Calculate trends (mock data for now, would come from historical data)
  const getTrend = (current: number, previous?: number) => {
    if (!previous) return 'stable';
    const diff = ((current - previous) / previous) * 100;
    if (diff > 5) return 'increasing';
    if (diff < -5) return 'decreasing';
    return 'stable';
  };

  const TrendIcon = ({ trend }: { trend: 'increasing' | 'decreasing' | 'stable' }) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  // Calculate variety score (based on ingredient categories)
  const varietyScore = Math.min(100, Math.round((categoryCount.size / 8) * 100));
  
  // Calculate balance score (based on macro distribution)
  const totalMacros = avgProtein * 4 + avgCarbs * 4 + avgFat * 9;
  const proteinRatio = (avgProtein * 4) / totalMacros;
  const carbsRatio = (avgCarbs * 4) / totalMacros;
  const fatRatio = (avgFat * 9) / totalMacros;
  
  // Ideal ratios: protein 0.25-0.35, carbs 0.45-0.55, fat 0.20-0.30
  const proteinScore = proteinRatio >= 0.20 && proteinRatio <= 0.40 ? 100 : 50;
  const carbsScore = carbsRatio >= 0.40 && carbsRatio <= 0.60 ? 100 : 50;
  const fatScore = fatRatio >= 0.15 && fatRatio <= 0.35 ? 100 : 50;
  const balanceScore = Math.round((proteinScore + carbsScore + fatScore) / 3);

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
          <PieChart className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">饮食分析</h3>
          <p className="text-sm text-muted-foreground">本周饮食结构与营养情况</p>
        </div>
      </div>

      {/* Adoption Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">食谱采纳率</span>
          <span className="font-medium">{adoptedDays}/7 天 ({adoptionRate}%)</span>
        </div>
        <Progress value={adoptionRate} className="h-2" />
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">食材多样性</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-primary">{varietyScore}</span>
            <span className="text-sm text-muted-foreground mb-1">/ 100</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">使用了 {totalIngredients} 种食材</p>
        </div>

        <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">营养均衡度</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-accent">{balanceScore}</span>
            <span className="text-sm text-muted-foreground mb-1">/ 100</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">蛋白/碳水/脂肪比例</p>
        </div>
      </div>

      {/* Daily Averages */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">日均营养摄入</h4>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-xl bg-muted/30">
            <p className="text-xs text-muted-foreground mb-1">热量</p>
            <p className="font-semibold">{avgCalories}</p>
            <p className="text-xs text-muted-foreground">千卡</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-blue-500/10">
            <p className="text-xs text-muted-foreground mb-1">蛋白质</p>
            <p className="font-semibold text-blue-600">{avgProtein}g</p>
            <TrendIcon trend={getTrend(avgProtein, previousWeekNutrition?.protein && previousWeekNutrition.protein / 7)} />
          </div>
          <div className="text-center p-3 rounded-xl bg-amber-500/10">
            <p className="text-xs text-muted-foreground mb-1">碳水</p>
            <p className="font-semibold text-amber-600">{avgCarbs}g</p>
            <TrendIcon trend={getTrend(avgCarbs, previousWeekNutrition?.carbs && previousWeekNutrition.carbs / 7)} />
          </div>
          <div className="text-center p-3 rounded-xl bg-rose-500/10">
            <p className="text-xs text-muted-foreground mb-1">脂肪</p>
            <p className="font-semibold text-rose-600">{avgFat}g</p>
            <TrendIcon trend={getTrend(avgFat, previousWeekNutrition?.fat && previousWeekNutrition.fat / 7)} />
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">食材分类占比</h4>
        <div className="flex flex-wrap gap-2">
          {Array.from(categoryCount.entries()).map(([category, count]) => (
            <div
              key={category}
              className="px-3 py-1.5 rounded-full bg-muted/50 text-sm flex items-center gap-1"
            >
              <span>{category}</span>
              <span className="text-muted-foreground">({count}种)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="p-4 rounded-xl bg-muted/30 space-y-2">
        <h4 className="text-sm font-medium">下周建议</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          {adoptionRate < 70 && (
            <li>• 本周采纳率较低，建议根据实际情况调整食谱</li>
          )}
          {varietyScore < 70 && (
            <li>• 食材种类偏少，建议增加更多品类</li>
          )}
          {balanceScore < 70 && (
            <li>• 营养比例需要优化，注意蛋白质和碳水摄入</li>
          )}
          {adoptionRate >= 70 && varietyScore >= 70 && balanceScore >= 70 && (
            <li>• 本周饮食表现良好，继续保持！</li>
          )}
        </ul>
      </div>
    </div>
  );
};
