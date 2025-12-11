import { DailyMealPlan } from '@/types/meal';
import { MealCard } from './MealCard';
import { DailyNutritionSummary } from './DailyNutritionSummary';
import { Coffee, Sun, Moon, ArrowLeft, Check, Lightbulb, Target } from 'lucide-react';
import { Button } from './ui/button';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getNutritionTargets } from '@/data/meals';
import { calculateBMR, calculateTDEE } from '@/utils/nutrition';
import { cn } from '@/lib/utils';

interface DailyMealDetailProps {
  day: DailyMealPlan;
  onBack: () => void;
}

export const DailyMealDetail = ({ day, onBack }: DailyMealDetailProps) => {
  const { mode, toggleDayAdoption } = useMealPlan();
  const { profile } = useUserProfile();
  
  // Calculate personalized targets
  const targets = getNutritionTargets(mode || 'general', profile);
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile?.exerciseFrequency || null);
  
  // Check if daily calories meet requirements
  const dailyCalories = day.totalNutrition.calories;
  const meetsMinimum = dailyCalories >= targets.calories.min * 0.9;
  const targetMet = dailyCalories >= targets.calories.min && dailyCalories <= targets.calories.max;
  
  // Generate daily tips based on mode
  const getDailyTips = () => {
    const tips: string[] = [];
    
    if (mode === 'muscle') {
      tips.push('建议在力量训练后30分钟内补充蛋白质');
      tips.push('可适当增加白米饭等碳水摄入支持训练');
    } else if (mode === 'fatloss') {
      tips.push('建议晚餐在7点前完成，避免夜间进食');
      tips.push('多喝水有助于提升代谢和饱腹感');
    } else {
      tips.push('均衡饮食，每餐尽量包含蛋白质、碳水和蔬菜');
      tips.push('细嚼慢咽有助于消化和控制食量');
    }
    
    return tips;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
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

      {/* Calorie Status Card */}
      <div className={cn(
        'p-4 rounded-xl border',
        targetMet ? 'bg-green-500/10 border-green-500/30' :
        meetsMinimum ? 'bg-amber-500/10 border-amber-500/30' :
        'bg-red-500/10 border-red-500/30'
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            targetMet ? 'bg-green-500/20' :
            meetsMinimum ? 'bg-amber-500/20' :
            'bg-red-500/20'
          )}>
            <Target className={cn(
              'w-5 h-5',
              targetMet ? 'text-green-600' :
              meetsMinimum ? 'text-amber-600' :
              'text-red-600'
            )} />
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{dailyCalories}</span>
              <span className="text-sm text-muted-foreground">千卡 / 天</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {profile?.weight && profile?.height ? (
                <>
                  您的基础代谢 <span className="font-medium text-foreground">{bmr}</span> 千卡，
                  每日消耗约 <span className="font-medium text-foreground">{tdee}</span> 千卡
                </>
              ) : (
                '完善个人资料可获得更精准的营养推荐'
              )}
            </p>
            <div className="mt-2 text-xs">
              <span className={cn(
                'px-2 py-1 rounded-full',
                targetMet ? 'bg-green-500/20 text-green-700' :
                meetsMinimum ? 'bg-amber-500/20 text-amber-700' :
                'bg-red-500/20 text-red-700'
              )}>
                {targetMet ? '✓ 热量达标' : 
                 meetsMinimum ? '接近目标，可适当增加' : 
                 '热量偏低，建议增加主食或蛋白质'}
              </span>
              <span className="ml-2 text-muted-foreground">
                目标: {targets.calories.min}-{targets.calories.max} 千卡
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Nutrition Summary */}
      <DailyNutritionSummary nutrition={day.totalNutrition} mode={mode || 'general'} />

      {/* Meal Cards */}
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

      {/* Daily Tips */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="font-medium">今日饮食小贴士</h3>
        </div>
        <ul className="space-y-2">
          {getDailyTips().map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-0.5">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};