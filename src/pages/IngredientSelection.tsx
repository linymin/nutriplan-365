import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ingredient, IngredientCategory } from '@/types/meal';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { Header } from '@/components/Header';
import { commonIngredients, ingredientCategories, getCategoryEmoji } from '@/data/ingredients';
import { X, Plus, Search, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const IngredientSelection = () => {
  const navigate = useNavigate();
  const { mode, weeklyIngredients, setWeeklyIngredients } = useMealPlan();
  
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
    navigate('/');
    return null;
  }

  const allIngredients = [...commonIngredients, ...customIngredients];

  const filteredIngredients = allIngredients.filter(ingredient => {
    const matchesCategory = ingredient.category === activeCategory;
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    return searchQuery ? matchesSearch : matchesCategory;
  });

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
    navigate('/recipes');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <section className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            第二步：选择本周食材
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            选择您<span className="text-primary">本周可用</span>的食材
          </h1>
          <p className="text-muted-foreground">
            告诉我们您手边有哪些食材，我们将为您推荐最合适的食谱
          </p>
        </section>

        {/* Selected ingredients */}
        {weeklyIngredients.length > 0 && (
          <div className="glass-card rounded-xl p-4 mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              已选食材 ({weeklyIngredients.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {weeklyIngredients.map(ingredient => (
                <span
                  key={ingredient.id}
                  className="ingredient-tag bg-primary/10 text-primary"
                >
                  {getCategoryEmoji(ingredient.category)} {ingredient.name}
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="ml-1 hover:text-destructive transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search and Custom Add */}
        <div className="flex gap-3 mb-6">
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
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                自定义食材
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

        {/* Category tabs */}
        {!searchQuery && (
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
            {ingredientCategories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {getCategoryEmoji(category)} {category}
              </button>
            ))}
          </div>
        )}

        {/* Ingredients grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
          {filteredIngredients.map(ingredient => {
            const isSelected = weeklyIngredients.some(i => i.id === ingredient.id);
            const isCustom = ingredient.id.startsWith('custom-');
            return (
              <button
                key={ingredient.id}
                onClick={() => toggleIngredient(ingredient)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all text-left relative',
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card hover:border-primary/30 hover:shadow-sm'
                )}
              >
                {isCustom && (
                  <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent">
                    自定义
                  </span>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{getCategoryEmoji(ingredient.category)}</span>
                  {isSelected ? (
                    <X className="w-4 h-4 text-primary" />
                  ) : (
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <p className="font-medium text-sm">{ingredient.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {ingredient.caloriesPer100g}卡/100{ingredient.unit}
                </p>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回选择模式
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={weeklyIngredients.length === 0}
            className="gap-2"
          >
            确认本周食材
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default IngredientSelection;
