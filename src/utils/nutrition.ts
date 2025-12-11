import { DietaryMode, NutritionTarget } from '@/types/meal';
import { UserProfile } from '@/hooks/useUserProfile';

// Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
// Default to male formula (slightly higher), can be adjusted if gender is added later
export const calculateBMR = (profile: UserProfile | null): number => {
  if (!profile?.weight || !profile?.height) {
    // Default BMR if no profile data
    return 1600;
  }
  
  const { weight, height } = profile;
  
  // Mifflin-St Jeor Equation (using average of male/female)
  // Male: (10 × weight in kg) + (6.25 × height in cm) − (5 × age) + 5
  // Female: (10 × weight in kg) + (6.25 × height in cm) − (5 × age) − 161
  // Since we don't have age, assume age 30 as default
  const assumedAge = 30;
  const maleBMR = (10 * weight) + (6.25 * height) - (5 * assumedAge) + 5;
  const femaleBMR = (10 * weight) + (6.25 * height) - (5 * assumedAge) - 161;
  
  // Use average
  return Math.round((maleBMR + femaleBMR) / 2);
};

// Calculate Total Daily Energy Expenditure based on activity level
export const calculateTDEE = (bmr: number, exerciseFrequency: string | null): number => {
  let activityMultiplier = 1.4; // Default: lightly active
  
  switch (exerciseFrequency) {
    case 'none':
      activityMultiplier = 1.2; // Sedentary
      break;
    case 'light':
      activityMultiplier = 1.375; // Light exercise
      break;
    case 'moderate':
      activityMultiplier = 1.55; // Moderate exercise
      break;
    case 'frequent':
      activityMultiplier = 1.725; // Very active
      break;
    case 'daily':
      activityMultiplier = 1.9; // Extra active
      break;
    default:
      activityMultiplier = 1.4;
  }
  
  return Math.round(bmr * activityMultiplier);
};

// Get personalized nutrition targets based on mode and user profile
export const getPersonalizedNutritionTargets = (
  mode: DietaryMode,
  profile: UserProfile | null
): NutritionTarget => {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile?.exerciseFrequency || null);
  
  // Ensure minimum is at least BMR
  let minCalories: number;
  let maxCalories: number;
  let proteinRatio: number;
  let carbsRatio: number;
  let fatRatio: number;
  
  switch (mode) {
    case 'muscle':
      // Surplus for muscle gain: TDEE + 300-500
      minCalories = Math.max(bmr, tdee + 200);
      maxCalories = tdee + 500;
      proteinRatio = 0.30; // Higher protein for muscle
      carbsRatio = 0.45;
      fatRatio = 0.25;
      break;
      
    case 'fatloss':
      // Deficit for fat loss: TDEE - 300-500, but never below BMR
      minCalories = Math.max(bmr, tdee - 500);
      maxCalories = Math.max(bmr + 100, tdee - 200);
      proteinRatio = 0.35; // Higher protein to preserve muscle
      carbsRatio = 0.35;
      fatRatio = 0.30;
      break;
      
    case 'general':
    default:
      // Maintenance around TDEE
      minCalories = Math.max(bmr, tdee - 100);
      maxCalories = tdee + 100;
      proteinRatio = 0.25;
      carbsRatio = 0.50;
      fatRatio = 0.25;
      break;
  }
  
  return {
    mode,
    calories: { min: minCalories, max: maxCalories },
    proteinRatio,
    carbsRatio,
    fatRatio,
  };
};

// Get meal calorie distribution
export const getMealCalorieDistribution = (dailyTarget: number, mode: DietaryMode): {
  breakfast: number;
  lunch: number;
  dinner: number;
} => {
  // Different distribution based on mode
  switch (mode) {
    case 'muscle':
      // More even distribution for muscle gain
      return {
        breakfast: Math.round(dailyTarget * 0.30),
        lunch: Math.round(dailyTarget * 0.35),
        dinner: Math.round(dailyTarget * 0.35),
      };
    case 'fatloss':
      // Lighter dinner for fat loss
      return {
        breakfast: Math.round(dailyTarget * 0.30),
        lunch: Math.round(dailyTarget * 0.40),
        dinner: Math.round(dailyTarget * 0.30),
      };
    default:
      // Standard distribution
      return {
        breakfast: Math.round(dailyTarget * 0.25),
        lunch: Math.round(dailyTarget * 0.40),
        dinner: Math.round(dailyTarget * 0.35),
      };
  }
};

// Format calorie display
export const formatCalories = (calories: number): string => {
  if (calories >= 1000) {
    return `${(calories / 1000).toFixed(1)}k`;
  }
  return `${Math.round(calories)}`;
};

// Get nutrition status color
export const getNutritionStatusColor = (
  actual: number,
  target: { min: number; max: number }
): 'success' | 'warning' | 'error' => {
  if (actual >= target.min && actual <= target.max) {
    return 'success';
  } else if (actual >= target.min * 0.9 && actual <= target.max * 1.1) {
    return 'warning';
  }
  return 'error';
};
