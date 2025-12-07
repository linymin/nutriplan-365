import { Meal } from '@/types/meal';
import { Clock, ChefHat, Flame } from 'lucide-react';
import { NutritionBar } from './NutritionBar';
import { getCategoryEmoji } from '@/data/ingredients';
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

export const MealCard = ({ meal, mealLabel, mealIcon, delay = 0 }: MealCardProps) => {
  const totalMacros = meal.nutrition.protein + meal.nutrition.carbs + meal.nutrition.fat;

  return (
    <div 
      className="meal-card opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {mealIcon}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{mealLabel}</p>
            <h3 className="font-semibold text-lg">{meal.name}</h3>
          </div>
        </div>
        <div className="flex items-center gap-1 text-accent font-semibold">
          <Flame className="w-4 h-4" />
          <span>{meal.nutrition.calories}</span>
          <span className="text-xs text-muted-foreground">卡</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">{meal.description}</p>

      {/* Meta info */}
      <div className="flex gap-4 mb-4 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{meal.cookingTime}分钟</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ChefHat className="w-4 h-4" />
          <span>{difficultyLabels[meal.difficulty]}</span>
        </div>
      </div>

      {/* Nutrition */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <NutritionBar
          label="蛋白质"
          value={meal.nutrition.protein}
          unit="g"
          percentage={(meal.nutrition.protein / totalMacros) * 100}
          color="protein"
        />
        <NutritionBar
          label="碳水"
          value={meal.nutrition.carbs}
          unit="g"
          percentage={(meal.nutrition.carbs / totalMacros) * 100}
          color="carbs"
        />
        <NutritionBar
          label="脂肪"
          value={meal.nutrition.fat}
          unit="g"
          percentage={(meal.nutrition.fat / totalMacros) * 100}
          color="fat"
        />
        <NutritionBar
          label="膳食纤维"
          value={meal.nutrition.fiber}
          unit="g"
          percentage={meal.nutrition.fiber * 5}
          color="fiber"
        />
      </div>

      {/* Accordion for ingredients and recipe */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="ingredients" className="border-b-0">
          <AccordionTrigger className="text-sm py-2 hover:no-underline">
            所需食材
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 pt-2">
              {meal.ingredients.map((item, idx) => (
                <span
                  key={idx}
                  className="ingredient-tag bg-secondary text-secondary-foreground"
                >
                  {getCategoryEmoji(item.ingredient.category)} {item.ingredient.name}
                  <span className="text-muted-foreground ml-1">
                    {item.amount}{item.ingredient.unit}
                  </span>
                </span>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="recipe" className="border-b-0">
          <AccordionTrigger className="text-sm py-2 hover:no-underline">
            烹饪步骤
          </AccordionTrigger>
          <AccordionContent>
            <ol className="space-y-2 pt-2">
              {meal.recipe.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
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
