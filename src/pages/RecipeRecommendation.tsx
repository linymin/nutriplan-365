import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { Header } from '@/components/Header';
import { MealCard } from '@/components/MealCard';
import { DailyNutritionSummary } from '@/components/DailyNutritionSummary';
import { generateDailyMeals } from '@/data/meals';
import { NutritionInfo } from '@/types/meal';
import { Sun, Coffee, Moon, Sparkles, RefreshCw, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RecipeRecommendation = () => {
  const navigate = useNavigate();
  const { mode, weeklyIngredients } = useMealPlan();
  const [refreshKey, setRefreshKey] = useState(0);

  // Redirect if no mode or ingredients
  if (!mode) {
    navigate('/');
    return null;
  }

  if (weeklyIngredients.length === 0) {
    navigate('/ingredients');
    return null;
  }

  // Generate meals based on mode and ingredients
  const dailyMeals = useMemo(() => 
    generateDailyMeals(mode, weeklyIngredients),
    [mode, weeklyIngredients, refreshKey]
  );

  // Calculate total nutrition
  const totalNutrition: NutritionInfo = useMemo(() => {
    const meals = [dailyMeals.breakfast, dailyMeals.lunch, dailyMeals.dinner];
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.totalNutrition.calories,
        protein: acc.protein + meal.totalNutrition.protein,
        carbs: acc.carbs + meal.totalNutrition.carbs,
        fat: acc.fat + meal.totalNutrition.fat,
        fiber: acc.fiber + meal.totalNutrition.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [dailyMeals]);

  const handleRefreshMeals = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Header */}
        <section className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            第三步：查看食谱推荐
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            您的<span className="text-primary">专属食谱</span>已生成
          </h1>
          <p className="text-muted-foreground">
            基于您选择的{mode === 'muscle' ? '增肌' : mode === 'fatloss' ? '减脂' : '均衡'}模式和{weeklyIngredients.length}种食材制定
          </p>
        </section>

        {/* Actions */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/ingredients')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            修改食材
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/grocery')}
              className="gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              采购清单
            </Button>
            <Button onClick={handleRefreshMeals} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              换一批食谱
            </Button>
          </div>
        </div>

        {/* Nutrition Summary */}
        <DailyNutritionSummary nutrition={totalNutrition} mode={mode} />

        {/* Daily Meals */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <span className="text-lg">📋</span>
            </div>
            <h2 className="text-xl font-semibold">今日三餐推荐</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <MealCard
              meal={dailyMeals.breakfast}
              mealLabel="早餐"
              mealIcon={<Coffee className="w-5 h-5" />}
              delay={100}
            />
            <MealCard
              meal={dailyMeals.lunch}
              mealLabel="午餐"
              mealIcon={<Sun className="w-5 h-5" />}
              delay={200}
            />
            <MealCard
              meal={dailyMeals.dinner}
              mealLabel="晚餐"
              mealIcon={<Moon className="w-5 h-5" />}
              delay={300}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            参考标准：《中国居民膳食指南（2022）》
          </p>
        </footer>
      </main>
    </div>
  );
};

export default RecipeRecommendation;
