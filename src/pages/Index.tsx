import { useState, useMemo } from 'react';
import { DietaryMode, Ingredient, Meal, NutritionInfo } from '@/types/meal';
import { Header } from '@/components/Header';
import { DietaryModeSelector } from '@/components/DietaryModeSelector';
import { IngredientSelector } from '@/components/IngredientSelector';
import { MealCard } from '@/components/MealCard';
import { DailyNutritionSummary } from '@/components/DailyNutritionSummary';
import { WeeklyGroceryList } from '@/components/WeeklyGroceryList';
import { getMealByMode } from '@/data/meals';
import { Sun, Coffee, Moon, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [mode, setMode] = useState<DietaryMode>('general');
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Generate meals based on mode
  const dailyMeals = useMemo(() => ({
    breakfast: getMealByMode(mode, 'breakfast'),
    lunch: getMealByMode(mode, 'lunch'),
    dinner: getMealByMode(mode, 'dinner'),
  }), [mode, refreshKey]);

  // Calculate total nutrition
  const totalNutrition: NutritionInfo = useMemo(() => {
    const meals = [dailyMeals.breakfast, dailyMeals.lunch, dailyMeals.dinner];
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.nutrition.calories,
        protein: acc.protein + meal.nutrition.protein,
        carbs: acc.carbs + meal.nutrition.carbs,
        fat: acc.fat + meal.nutrition.fat,
        fiber: acc.fiber + meal.nutrition.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [dailyMeals]);

  // Generate grocery list (7 days worth)
  const groceryList = useMemo(() => {
    const allIngredients = new Map<string, { ingredient: Ingredient; amount: number }>();
    
    // Multiply by 7 for weekly amounts
    const meals = [dailyMeals.breakfast, dailyMeals.lunch, dailyMeals.dinner];
    meals.forEach(meal => {
      meal.ingredients.forEach(({ ingredient, amount }) => {
        const existing = allIngredients.get(ingredient.id);
        if (existing) {
          existing.amount += amount * 7;
        } else {
          allIngredients.set(ingredient.id, { ingredient, amount: amount * 7 });
        }
      });
    });

    return Array.from(allIngredients.values()).map(item => ({
      ...item,
      checked: false,
    }));
  }, [dailyMeals]);

  const handleRefreshMeals = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            智能膳食规划
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            为您定制<span className="text-primary">营养均衡</span>的每日膳食
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            根据您的饮食目标和可用食材，智能生成三餐食谱，确保营养摄入符合中国居民膳食指南标准
          </p>
        </section>

        {/* Dietary Mode Section */}
        <section id="mode" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <span className="text-lg">🎯</span>
            </div>
            <h2 className="text-xl font-semibold">选择饮食模式</h2>
          </div>
          <DietaryModeSelector selectedMode={mode} onModeChange={setMode} />
        </section>

        {/* Ingredient Section */}
        <section id="ingredients" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <span className="text-lg">🥗</span>
            </div>
            <h2 className="text-xl font-semibold">选择可用食材</h2>
          </div>
          <p className="text-muted-foreground">
            告诉我们您手边有哪些食材，我们将为您推荐最合适的菜谱
          </p>
          <IngredientSelector
            selectedIngredients={selectedIngredients}
            onIngredientsChange={setSelectedIngredients}
          />
        </section>

        {/* Daily Plan Section */}
        <section id="plan" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <span className="text-lg">📋</span>
              </div>
              <h2 className="text-xl font-semibold">今日食谱推荐</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshMeals}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              换一批
            </Button>
          </div>

          {/* Nutrition Summary */}
          <DailyNutritionSummary nutrition={totalNutrition} mode={mode} />

          {/* Meal Cards */}
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

        {/* Weekly Grocery Section */}
        <section id="grocery" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
              <span className="text-lg">🛒</span>
            </div>
            <h2 className="text-xl font-semibold">本周采购清单</h2>
          </div>
          <p className="text-muted-foreground">
            基于本周的膳食计划，为您生成完整的采购清单
          </p>
          <WeeklyGroceryList items={groceryList} />
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

export default Index;
