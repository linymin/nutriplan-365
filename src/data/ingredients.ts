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
  { id: 'chicken-breast', name: '鸡胸肉', category: '肉类', unit: '克', emoji: '🍗', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
  { id: 'pork-lean', name: '瘦猪肉', category: '肉类', unit: '克', emoji: '🥓', caloriesPer100g: 143, proteinPer100g: 21, carbsPer100g: 0, fatPer100g: 6 },
  { id: 'beef', name: '牛肉', category: '肉类', unit: '克', emoji: '🥩', caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 15 },
  { id: 'pork-ribs', name: '排骨', category: '肉类', unit: '克', emoji: '🍖', caloriesPer100g: 264, proteinPer100g: 18, carbsPer100g: 0, fatPer100g: 21 },
  { id: 'chicken-leg', name: '鸡腿', category: '肉类', unit: '克', emoji: '🍗', caloriesPer100g: 180, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 8 },
  { id: 'pork-belly', name: '五花肉', category: '肉类', unit: '克', emoji: '🥓', caloriesPer100g: 518, proteinPer100g: 9, carbsPer100g: 0, fatPer100g: 53 },
  { id: 'duck', name: '鸭肉', category: '肉类', unit: '克', emoji: '🦆', caloriesPer100g: 135, proteinPer100g: 16, carbsPer100g: 0, fatPer100g: 7.5 },
  { id: 'lamb', name: '羊肉', category: '肉类', unit: '克', emoji: '🐑', caloriesPer100g: 294, proteinPer100g: 25, carbsPer100g: 0, fatPer100g: 21 },
  { id: 'chicken-wing', name: '鸡翅', category: '肉类', unit: '克', emoji: '🍗', caloriesPer100g: 203, proteinPer100g: 18, carbsPer100g: 0, fatPer100g: 14 },
  
  // 蔬菜
  { id: 'broccoli', name: '西兰花', category: '蔬菜', unit: '克', emoji: '🥦', caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatPer100g: 0.4 },
  { id: 'spinach', name: '菠菜', category: '蔬菜', unit: '克', emoji: '🥬', caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4 },
  { id: 'tomato', name: '番茄', category: '蔬菜', unit: '克', emoji: '🍅', caloriesPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatPer100g: 0.2 },
  { id: 'carrot', name: '胡萝卜', category: '蔬菜', unit: '克', emoji: '🥕', caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 10, fatPer100g: 0.2 },
  { id: 'cucumber', name: '黄瓜', category: '蔬菜', unit: '克', emoji: '🥒', caloriesPer100g: 15, proteinPer100g: 0.7, carbsPer100g: 3.6, fatPer100g: 0.1 },
  { id: 'cabbage', name: '白菜', category: '蔬菜', unit: '克', emoji: '🥬', caloriesPer100g: 25, proteinPer100g: 1.3, carbsPer100g: 5.8, fatPer100g: 0.1 },
  { id: 'mushroom', name: '香菇', category: '蔬菜', unit: '克', emoji: '🍄', caloriesPer100g: 22, proteinPer100g: 2.2, carbsPer100g: 3.3, fatPer100g: 0.3 },
  { id: 'greenbean', name: '青豆', category: '蔬菜', unit: '克', emoji: '🫛', caloriesPer100g: 81, proteinPer100g: 5.4, carbsPer100g: 14, fatPer100g: 0.4 },
  { id: 'potato', name: '土豆', category: '蔬菜', unit: '克', emoji: '🥔', caloriesPer100g: 77, proteinPer100g: 2, carbsPer100g: 17, fatPer100g: 0.1 },
  { id: 'eggplant', name: '茄子', category: '蔬菜', unit: '克', emoji: '🍆', caloriesPer100g: 25, proteinPer100g: 1, carbsPer100g: 6, fatPer100g: 0.2 },
  { id: 'pepper', name: '青椒', category: '蔬菜', unit: '克', emoji: '🫑', caloriesPer100g: 20, proteinPer100g: 0.9, carbsPer100g: 4.6, fatPer100g: 0.2 },
  { id: 'onion', name: '洋葱', category: '蔬菜', unit: '克', emoji: '🧅', caloriesPer100g: 40, proteinPer100g: 1.1, carbsPer100g: 9.3, fatPer100g: 0.1 },
  { id: 'garlic', name: '大蒜', category: '蔬菜', unit: '克', emoji: '🧄', caloriesPer100g: 149, proteinPer100g: 6.4, carbsPer100g: 33, fatPer100g: 0.5 },
  { id: 'lettuce', name: '生菜', category: '蔬菜', unit: '克', emoji: '🥬', caloriesPer100g: 15, proteinPer100g: 1.4, carbsPer100g: 2.9, fatPer100g: 0.2 },
  { id: 'celery', name: '芹菜', category: '蔬菜', unit: '克', emoji: '🥬', caloriesPer100g: 16, proteinPer100g: 0.7, carbsPer100g: 3, fatPer100g: 0.2 },
  { id: 'asparagus', name: '芦笋', category: '蔬菜', unit: '克', emoji: '🌿', caloriesPer100g: 20, proteinPer100g: 2.2, carbsPer100g: 3.9, fatPer100g: 0.1 },
  { id: 'chinese-cabbage', name: '大白菜', category: '蔬菜', unit: '克', emoji: '🥬', caloriesPer100g: 13, proteinPer100g: 1.5, carbsPer100g: 2.2, fatPer100g: 0.2 },
  { id: 'lotus-root', name: '莲藕', category: '蔬菜', unit: '克', emoji: '🪷', caloriesPer100g: 74, proteinPer100g: 2.6, carbsPer100g: 17.2, fatPer100g: 0.1 },
  
  // 主食
  { id: 'rice', name: '大米', category: '主食', unit: '克', emoji: '🍚', caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3 },
  { id: 'noodles', name: '面条', category: '主食', unit: '克', emoji: '🍜', caloriesPer100g: 138, proteinPer100g: 4.5, carbsPer100g: 25, fatPer100g: 2 },
  { id: 'oats', name: '燕麦', category: '主食', unit: '克', emoji: '🌾', caloriesPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatPer100g: 7 },
  { id: 'sweet-potato', name: '红薯', category: '主食', unit: '克', emoji: '🍠', caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1 },
  { id: 'corn', name: '玉米', category: '主食', unit: '克', emoji: '🌽', caloriesPer100g: 96, proteinPer100g: 3.4, carbsPer100g: 21, fatPer100g: 1.5 },
  { id: 'bread', name: '面包', category: '主食', unit: '克', emoji: '🍞', caloriesPer100g: 265, proteinPer100g: 9, carbsPer100g: 49, fatPer100g: 3.2 },
  { id: 'brown-rice', name: '糙米', category: '主食', unit: '克', emoji: '🍚', caloriesPer100g: 111, proteinPer100g: 2.6, carbsPer100g: 23, fatPer100g: 0.9 },
  { id: 'quinoa', name: '藜麦', category: '主食', unit: '克', emoji: '🌾', caloriesPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21.3, fatPer100g: 1.9 },
  { id: 'millet', name: '小米', category: '主食', unit: '克', emoji: '🌾', caloriesPer100g: 119, proteinPer100g: 3.5, carbsPer100g: 24, fatPer100g: 1 },
  { id: 'taro', name: '芋头', category: '主食', unit: '克', emoji: '🥔', caloriesPer100g: 112, proteinPer100g: 1.5, carbsPer100g: 26.5, fatPer100g: 0.1 },
  
  // 豆制品
  { id: 'tofu', name: '豆腐', category: '豆制品', unit: '克', emoji: '🧈', caloriesPer100g: 76, proteinPer100g: 8, carbsPer100g: 1.9, fatPer100g: 4.8 },
  { id: 'soymilk', name: '豆浆', category: '豆制品', unit: '毫升', emoji: '🥛', caloriesPer100g: 33, proteinPer100g: 2.9, carbsPer100g: 2.5, fatPer100g: 1.5 },
  { id: 'edamame', name: '毛豆', category: '豆制品', unit: '克', emoji: '🫘', caloriesPer100g: 121, proteinPer100g: 11, carbsPer100g: 10, fatPer100g: 5 },
  { id: 'dried-tofu', name: '豆干', category: '豆制品', unit: '克', emoji: '🧈', caloriesPer100g: 140, proteinPer100g: 16, carbsPer100g: 4.9, fatPer100g: 6.5 },
  { id: 'tofu-skin', name: '腐竹', category: '豆制品', unit: '克', emoji: '🧈', caloriesPer100g: 459, proteinPer100g: 44.6, carbsPer100g: 22.3, fatPer100g: 21.7 },
  
  // 蛋奶
  { id: 'egg', name: '鸡蛋', category: '蛋奶', unit: '个', emoji: '🥚', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11 },
  { id: 'milk', name: '牛奶', category: '蛋奶', unit: '毫升', emoji: '🥛', caloriesPer100g: 42, proteinPer100g: 3.4, carbsPer100g: 5, fatPer100g: 1 },
  { id: 'yogurt', name: '酸奶', category: '蛋奶', unit: '克', emoji: '🍶', caloriesPer100g: 59, proteinPer100g: 3.5, carbsPer100g: 4.7, fatPer100g: 3.3 },
  { id: 'cheese', name: '奶酪', category: '蛋奶', unit: '克', emoji: '🧀', caloriesPer100g: 402, proteinPer100g: 25, carbsPer100g: 1.3, fatPer100g: 33 },
  { id: 'duck-egg', name: '鸭蛋', category: '蛋奶', unit: '个', emoji: '🥚', caloriesPer100g: 185, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 14 },
  { id: 'quail-egg', name: '鹌鹑蛋', category: '蛋奶', unit: '个', emoji: '🥚', caloriesPer100g: 160, proteinPer100g: 13.1, carbsPer100g: 0.4, fatPer100g: 11.6 },
  
  // 水果
  { id: 'apple', name: '苹果', category: '水果', unit: '克', emoji: '🍎', caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2 },
  { id: 'banana', name: '香蕉', category: '水果', unit: '克', emoji: '🍌', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3 },
  { id: 'orange', name: '橙子', category: '水果', unit: '克', emoji: '🍊', caloriesPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12, fatPer100g: 0.1 },
  { id: 'grape', name: '葡萄', category: '水果', unit: '克', emoji: '🍇', caloriesPer100g: 69, proteinPer100g: 0.7, carbsPer100g: 18, fatPer100g: 0.2 },
  { id: 'watermelon', name: '西瓜', category: '水果', unit: '克', emoji: '🍉', caloriesPer100g: 30, proteinPer100g: 0.6, carbsPer100g: 8, fatPer100g: 0.2 },
  { id: 'kiwi', name: '猕猴桃', category: '水果', unit: '克', emoji: '🥝', caloriesPer100g: 61, proteinPer100g: 1.1, carbsPer100g: 15, fatPer100g: 0.5 },
  { id: 'strawberry', name: '草莓', category: '水果', unit: '克', emoji: '🍓', caloriesPer100g: 32, proteinPer100g: 0.7, carbsPer100g: 8, fatPer100g: 0.3 },
  { id: 'blueberry', name: '蓝莓', category: '水果', unit: '克', emoji: '🫐', caloriesPer100g: 57, proteinPer100g: 0.7, carbsPer100g: 14.5, fatPer100g: 0.3 },
  { id: 'pear', name: '梨', category: '水果', unit: '克', emoji: '🍐', caloriesPer100g: 50, proteinPer100g: 0.4, carbsPer100g: 13, fatPer100g: 0.1 },
  { id: 'peach', name: '桃子', category: '水果', unit: '克', emoji: '🍑', caloriesPer100g: 39, proteinPer100g: 0.9, carbsPer100g: 10, fatPer100g: 0.3 },
  
  // 海鲜
  { id: 'shrimp', name: '虾', category: '海鲜', unit: '克', emoji: '🦐', caloriesPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatPer100g: 0.3 },
  { id: 'fish', name: '鱼肉', category: '海鲜', unit: '克', emoji: '🐟', caloriesPer100g: 82, proteinPer100g: 18, carbsPer100g: 0, fatPer100g: 0.7 },
  { id: 'salmon', name: '三文鱼', category: '海鲜', unit: '克', emoji: '🍣', caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13 },
  { id: 'crab', name: '螃蟹', category: '海鲜', unit: '克', emoji: '🦀', caloriesPer100g: 97, proteinPer100g: 19, carbsPer100g: 0, fatPer100g: 1.5 },
  { id: 'squid', name: '鱿鱼', category: '海鲜', unit: '克', emoji: '🦑', caloriesPer100g: 92, proteinPer100g: 18, carbsPer100g: 3.1, fatPer100g: 1.4 },
  { id: 'scallop', name: '扇贝', category: '海鲜', unit: '克', emoji: '🐚', caloriesPer100g: 88, proteinPer100g: 17, carbsPer100g: 3.4, fatPer100g: 0.8 },
  { id: 'oyster', name: '生蚝', category: '海鲜', unit: '克', emoji: '🦪', caloriesPer100g: 81, proteinPer100g: 9.5, carbsPer100g: 4.9, fatPer100g: 2.3 },
  { id: 'sea-cucumber', name: '海参', category: '海鲜', unit: '克', emoji: '🌊', caloriesPer100g: 78, proteinPer100g: 16.5, carbsPer100g: 2.5, fatPer100g: 0.2 },
  { id: 'clam', name: '蛤蜊', category: '海鲜', unit: '克', emoji: '🐚', caloriesPer100g: 74, proteinPer100g: 12.8, carbsPer100g: 2.6, fatPer100g: 1 },
  
  // 调味料
  { id: 'soy-sauce', name: '酱油', category: '调味料', unit: '毫升', emoji: '🫗', caloriesPer100g: 53, proteinPer100g: 5.6, carbsPer100g: 5.6, fatPer100g: 0 },
  { id: 'oyster-sauce', name: '蚝油', category: '调味料', unit: '毫升', emoji: '🫗', caloriesPer100g: 120, proteinPer100g: 2.4, carbsPer100g: 20, fatPer100g: 0.3 },
  { id: 'vinegar', name: '醋', category: '调味料', unit: '毫升', emoji: '🍶', caloriesPer100g: 21, proteinPer100g: 0.4, carbsPer100g: 0.6, fatPer100g: 0 },
  { id: 'cooking-wine', name: '料酒', category: '调味料', unit: '毫升', emoji: '🍶', caloriesPer100g: 56, proteinPer100g: 0.4, carbsPer100g: 5, fatPer100g: 0 },
  { id: 'salt', name: '盐', category: '调味料', unit: '克', emoji: '🧂', caloriesPer100g: 0, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 0 },
  { id: 'sugar', name: '白糖', category: '调味料', unit: '克', emoji: '🧊', caloriesPer100g: 387, proteinPer100g: 0, carbsPer100g: 100, fatPer100g: 0 },
  { id: 'sesame-oil', name: '香油', category: '调味料', unit: '毫升', emoji: '🫒', caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100 },
  { id: 'cooking-oil', name: '食用油', category: '调味料', unit: '毫升', emoji: '🫒', caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100 },
  { id: 'ginger', name: '生姜', category: '调味料', unit: '克', emoji: '🫚', caloriesPer100g: 80, proteinPer100g: 1.8, carbsPer100g: 18, fatPer100g: 0.8 },
  { id: 'scallion', name: '葱', category: '调味料', unit: '克', emoji: '🧅', caloriesPer100g: 32, proteinPer100g: 1.8, carbsPer100g: 7.3, fatPer100g: 0.2 },
  { id: 'doubanjiang', name: '豆瓣酱', category: '调味料', unit: '克', emoji: '🫙', caloriesPer100g: 165, proteinPer100g: 10, carbsPer100g: 18, fatPer100g: 6 },
  { id: 'sweet-bean-sauce', name: '甜面酱', category: '调味料', unit: '克', emoji: '🫙', caloriesPer100g: 180, proteinPer100g: 4.8, carbsPer100g: 33, fatPer100g: 1.5 },
  { id: 'chili-oil', name: '辣椒油', category: '调味料', unit: '毫升', emoji: '🌶️', caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100 },
  { id: 'chili-pepper', name: '辣椒', category: '调味料', unit: '克', emoji: '🌶️', caloriesPer100g: 40, proteinPer100g: 1.9, carbsPer100g: 9, fatPer100g: 0.4 },
  { id: 'sichuan-pepper', name: '花椒', category: '调味料', unit: '克', emoji: '🌿', caloriesPer100g: 295, proteinPer100g: 10, carbsPer100g: 50, fatPer100g: 8 },
  { id: 'star-anise', name: '八角', category: '调味料', unit: '克', emoji: '⭐', caloriesPer100g: 337, proteinPer100g: 18, carbsPer100g: 43, fatPer100g: 12 },
  { id: 'cinnamon', name: '桂皮', category: '调味料', unit: '克', emoji: '🪵', caloriesPer100g: 247, proteinPer100g: 4, carbsPer100g: 81, fatPer100g: 1.2 },
  { id: 'five-spice', name: '五香粉', category: '调味料', unit: '克', emoji: '🌿', caloriesPer100g: 357, proteinPer100g: 10, carbsPer100g: 62, fatPer100g: 9 },
  { id: 'white-pepper', name: '白胡椒', category: '调味料', unit: '克', emoji: '🧂', caloriesPer100g: 296, proteinPer100g: 10.4, carbsPer100g: 64, fatPer100g: 2.1 },
  { id: 'black-pepper', name: '黑胡椒', category: '调味料', unit: '克', emoji: '🧂', caloriesPer100g: 251, proteinPer100g: 10, carbsPer100g: 64, fatPer100g: 3.3 },
  { id: 'chicken-essence', name: '鸡精', category: '调味料', unit: '克', emoji: '🧂', caloriesPer100g: 195, proteinPer100g: 35, carbsPer100g: 12, fatPer100g: 0.3 },
  { id: 'msg', name: '味精', category: '调味料', unit: '克', emoji: '🧂', caloriesPer100g: 288, proteinPer100g: 40, carbsPer100g: 24, fatPer100g: 0 },
  { id: 'starch', name: '淀粉', category: '调味料', unit: '克', emoji: '🌾', caloriesPer100g: 351, proteinPer100g: 0.1, carbsPer100g: 87, fatPer100g: 0.1 },
  { id: 'tomato-paste', name: '番茄酱', category: '调味料', unit: '克', emoji: '🍅', caloriesPer100g: 82, proteinPer100g: 3.6, carbsPer100g: 17, fatPer100g: 0.5 },
  { id: 'fermented-tofu', name: '腐乳', category: '调味料', unit: '克', emoji: '🧈', caloriesPer100g: 133, proteinPer100g: 10.9, carbsPer100g: 5.6, fatPer100g: 8.1 },
  { id: 'sesame-paste', name: '芝麻酱', category: '调味料', unit: '克', emoji: '🥜', caloriesPer100g: 618, proteinPer100g: 17, carbsPer100g: 22, fatPer100g: 52 },
  { id: 'peanut-butter', name: '花生酱', category: '调味料', unit: '克', emoji: '🥜', caloriesPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatPer100g: 50 },
  { id: 'honey', name: '蜂蜜', category: '调味料', unit: '克', emoji: '🍯', caloriesPer100g: 304, proteinPer100g: 0.3, carbsPer100g: 82, fatPer100g: 0 },
  { id: 'dark-soy', name: '老抽', category: '调味料', unit: '毫升', emoji: '🫗', caloriesPer100g: 70, proteinPer100g: 6, carbsPer100g: 8, fatPer100g: 0 },
  { id: 'light-soy', name: '生抽', category: '调味料', unit: '毫升', emoji: '🫗', caloriesPer100g: 53, proteinPer100g: 5, carbsPer100g: 6, fatPer100g: 0 },
];

export const getIngredientsByCategory = (category: IngredientCategory): Ingredient[] => {
  return commonIngredients.filter(i => i.category === category);
};

export const getIngredientEmoji = (ingredient: Ingredient): string => {
  return ingredient.emoji || getCategoryEmoji(ingredient.category);
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
