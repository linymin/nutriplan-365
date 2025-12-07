import { useState } from 'react';
import { Ingredient, IngredientCategory } from '@/types/meal';
import { commonIngredients, ingredientCategories, getCategoryEmoji } from '@/data/ingredients';
import { X, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface IngredientSelectorProps {
  selectedIngredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export const IngredientSelector = ({ selectedIngredients, onIngredientsChange }: IngredientSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>('肉类');
  const [searchQuery, setSearchQuery] = useState('');

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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="搜索食材..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
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
              {getCategoryEmoji(category)} {category}
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
    </div>
  );
};
