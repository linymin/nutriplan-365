import { Meal, Dish } from '@/types/meal';
import { Clock, ChefHat, Flame, Utensils } from 'lucide-react';
import { NutritionBar } from './NutritionBar';
import { getIngredientEmoji } from '@/data/ingredients';
import { calculateDishNutrition } from '@/data/meals';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface MealCardProps {
  meal: Meal;
  mealLabel: string;
  mealIcon: React.ReactNode;
  delay?: number;
}

const difficultyLabels = {
  easy: '简单',
  medium: '中等',
  hard: '复杂',
};

const DishItem = ({ dish, index }: { dish: Dish; index: number }) => {
  const nutrition = calculateDishNutrition(dish);
  
  return (
    <div className="border-b border-border/50 last:border-0 pb-4 last:pb-0 mb-4 last:mb-0">
      {/* Dish Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{index === 0 ? '🍳' : index === 1 ? '🥗' : '🍲'}</span>
          <h4 className="font-semibold">{dish.name}</h4>
        </div>
        <div className="flex items-center gap-1 text-accent text-sm">
          <Flame className="w-3.5 h-3.5" />
          <span>{Math.round(nutrition.calories)}卡</span>
        </div>
      </div>
      
      {/* Dish Description */}
      <p className="text-sm text-muted-foreground mb-3">{dish.description}</p>
      
      {/* Ingredients - Always visible */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-2">所需食材：</p>
        <div className="flex flex-wrap gap-2">
          {dish.ingredients.map((item, idx) => (
            <span
              key={idx}
              className="ingredient-tag bg-secondary text-secondary-foreground"
            >
              {getIngredientEmoji(item.ingredient)} {item.ingredient.name}
              <span className="text-muted-foreground ml-1">
                {item.amount}{item.ingredient.unit}
              </span>
            </span>
          ))}
        </div>
      </div>
      
      {/* Meta info */}
      <div className="flex gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{dish.cookingTime}分钟</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <ChefHat className="w-3.5 h-3.5" />
          <span>{difficultyLabels[dish.difficulty]}</span>
        </div>
      </div>
      
      {/* Recipe Steps */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="recipe" className="border-0">
          <AccordionTrigger className="text-sm py-2 hover:no-underline text-primary">
            <span className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              查看做法
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <ol className="space-y-2 pt-2 pl-2">
              {dish.recipe.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export const MealCard = ({ meal, mealLabel, mealIcon, delay = 0 }: MealCardProps) => {
  const totalMacros = meal.totalNutrition.protein + meal.totalNutrition.carbs + meal.totalNutrition.fat;

  return (
    <div 
      className="meal-card opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {mealIcon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{mealLabel}</p>
            <p className="text-xs text-muted-foreground">{meal.dishes.length}道菜品</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-accent font-semibold">
          <Flame className="w-4 h-4" />
          <span>{meal.totalNutrition.calories}</span>
          <span className="text-xs text-muted-foreground">卡</span>
        </div>
      </div>

      {/* Dishes List */}
      <div className="mb-4">
        {meal.dishes.map((dish, index) => (
          <DishItem key={dish.id} dish={dish} index={index} />
        ))}
      </div>

      {/* Total Nutrition Summary */}
      <div className="pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-3">本餐营养汇总</p>
        <div className="grid grid-cols-2 gap-2">
          <NutritionBar
            label="蛋白质"
            value={meal.totalNutrition.protein}
            unit="g"
            percentage={(meal.totalNutrition.protein / totalMacros) * 100}
            color="protein"
          />
          <NutritionBar
            label="碳水"
            value={meal.totalNutrition.carbs}
            unit="g"
            percentage={(meal.totalNutrition.carbs / totalMacros) * 100}
            color="carbs"
          />
          <NutritionBar
            label="脂肪"
            value={meal.totalNutrition.fat}
            unit="g"
            percentage={(meal.totalNutrition.fat / totalMacros) * 100}
            color="fat"
          />
          <NutritionBar
            label="膳食纤维"
            value={meal.totalNutrition.fiber}
            unit="g"
            percentage={meal.totalNutrition.fiber * 5}
            color="fiber"
          />
        </div>
      </div>
    </div>
  );
};
