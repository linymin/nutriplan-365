import { useMemo } from 'react';
import { Ingredient, DietaryMode } from '@/types/meal';
import { commonIngredients, getCategoryEmoji } from '@/data/ingredients';
import { UserProfile } from '@/hooks/useUserProfile';
import { Sparkles, Plus, X, Flame, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IngredientRecommendationsProps {
  mode: DietaryMode;
  profile: UserProfile | null;
  selectedIngredients: Ingredient[];
  onToggleIngredient: (ingredient: Ingredient) => void;
}

// Mapping from profile ingredient values to actual ingredient IDs
const profileToIngredientMap: Record<string, string> = {
  'chicken': 'chicken-breast',
  'pork': 'pork-lean',
  'beef': 'beef',
  'fish': 'fish',
  'shrimp': 'shrimp',
  'eggs': 'egg',
  'tofu': 'tofu',
  'broccoli': 'broccoli',
  'tomato': 'tomato',
  'potato': 'potato',
  'rice': 'rice',
  'noodles': 'noodles',
  'cilantro': 'cilantro',
  'celery': 'celery',
  'bitter_melon': 'bitter_melon',
  'eggplant': 'eggplant',
  'mushroom': 'mushroom',
  'onion': 'onion',
  'garlic': 'garlic',
};

// Get recommendation reason
const getRecommendationReason = (ingredient: Ingredient, mode: DietaryMode): string => {
  if (mode === 'muscle') {
    if (ingredient.proteinPer100g > 20) return '高蛋白';
    if (ingredient.proteinPer100g > 10) return '优质蛋白';
    if (['肉类', '蛋奶', '海鲜'].includes(ingredient.category)) return '增肌推荐';
  } else if (mode === 'fatloss') {
    if (ingredient.caloriesPer100g < 50) return '极低热量';
    if (ingredient.caloriesPer100g < 100) return '低卡推荐';
    if (ingredient.category === '蔬菜') return '高纤维';
    if (ingredient.proteinPer100g > 15 && ingredient.fatPer100g < 5) return '高蛋白低脂';
  }
  return '均衡营养';
};

export const IngredientRecommendations = ({
  mode,
  profile,
  selectedIngredients,
  onToggleIngredient,
}: IngredientRecommendationsProps) => {
  const recommendations = useMemo(() => {
    let recommended = [...commonIngredients];

    // Get liked ingredient IDs from profile
    const likedIds = (profile?.likedIngredients || [])
      .map(v => profileToIngredientMap[v])
      .filter(Boolean);

    // Get disliked ingredient IDs from profile
    const dislikedIds = (profile?.dislikedIngredients || [])
      .map(v => profileToIngredientMap[v])
      .filter(Boolean);

    // Filter out disliked ingredients
    if (dislikedIds.length > 0) {
      recommended = recommended.filter(i => !dislikedIds.includes(i.id));
    }

    // Apply dietary restrictions
    const restrictions = profile?.dietaryRestrictions || [];
    if (restrictions.includes('vegetarian') || restrictions.includes('vegan')) {
      recommended = recommended.filter(i => 
        !['肉类', '海鲜'].includes(i.category)
      );
    }
    if (restrictions.includes('no_beef')) {
      recommended = recommended.filter(i => i.id !== 'beef');
    }
    if (restrictions.includes('no_pork')) {
      recommended = recommended.filter(i => 
        !['pork-lean', 'pork-ribs', 'pork-belly'].includes(i.id)
      );
    }
    if (restrictions.includes('seafood_allergy')) {
      recommended = recommended.filter(i => i.category !== '海鲜');
    }
    if (restrictions.includes('lactose_free')) {
      recommended = recommended.filter(i => 
        !['milk', 'yogurt'].includes(i.id)
      );
    }

    // Score and sort ingredients based on mode and preferences
    const scored = recommended.map(ingredient => {
      let score = 0;

      // Boost liked ingredients
      if (likedIds.includes(ingredient.id)) {
        score += 50;
      }

      // Mode-specific scoring
      if (mode === 'muscle') {
        if (ingredient.proteinPer100g > 15) score += 30;
        if (ingredient.proteinPer100g > 20) score += 20;
        if (['肉类', '蛋奶', '海鲜', '豆制品'].includes(ingredient.category)) score += 10;
      } else if (mode === 'fatloss') {
        if (ingredient.caloriesPer100g < 100) score += 20;
        if (ingredient.caloriesPer100g < 50) score += 15;
        if (ingredient.proteinPer100g > 10) score += 15;
        if (ingredient.category === '蔬菜') score += 25;
        if (ingredient.fatPer100g > 10) score -= 20;
      } else {
        score += 10;
      }

      // Boost based on exercise type
      const exerciseTypes = profile?.exerciseTypes || [];
      if (exerciseTypes.includes('strength') && ingredient.proteinPer100g > 15) {
        score += 15;
      }
      if (exerciseTypes.includes('cardio') && ingredient.carbsPer100g > 15) {
        score += 10;
      }

      return { ingredient, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 15).map(s => s.ingredient);
  }, [mode, profile]);

  if (recommendations.length === 0) {
    return null;
  }

  const getModeDescription = () => {
    switch (mode) {
      case 'muscle': return '高蛋白、优质碳水食材';
      case 'fatloss': return '低卡、高纤维、高饱腹感食材';
      default: return '营养均衡的食材搭配';
    }
  };

  return (
    <div className="glass-card rounded-xl p-4 mb-6 border border-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">为您推荐</h4>
          <p className="text-xs text-muted-foreground">
            {getModeDescription()}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-3">
        {recommendations.map(ingredient => {
          const isSelected = selectedIngredients.some(i => i.id === ingredient.id);
          const reason = getRecommendationReason(ingredient, mode);
          
          return (
            <button
              key={ingredient.id}
              onClick={() => onToggleIngredient(ingredient)}
              className={cn(
                'group relative inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all',
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary/50 text-foreground hover:bg-secondary hover:shadow-sm'
              )}
            >
              <span className="text-base">{ingredient.emoji}</span>
              <span className="font-medium">{ingredient.name}</span>
              
              {/* Nutrition hint badge */}
              {!isSelected && (
                <span className="ml-1 px-1.5 py-0.5 bg-background/80 rounded text-[10px] text-muted-foreground">
                  {reason}
                </span>
              )}
              
              {isSelected ? (
                <X className="w-3.5 h-3.5 ml-1" />
              ) : (
                <Plus className="w-3.5 h-3.5 ml-1 opacity-50 group-hover:opacity-100" />
              )}
              
              {/* Hover tooltip with nutrition info */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-popover text-popover-foreground text-xs rounded-lg shadow-lg p-2 whitespace-nowrap border">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      {ingredient.caloriesPer100g}卡
                    </span>
                    <span className="flex items-center gap-1">
                      <Dumbbell className="w-3 h-3 text-blue-500" />
                      {ingredient.proteinPer100g}g蛋白
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};