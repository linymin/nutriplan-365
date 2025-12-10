import { useMemo } from 'react';
import { Ingredient, DietaryMode, IngredientCategory } from '@/types/meal';
import { commonIngredients, getCategoryEmoji } from '@/data/ingredients';
import { UserProfile } from '@/hooks/useUserProfile';
import { Sparkles, Plus, X } from 'lucide-react';
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
  'cilantro': 'cilantro', // Not in ingredients list but tracked
  'celery': 'celery',
  'bitter_melon': 'bitter_melon',
  'eggplant': 'eggplant',
  'mushroom': 'mushroom',
  'onion': 'onion',
  'garlic': 'garlic',
};

export const IngredientRecommendations = ({
  mode,
  profile,
  selectedIngredients,
  onToggleIngredient,
}: IngredientRecommendationsProps) => {
  const recommendations = useMemo(() => {
    // Filter ingredients based on mode and profile preferences
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
        // High protein foods
        if (ingredient.proteinPer100g > 15) score += 30;
        if (ingredient.proteinPer100g > 20) score += 20;
        // Prefer meat, eggs, dairy
        if (['肉类', '蛋奶', '海鲜', '豆制品'].includes(ingredient.category)) score += 10;
      } else if (mode === 'fatloss') {
        // Low calorie, high protein
        if (ingredient.caloriesPer100g < 100) score += 20;
        if (ingredient.proteinPer100g > 10) score += 15;
        // Prefer vegetables
        if (ingredient.category === '蔬菜') score += 25;
        // Avoid high fat
        if (ingredient.fatPer100g > 10) score -= 20;
      } else {
        // General: balanced variety
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

    // Sort by score and take top recommendations
    scored.sort((a, b) => b.score - a.score);

    // Return top 12 recommendations
    return scored.slice(0, 12).map(s => s.ingredient);
  }, [mode, profile]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="glass-card rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-medium text-foreground">为您推荐</h4>
        <span className="text-xs text-muted-foreground">
          基于您的{mode === 'muscle' ? '增肌' : mode === 'fatloss' ? '减脂' : '均衡'}目标和饮食偏好
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {recommendations.map(ingredient => {
          const isSelected = selectedIngredients.some(i => i.id === ingredient.id);
          return (
            <button
              key={ingredient.id}
              onClick={() => onToggleIngredient(ingredient)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/50 text-foreground hover:bg-secondary'
              )}
            >
              <span>{getCategoryEmoji(ingredient.category)}</span>
              <span>{ingredient.name}</span>
              {isSelected ? (
                <X className="w-3 h-3" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
