import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ingredient, IngredientCategory } from '@/types/meal';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { Header } from '@/components/Header';
import { commonIngredients, ingredientCategories, getCategoryEmoji } from '@/data/ingredients';
import { IngredientExport } from '@/components/IngredientExport';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getRecommendedIngredients } from '@/utils/ingredientRecommendation';
import { X, Plus, Search, ArrowRight, ArrowLeft, Sparkles, AlertTriangle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { NutritionSummaryCard } from '@/components/NutritionSummaryCard';

const MIN_INGREDIENTS = 25;

const IngredientSelection = () => {
  const navigate = useNavigate();
  const { mode, weeklyIngredients, setWeeklyIngredients } = useMealPlan();
  const { profile } = useUserProfile();
  
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>('肉类');
  const [searchQuery, setSearchQuery] = useState('');
  const [customIngredients, setCustomIngredients] = useState<Ingredient[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Custom ingredient form
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<IngredientCategory>('蔬菜');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');

  // Redirect if no mode selected
  if (!mode) {
    navigate('/mode');
    return null;
  }

  const allIngredients = [...commonIngredients, ...customIngredients];

  // Get recommended ingredient IDs based on mode and profile
  const recommendedIngredientIds = useMemo(() => {
    return getRecommendedIngredients(mode, profile);
  }, [mode, profile]);

  const isRecommended = (ingredientId: string) => recommendedIngredientIds.includes(ingredientId);

  // Count recommendations per category
  const categoryRecommendationCounts = useMemo(() => {
    const counts: Record<IngredientCategory, number> = {} as Record<IngredientCategory, number>;
    ingredientCategories.forEach(cat => {
      counts[cat] = commonIngredients.filter(
        i => i.category === cat && isRecommended(i.id)
      ).length;
    });
    return counts;
  }, [recommendedIngredientIds]);

  // Count selected ingredients per category
  const categorySelectedCounts = useMemo(() => {
    const counts: Record<IngredientCategory, number> = {} as Record<IngredientCategory, number>;
    ingredientCategories.forEach(cat => {
      counts[cat] = weeklyIngredients.filter(i => i.category === cat).length;
    });
    return counts;
  }, [weeklyIngredients]);

  const filteredIngredients = useMemo(() => {
    let filtered = allIngredients.filter(ingredient => {
      const matchesCategory = ingredient.category === activeCategory;
      const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
      return searchQuery ? matchesSearch : matchesCategory;
    });
    
    // Sort by recommended first within category
    return filtered.sort((a, b) => {
      const aRec = isRecommended(a.id) ? 1 : 0;
      const bRec = isRecommended(b.id) ? 1 : 0;
      return bRec - aRec;
    });
  }, [allIngredients, activeCategory, searchQuery, recommendedIngredientIds]);

  const toggleIngredient = (ingredient: Ingredient) => {
    const isSelected = weeklyIngredients.some(i => i.id === ingredient.id);
    if (isSelected) {
      setWeeklyIngredients(weeklyIngredients.filter(i => i.id !== ingredient.id));
    } else {
      setWeeklyIngredients([...weeklyIngredients, ingredient]);
    }
  };

  const removeIngredient = (ingredient: Ingredient) => {
    setWeeklyIngredients(weeklyIngredients.filter(i => i.id !== ingredient.id));
  };

  const handleAddCustomIngredient = () => {
    if (!customName.trim()) {
      toast({ title: '请输入食材名称', variant: 'destructive' });
      return;
    }

    const newIngredient: Ingredient = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      unit: 'g',
      caloriesPer100g: parseFloat(customCalories) || 0,
      proteinPer100g: parseFloat(customProtein) || 0,
      carbsPer100g: parseFloat(customCarbs) || 0,
      fatPer100g: parseFloat(customFat) || 0,
      emoji: getCategoryEmoji(customCategory),
    };

    setCustomIngredients([...customIngredients, newIngredient]);
    setWeeklyIngredients([...weeklyIngredients, newIngredient]);
    
    // Reset form
    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    setIsDialogOpen(false);
    
    toast({ title: '已添加自定义食材', description: newIngredient.name });
  };

  const handleSubmit = () => {
    if (weeklyIngredients.length === 0) {
      toast({ title: '请至少选择一种食材', variant: 'destructive' });
      return;
    }
    
    if (weeklyIngredients.length < MIN_INGREDIENTS) {
      toast({ 
        title: '食材种类不足', 
        description: `建议至少选择${MIN_INGREDIENTS}种食材以确保营养均衡`,
        variant: 'destructive',
      });
      return;
    }
    
    navigate('/recipes');
  };

  const insufficientIngredients = weeklyIngredients.length > 0 && weeklyIngredients.length < MIN_INGREDIENTS;

  // Calculate missing categories for suggestions
  const getMissingSuggestions = () => {
    const selectedCategories = new Set(weeklyIngredients.map(i => i.category));
    const suggestions: string[] = [];
    
    ingredientCategories.forEach(cat => {
      const count = weeklyIngredients.filter(i => i.category === cat).length;
      if (count === 0) {
        suggestions.push(`添加${cat}`);
      } else if (count < 2) {
        suggestions.push(`增加${cat}种类`);
      }
    });
    
    return suggestions.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <section className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" />
            第二步：选择本周食材
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            选择您<span className="text-primary">本周可用</span>的食材
          </h1>
          <p className="text-muted-foreground text-sm">
            建议至少{MIN_INGREDIENTS}种以确保营养均衡
          </p>
        </section>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Fixed on desktop */}
          <aside className="lg:w-80 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-4 space-y-4">
              {/* Nutrition Summary */}
              <NutritionSummaryCard ingredients={weeklyIngredients} mode={mode} profile={profile} />

              {/* Selected Ingredients */}
              <div className="glass-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    已选食材 
                    <span className={cn(
                      "ml-2 px-2 py-0.5 rounded-full text-xs",
                      weeklyIngredients.length >= MIN_INGREDIENTS 
                        ? "bg-emerald-500/20 text-emerald-600" 
                        : "bg-amber-500/20 text-amber-600"
                    )}>
                      {weeklyIngredients.length}/{MIN_INGREDIENTS}
                    </span>
                  </h4>
                  {weeklyIngredients.length > 0 && (
                    <IngredientExport ingredients={weeklyIngredients} mode={mode} />
                  )}
                </div>
                
                {weeklyIngredients.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    请从右侧选择食材
                  </p>
                ) : (
                  <div className="max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                    <div className="flex flex-wrap gap-1.5">
                      {weeklyIngredients.map(ingredient => (
                        <span
                          key={ingredient.id}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium"
                        >
                          {getCategoryEmoji(ingredient.category)} {ingredient.name}
                          <button
                            onClick={() => removeIngredient(ingredient)}
                            className="ml-0.5 hover:text-destructive transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insufficient Warning */}
                {insufficientIngredients && (
                  <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-600">
                        <p className="font-medium mb-1">食材种类不足</p>
                        <p className="opacity-80">{getMissingSuggestions().join('、')}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation buttons - Desktop */}
              <div className="hidden lg:flex flex-col gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={weeklyIngredients.length === 0}
                  className="w-full gap-2"
                >
                  确认本周食材
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/mode')}
                  className="w-full gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  返回选择模式
                </Button>
              </div>
            </div>
          </aside>

          {/* Right Content - Scrollable */}
          <div className="flex-1 min-w-0">
            {/* Search and Custom Add */}
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="搜索食材..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 flex-shrink-0">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">自定义食材</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加自定义食材</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>食材名称 *</Label>
                      <Input
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="例如：藜麦"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>食材类别</Label>
                      <Select value={customCategory} onValueChange={(v) => setCustomCategory(v as IngredientCategory)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ingredientCategories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {getCategoryEmoji(cat)} {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>热量 (卡/100g)</Label>
                        <Input
                          type="number"
                          value={customCalories}
                          onChange={(e) => setCustomCalories(e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>蛋白质 (g/100g)</Label>
                        <Input
                          type="number"
                          value={customProtein}
                          onChange={(e) => setCustomProtein(e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>碳水 (g/100g)</Label>
                        <Input
                          type="number"
                          value={customCarbs}
                          onChange={(e) => setCustomCarbs(e.target.value)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>脂肪 (g/100g)</Label>
                        <Input
                          type="number"
                          value={customFat}
                          onChange={(e) => setCustomFat(e.target.value)}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddCustomIngredient} className="w-full">
                      添加食材
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Category tabs with selection counts */}
            {!searchQuery && (
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
                {ingredientCategories.map(category => {
                  const recCount = categoryRecommendationCounts[category];
                  const selectedCount = categorySelectedCounts[category];
                  return (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={cn(
                        'px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5',
                        activeCategory === category
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      )}
                    >
                      {getCategoryEmoji(category)} {category}
                      {/* Selected count badge */}
                      {selectedCount > 0 && (
                        <span className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                          activeCategory === category
                            ? 'bg-primary-foreground text-primary'
                            : 'bg-primary text-primary-foreground'
                        )}>
                          {selectedCount}
                        </span>
                      )}
                      {/* Recommendation count badge */}
                      {recCount > 0 && selectedCount === 0 && (
                        <span className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-full',
                          activeCategory === category
                            ? 'bg-primary-foreground/20 text-primary-foreground'
                            : 'bg-amber-500/20 text-amber-600'
                        )}>
                          <Star className="w-2.5 h-2.5 inline" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Ingredients grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredIngredients.map(ingredient => {
                const isSelected = weeklyIngredients.some(i => i.id === ingredient.id);
                const isCustom = ingredient.id.startsWith('custom-');
                const recommended = isRecommended(ingredient.id);
                return (
                  <button
                    key={ingredient.id}
                    onClick={() => toggleIngredient(ingredient)}
                    className={cn(
                      'p-3 rounded-xl border-2 transition-all text-left relative',
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-md'
                        : recommended
                        ? 'border-amber-400/50 bg-amber-50/30 dark:bg-amber-900/10 hover:border-amber-400 hover:shadow-sm'
                        : 'border-border bg-card hover:border-primary/30 hover:shadow-sm'
                    )}
                  >
                    {/* Badge area */}
                    <div className="absolute top-1.5 right-1.5 flex gap-1">
                      {recommended && !isSelected && (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-amber-500/20 text-amber-600 flex items-center gap-0.5">
                          <Star className="w-2 h-2" />
                        </span>
                      )}
                      {isCustom && (
                        <span className="text-[9px] px-1 py-0.5 rounded bg-accent/20 text-accent">
                          自定义
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">{ingredient.emoji || getCategoryEmoji(ingredient.category)}</span>
                      {isSelected ? (
                        <X className="w-4 h-4 text-primary" />
                      ) : (
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="font-medium text-sm mb-0.5 truncate">{ingredient.name}</p>
                    <p className="text-[11px] text-muted-foreground mb-1.5">
                      {ingredient.caloriesPer100g}卡/100{ingredient.unit}
                    </p>
                    {/* Macro nutrients with color coding */}
                    <div className="flex gap-1 flex-wrap">
                      <span className="text-[9px] px-1 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
                        蛋白{ingredient.proteinPer100g}
                      </span>
                      <span className="text-[9px] px-1 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                        碳水{ingredient.carbsPer100g}
                      </span>
                      <span className="text-[9px] px-1 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400">
                        脂肪{ingredient.fatPer100g}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Navigation - Mobile only */}
        <div className="lg:hidden flex justify-between mt-6 sticky bottom-4 bg-background/80 backdrop-blur-sm p-3 rounded-xl border border-border shadow-lg">
          <Button
            variant="outline"
            onClick={() => navigate('/mode')}
            className="gap-2"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={weeklyIngredients.length === 0}
            className="gap-2"
            size="sm"
          >
            确认食材 ({weeklyIngredients.length})
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default IngredientSelection;
