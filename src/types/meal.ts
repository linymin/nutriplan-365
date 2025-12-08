export type DietaryMode = 'muscle' | 'fatloss' | 'general';

export type IngredientCategory = 
  | '肉类' 
  | '蔬菜' 
  | '主食' 
  | '豆制品' 
  | '蛋奶' 
  | '水果' 
  | '调味料' 
  | '海鲜';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  unit: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  emoji: string;
}

export interface MealIngredient {
  ingredient: Ingredient;
  amount: number;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  ingredients: MealIngredient[];
  recipe: string[];
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  suitableFor: DietaryMode[];
  mealTypes: ('breakfast' | 'lunch' | 'dinner')[];
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  dishes: Dish[];
  totalNutrition: NutritionInfo;
}

export interface DailyMealPlan {
  date: string;
  dayIndex: number; // 0-6 for Monday-Sunday
  dayName: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  totalNutrition: NutritionInfo;
  adopted: boolean; // Whether user followed this plan
}

export interface WeeklyMealPlan {
  weekStartDate: string;
  mode: DietaryMode;
  days: DailyMealPlan[];
  totalNutrition: NutritionInfo;
  ingredientsUsed: Ingredient[];
}

export interface DailyPlan {
  date: string;
  mode: DietaryMode;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  totalNutrition: NutritionInfo;
}

export interface WeeklyGroceryItem {
  ingredient: Ingredient;
  totalAmount: number;
  estimatedCost: number;
}

export interface NutritionTarget {
  mode: DietaryMode;
  calories: { min: number; max: number };
  proteinRatio: number;
  carbsRatio: number;
  fatRatio: number;
}

// Diet tracking types
export interface WeeklyDietRecord {
  weekStartDate: string;
  mode: DietaryMode;
  plannedNutrition: NutritionInfo;
  actualNutrition: NutritionInfo;
  adoptionRate: number; // 0-100%
  categoryBreakdown: {
    category: IngredientCategory;
    plannedAmount: number;
    actualAmount: number;
  }[];
  recommendations: string[];
}

export interface DietAnalysis {
  currentWeek: WeeklyDietRecord;
  previousWeeks: WeeklyDietRecord[];
  trends: {
    caloriesTrend: 'increasing' | 'stable' | 'decreasing';
    proteinTrend: 'increasing' | 'stable' | 'decreasing';
    varietyScore: number; // 0-100
    balanceScore: number; // 0-100
  };
  suggestions: string[];
}
