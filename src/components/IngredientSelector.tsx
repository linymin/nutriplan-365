import { useState } from 'react';
import { Ingredient, IngredientCategory } from '@/types/meal';
import { commonIngredients, ingredientCategories, getIngredientEmoji } from '@/data/ingredients';
import { X, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IngredientSelectorProps {
  selectedIngredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export const IngredientSelector = ({ selectedIngredients, onIngredientsChange }: IngredientSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>('肉类');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<IngredientCategory>('蔬菜');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');

  const filteredIngredients = commonIngredients.filter(ingredient => {
    const matchesCategory = ingredient.category === activeCategory;
    const matchesSearch = ingredient.name.toLowerCase().includes(searchQuery.toLowerCase());
    return searchQuery ? matchesSearch : matchesCategory;
  });

  const toggleIngredient = (ingredient: Ingredient) => {
    const isSelected = selectedIngredients.some(i => i.id === ingredient.id);
    if (isSelected) {
      onIngredientsChange(selectedIngredients.filter(i => i.id !== ingredient.id));
    } else {
      onIngredientsChange([...selectedIngredients, ingredient]);
    }
  };

  const removeIngredient = (ingredient: Ingredient) => {
    onIngredientsChange(selectedIngredients.filter(i => i.id !== ingredient.id));
  };

  const handleAddCustomIngredient = () => {
    if (!customName.trim()) return;
    
    const newIngredient: Ingredient = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      category: customCategory,
      unit: '克',
      emoji: '🥘',
      caloriesPer100g: parseFloat(customCalories) || 100,
      proteinPer100g: parseFloat(customProtein) || 5,
      carbsPer100g: parseFloat(customCarbs) || 10,
      fatPer100g: parseFloat(customFat) || 3,
    };
    
    onIngredientsChange([...selectedIngredients, newIngredient]);
    setIsCustomDialogOpen(false);
    setCustomName('');
    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
  };

  return (
    <div className="space-y-6">
      {/* Selected ingredients */}
      {selectedIngredients.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-3">已选食材 ({selectedIngredients.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map(ingredient => (
              <span
                key={ingredient.id}
                className="ingredient-tag bg-primary/10 text-primary"
              >
                {getIngredientEmoji(ingredient)} {ingredient.name}
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
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索食材..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              自定义
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
                  placeholder="例如：鳕鱼"
                />
              </div>
              <div className="space-y-2">
                <Label>分类</Label>
                <Select value={customCategory} onValueChange={(v) => setCustomCategory(v as IngredientCategory)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredientCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">以下营养成分为每100克含量（可选，留空使用默认值）</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>热量 (卡)</Label>
                  <Input
                    type="number"
                    value={customCalories}
                    onChange={(e) => setCustomCalories(e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>蛋白质 (克)</Label>
                  <Input
                    type="number"
                    value={customProtein}
                    onChange={(e) => setCustomProtein(e.target.value)}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label>碳水 (克)</Label>
                  <Input
                    type="number"
                    value={customCarbs}
                    onChange={(e) => setCustomCarbs(e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>脂肪 (克)</Label>
                  <Input
                    type="number"
                    value={customFat}
                    onChange={(e) => setCustomFat(e.target.value)}
                    placeholder="3"
                  />
                </div>
              </div>
              <Button onClick={handleAddCustomIngredient} className="w-full" disabled={!customName.trim()}>
                添加食材
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category tabs */}
      {!searchQuery && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Ingredients grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredIngredients.map(ingredient => {
          const isSelected = selectedIngredients.some(i => i.id === ingredient.id);
          return (
            <button
              key={ingredient.id}
              onClick={() => toggleIngredient(ingredient)}
              className={cn(
                'p-4 rounded-xl border-2 transition-all text-left',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-card hover:border-primary/30 hover:shadow-sm'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{getIngredientEmoji(ingredient)}</span>
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
    </div>
  );
};
