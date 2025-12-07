import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { Header } from '@/components/Header';
import { MealCard } from '@/components/MealCard';
import { DailyNutritionSummary } from '@/components/DailyNutritionSummary';
import { WeeklyGroceryList } from '@/components/WeeklyGroceryList';
import { getMealByMode, generateMealFromIngredients } from '@/data/meals';
import { NutritionInfo, Ingredient } from '@/types/meal';
import { Sun, Coffee, Moon, Sparkles, RefreshCw, ArrowLeft, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const RecipeRecommendation = () => {
  const navigate = useNavigate();
  const { mode, weeklyIngredients, pushDay, setPushDay, pushTime, setPushTime } = useMealPlan();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
  const dailyMeals = useMemo(() => ({
    breakfast: generateMealFromIngredients(mode, 'breakfast', weeklyIngredients),
    lunch: generateMealFromIngredients(mode, 'lunch', weeklyIngredients),
    dinner: generateMealFromIngredients(mode, 'dinner', weeklyIngredients),
  }), [mode, weeklyIngredients, refreshKey]);

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

  const handleSaveSettings = () => {
    setIsSettingsOpen(false);
    toast({
      title: '推送设置已保存',
      description: `每${dayNames[pushDay]} ${pushTime} 将推送采购清单`,
    });
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
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate('/ingredients')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            修改食材
          </Button>
          <div className="flex gap-3">
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Bell className="w-4 h-4" />
                  推送设置
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>采购清单推送设置</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    设置每周推送采购清单的时间，我们将根据您的饮食模式为您推荐本周所需食材
                  </p>
                  <div className="space-y-2">
                    <Label>推送日期</Label>
                    <Select value={pushDay.toString()} onValueChange={(v) => setPushDay(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dayNames.map((name, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>推送时间</Label>
                    <Input
                      type="time"
                      value={pushTime}
                      onChange={(e) => setPushTime(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveSettings} className="w-full">
                    保存设置
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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

        {/* Weekly Grocery Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                <span className="text-lg">🛒</span>
              </div>
              <h2 className="text-xl font-semibold">本周采购清单</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              下次推送：{dayNames[pushDay]} {pushTime}
            </p>
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

export default RecipeRecommendation;
