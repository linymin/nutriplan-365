import { Ingredient, IngredientCategory } from '@/types/meal';

export const ingredientCategories: IngredientCategory[] = [
  '肉类',
  '蔬菜',
  '主食',
  '豆制品',
  '蛋奶',
  '水果',
  '海鲜',
  '调味料',
];

export const commonIngredients: Ingredient[] = [
  // 肉类
  { id: 'chicken-breast', name: '鸡胸肉', category: '肉类', unit: '克', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
  { id: 'pork-lean', name: '瘦猪肉', category: '肉类', unit: '克', caloriesPer100g: 143, proteinPer100g: 21, carbsPer100g: 0, fatPer100g: 6 },
  { id: 'beef', name: '牛肉', category: '肉类', unit: '克', caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 15 },
  { id: 'pork-ribs', name: '排骨', category: '肉类', unit: '克', caloriesPer100g: 264, proteinPer100g: 18, carbsPer100g: 0, fatPer100g: 21 },
  
  // 蔬菜
  { id: 'broccoli', name: '西兰花', category: '蔬菜', unit: '克', caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatPer100g: 0.4 },
  { id: 'spinach', name: '菠菜', category: '蔬菜', unit: '克', caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4 },
  { id: 'tomato', name: '番茄', category: '蔬菜', unit: '克', caloriesPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatPer100g: 0.2 },
  { id: 'carrot', name: '胡萝卜', category: '蔬菜', unit: '克', caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 10, fatPer100g: 0.2 },
  { id: 'cucumber', name: '黄瓜', category: '蔬菜', unit: '克', caloriesPer100g: 15, proteinPer100g: 0.7, carbsPer100g: 3.6, fatPer100g: 0.1 },
  { id: 'cabbage', name: '白菜', category: '蔬菜', unit: '克', caloriesPer100g: 25, proteinPer100g: 1.3, carbsPer100g: 5.8, fatPer100g: 0.1 },
  { id: 'mushroom', name: '香菇', category: '蔬菜', unit: '克', caloriesPer100g: 22, proteinPer100g: 2.2, carbsPer100g: 3.3, fatPer100g: 0.3 },
  { id: 'greenbean', name: '青豆', category: '蔬菜', unit: '克', caloriesPer100g: 81, proteinPer100g: 5.4, carbsPer100g: 14, fatPer100g: 0.4 },
  
  // 主食
  { id: 'rice', name: '大米', category: '主食', unit: '克', caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3 },
  { id: 'noodles', name: '面条', category: '主食', unit: '克', caloriesPer100g: 138, proteinPer100g: 4.5, carbsPer100g: 25, fatPer100g: 2 },
  { id: 'oats', name: '燕麦', category: '主食', unit: '克', caloriesPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatPer100g: 7 },
  { id: 'sweet-potato', name: '红薯', category: '主食', unit: '克', caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1 },
  { id: 'corn', name: '玉米', category: '主食', unit: '克', caloriesPer100g: 96, proteinPer100g: 3.4, carbsPer100g: 21, fatPer100g: 1.5 },
  
  // 豆制品
  { id: 'tofu', name: '豆腐', category: '豆制品', unit: '克', caloriesPer100g: 76, proteinPer100g: 8, carbsPer100g: 1.9, fatPer100g: 4.8 },
  { id: 'soymilk', name: '豆浆', category: '豆制品', unit: '毫升', caloriesPer100g: 33, proteinPer100g: 2.9, carbsPer100g: 2.5, fatPer100g: 1.5 },
  { id: 'edamame', name: '毛豆', category: '豆制品', unit: '克', caloriesPer100g: 121, proteinPer100g: 11, carbsPer100g: 10, fatPer100g: 5 },
  
  // 蛋奶
  { id: 'egg', name: '鸡蛋', category: '蛋奶', unit: '个', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11 },
  { id: 'milk', name: '牛奶', category: '蛋奶', unit: '毫升', caloriesPer100g: 42, proteinPer100g: 3.4, carbsPer100g: 5, fatPer100g: 1 },
  { id: 'yogurt', name: '酸奶', category: '蛋奶', unit: '克', caloriesPer100g: 59, proteinPer100g: 3.5, carbsPer100g: 4.7, fatPer100g: 3.3 },
  
  // 水果
  { id: 'apple', name: '苹果', category: '水果', unit: '克', caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2 },
  { id: 'banana', name: '香蕉', category: '水果', unit: '克', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3 },
  { id: 'orange', name: '橙子', category: '水果', unit: '克', caloriesPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12, fatPer100g: 0.1 },
  
  // 海鲜
  { id: 'shrimp', name: '虾', category: '海鲜', unit: '克', caloriesPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatPer100g: 0.3 },
  { id: 'fish', name: '鱼肉', category: '海鲜', unit: '克', caloriesPer100g: 82, proteinPer100g: 18, carbsPer100g: 0, fatPer100g: 0.7 },
  { id: 'salmon', name: '三文鱼', category: '海鲜', unit: '克', caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13 },
];

export const getIngredientsByCategory = (category: IngredientCategory): Ingredient[] => {
  return commonIngredients.filter(i => i.category === category);
};

export const getCategoryEmoji = (category: IngredientCategory): string => {
  const emojiMap: Record<IngredientCategory, string> = {
    '肉类': '🥩',
    '蔬菜': '🥬',
    '主食': '🍚',
    '豆制品': '🫘',
    '蛋奶': '🥚',
    '水果': '🍎',
    '海鲜': '🦐',
    '调味料': '🧂',
  };
  return emojiMap[category];
};
