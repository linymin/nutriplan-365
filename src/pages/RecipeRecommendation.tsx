import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { Header } from '@/components/Header';
import { WeeklyMealPreview } from '@/components/WeeklyMealPreview';
import { DailyMealDetail } from '@/components/DailyMealDetail';
import { DietAnalysisCard } from '@/components/DietAnalysisCard';
import { IngredientWarning } from '@/components/IngredientWarning';
import { generateWeeklyMealPlan, checkIngredientsSufficiency } from '@/data/meals';
import { Sparkles, RefreshCw, ArrowLeft, ShoppingCart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RecipeRecommendation = () => {
  const navigate = useNavigate();
  const { mode, weeklyIngredients, weeklyMealPlan, setWeeklyMealPlan, selectedDayIndex, setSelectedDayIndex, toggleDayAdoption } = useMealPlan();
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Redirect if no mode or ingredients
  if (!mode) {
    navigate('/');
    return null;
  }

  if (weeklyIngredients.length === 0) {
    navigate('/ingredients');
    return null;
  }

  // Check ingredient sufficiency
  const ingredientCheck = useMemo(() => 
    checkIngredientsSufficiency(weeklyIngredients),
    [weeklyIngredients]
  );

  // Generate weekly meal plan if not exists
  const currentPlan = useMemo(() => {
    if (weeklyMealPlan && weeklyMealPlan.ingredientsUsed.length === weeklyIngredients.length) {
      return weeklyMealPlan;
    }
    const newPlan = generateWeeklyMealPlan(mode, weeklyIngredients);
    setWeeklyMealPlan(newPlan);
    return newPlan;
  }, [mode, weeklyIngredients]);

  const handleRefreshMeals = () => {
    const newPlan = generateWeeklyMealPlan(mode, weeklyIngredients);
    setWeeklyMealPlan(newPlan);
    setSelectedDayIndex(null);
  };

  const selectedDay = selectedDayIndex !== null ? currentPlan.days[selectedDayIndex] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <section className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            第三步：查看一周食谱
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            您的<span className="text-primary">7天食谱</span>已生成
          </h1>
          <p className="text-muted-foreground">
            基于{mode === 'muscle' ? '增肌' : mode === 'fatloss' ? '减脂' : '均衡'}模式和{weeklyIngredients.length}种食材制定
          </p>
        </section>

        {/* Ingredient Warning */}
        {!ingredientCheck.sufficient && (
          <IngredientWarning
            currentCount={ingredientCheck.currentCount}
            minimumCount={ingredientCheck.minimumCount}
            suggestions={ingredientCheck.suggestions}
          />
        )}

        {/* Actions */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <Button variant="outline" onClick={() => navigate('/ingredients')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            修改食材
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowAnalysis(!showAnalysis)} className="gap-2">
              <BarChart3 className="w-4 h-4" />
              {showAnalysis ? '隐藏分析' : '饮食分析'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/grocery')} className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              采购清单
            </Button>
            <Button onClick={handleRefreshMeals} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              重新生成
            </Button>
          </div>
        </div>

        {/* Diet Analysis */}
        {showAnalysis && <DietAnalysisCard weeklyPlan={currentPlan} />}

        {/* Weekly Preview or Daily Detail */}
        {selectedDay ? (
          <DailyMealDetail day={selectedDay} onBack={() => setSelectedDayIndex(null)} />
        ) : (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-lg">📅</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold">一周食谱预览</h2>
                <p className="text-sm text-muted-foreground">点击查看每天详细食谱，勾选标记已采纳</p>
              </div>
            </div>
            <WeeklyMealPreview
              days={currentPlan.days}
              selectedDayIndex={selectedDayIndex}
              onDaySelect={setSelectedDayIndex}
              onToggleAdoption={toggleDayAdoption}
            />
          </section>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">参考标准：《中国居民膳食指南（2022）》</p>
        </footer>
      </main>
    </div>
  );
};

export default RecipeRecommendation;
