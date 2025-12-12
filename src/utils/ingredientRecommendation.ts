import { DietaryMode, Ingredient } from '@/types/meal';
import { commonIngredients } from '@/data/ingredients';
import { UserProfile } from '@/hooks/useUserProfile';
import { calculateBMR, calculateTDEE, getPersonalizedNutritionTargets } from './nutrition';

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

// Get recommended ingredient IDs based on mode and profile
export const getRecommendedIngredients = (
  mode: DietaryMode,
  profile: UserProfile | null
): string[] => {
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
  
  // Return top recommended ingredient IDs
  return scored
    .filter(s => s.score > 10)
    .slice(0, 20)
    .map(s => s.ingredient.id);
};

// Get recommendation reason for display
export const getRecommendationReason = (ingredient: Ingredient, mode: DietaryMode): string => {
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

// Calculate weekly purchase amount for each ingredient
export const calculateWeeklyPurchaseAmount = (
  ingredient: Ingredient,
  mode: DietaryMode,
  profile: UserProfile | null,
  totalSelectedIngredients: number
): { amount: number; unit: string } => {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile?.exerciseFrequency || null);
  const targets = getPersonalizedNutritionTargets(mode, profile);
  
  // Weekly calorie target
  const weeklyCalories = ((targets.calories.min + targets.calories.max) / 2) * 7;
  
  // Estimate each ingredient contributes proportionally based on category
  const categoryWeights: Record<string, number> = {
    '肉类': 0.20,    // 20% of calories from meat
    '海鲜': 0.10,    // 10% from seafood
    '蔬菜': 0.08,    // 8% from vegetables (low calorie density)
    '主食': 0.35,    // 35% from staples
    '豆制品': 0.08,  // 8% from legumes
    '蛋奶': 0.10,    // 10% from eggs/dairy
    '水果': 0.06,    // 6% from fruits
    '调味料': 0.03,  // 3% from seasonings
  };

  // Adjust weights based on mode
  let adjustedWeight = categoryWeights[ingredient.category] || 0.05;
  
  if (mode === 'muscle') {
    if (['肉类', '海鲜', '蛋奶', '豆制品'].includes(ingredient.category)) {
      adjustedWeight *= 1.3; // More protein sources
    }
    if (ingredient.category === '主食') {
      adjustedWeight *= 1.2; // More carbs for energy
    }
  } else if (mode === 'fatloss') {
    if (ingredient.category === '蔬菜') {
      adjustedWeight *= 1.5; // More vegetables
    }
    if (ingredient.category === '主食') {
      adjustedWeight *= 0.7; // Less carbs
    }
  }

  // Calculate calories from this category
  const categoryCalories = weeklyCalories * adjustedWeight;
  
  // Estimate items in same category (from typical selection)
  const itemsInCategory = Math.max(3, Math.ceil(totalSelectedIngredients / 8));
  
  // Calories per ingredient in this category
  const caloriesPerIngredient = categoryCalories / itemsInCategory;
  
  // Calculate grams needed
  const gramsNeeded = (caloriesPerIngredient / ingredient.caloriesPer100g) * 100;
  
  // Round to reasonable amounts
  let amount: number;
  let unit = ingredient.unit;
  
  if (unit === '个') {
    // For eggs, estimate 50g per egg
    amount = Math.ceil(gramsNeeded / 50);
    if (amount < 1) amount = 7; // At least 1 per day
  } else if (unit === '毫升') {
    amount = Math.round(gramsNeeded / 100) * 100; // Round to 100ml
    if (amount < 500) amount = 500;
  } else {
    // Round to nearest 50g
    amount = Math.round(gramsNeeded / 50) * 50;
    if (amount < 100) amount = 100;
    // Cap at reasonable amounts
    if (amount > 2000) amount = 2000;
  }
  
  return { amount, unit };
};
