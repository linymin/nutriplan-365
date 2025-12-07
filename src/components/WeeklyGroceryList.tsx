import { Ingredient, IngredientCategory } from '@/types/meal';
import { getCategoryEmoji, ingredientCategories } from '@/data/ingredients';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface GroceryItem {
  ingredient: Ingredient;
  amount: number;
  checked: boolean;
}

interface WeeklyGroceryListProps {
  items: GroceryItem[];
}

export const WeeklyGroceryList = ({ items }: WeeklyGroceryListProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const groupedItems = ingredientCategories.reduce((acc, category) => {
    const categoryItems = items.filter(item => item.ingredient.category === category);
    if (categoryItems.length > 0) {
      acc[category] = categoryItems;
    }
    return acc;
  }, {} as Record<IngredientCategory, GroceryItem[]>);

  const checkedCount = checkedItems.size;
  const totalCount = items.length;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">本周采购清单</h3>
            <p className="text-sm text-muted-foreground">
              已完成 {checkedCount}/{totalCount} 项
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-24">
          <div className="nutrition-bar">
            <div
              className="nutrition-fill bg-accent"
              style={{ width: `${(checkedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <span>{getCategoryEmoji(category as IngredientCategory)}</span>
              {category}
            </h4>
            <div className="space-y-2">
              {categoryItems.map((item) => {
                const isChecked = checkedItems.has(item.ingredient.id);
                return (
                  <button
                    key={item.ingredient.id}
                    onClick={() => toggleItem(item.ingredient.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl border transition-all",
                      isChecked
                        ? "bg-primary/5 border-primary/30 opacity-60"
                        : "bg-card border-border hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        isChecked
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-muted-foreground"
                      )}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className={cn(isChecked && "line-through text-muted-foreground")}>
                        {item.ingredient.name}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.amount}{item.ingredient.unit}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
