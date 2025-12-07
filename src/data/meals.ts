import { Meal, DietaryMode, NutritionTarget } from '@/types/meal';
import { commonIngredients } from './ingredients';

const getIngredient = (id: string) => commonIngredients.find(i => i.id === id)!;

export const nutritionTargets: Record<DietaryMode, NutritionTarget> = {
  muscle: {
    mode: 'muscle',
    calories: { min: 2500, max: 3000 },
    proteinRatio: 0.35,
    carbsRatio: 0.45,
    fatRatio: 0.20,
  },
  fatloss: {
    mode: 'fatloss',
    calories: { min: 1500, max: 1800 },
    proteinRatio: 0.40,
    carbsRatio: 0.35,
    fatRatio: 0.25,
  },
  general: {
    mode: 'general',
    calories: { min: 2000, max: 2400 },
    proteinRatio: 0.25,
    carbsRatio: 0.50,
    fatRatio: 0.25,
  },
};

export const sampleMeals: Record<DietaryMode, { breakfast: Meal[]; lunch: Meal[]; dinner: Meal[] }> = {
  muscle: {
    breakfast: [
      {
        id: 'muscle-b1',
        type: 'breakfast',
        name: '高蛋白燕麦粥',
        description: '富含蛋白质和复合碳水，为一天提供持久能量',
        ingredients: [
          { ingredient: getIngredient('oats'), amount: 80 },
          { ingredient: getIngredient('egg'), amount: 100 },
          { ingredient: getIngredient('milk'), amount: 250 },
          { ingredient: getIngredient('banana'), amount: 100 },
        ],
        recipe: [
          '将燕麦片倒入碗中，加入250ml牛奶',
          '微波加热2-3分钟或煮至软糯',
          '另起锅煎两个鸡蛋至全熟',
          '将香蕉切片摆放在燕麦粥上',
          '配上煎蛋即可享用',
        ],
        nutrition: { calories: 580, protein: 32, carbs: 72, fat: 18, fiber: 8 },
        cookingTime: 15,
        difficulty: 'easy',
      },
      {
        id: 'muscle-b2',
        type: 'breakfast',
        name: '鸡胸肉三明治',
        description: '高蛋白早餐，快速补充肌肉所需营养',
        ingredients: [
          { ingredient: getIngredient('chicken-breast'), amount: 120 },
          { ingredient: getIngredient('egg'), amount: 50 },
          { ingredient: getIngredient('tomato'), amount: 80 },
          { ingredient: getIngredient('cucumber'), amount: 50 },
        ],
        recipe: [
          '鸡胸肉切薄片，用少许盐和黑胡椒腌制',
          '平底锅加少许油，煎至两面金黄',
          '煎一个太阳蛋',
          '番茄和黄瓜切片',
          '用全麦面包夹住所有食材',
        ],
        nutrition: { calories: 420, protein: 45, carbs: 25, fat: 15, fiber: 4 },
        cookingTime: 20,
        difficulty: 'easy',
      },
    ],
    lunch: [
      {
        id: 'muscle-l1',
        type: 'lunch',
        name: '牛肉西兰花盖饭',
        description: '经典增肌餐，蛋白质与碳水完美配比',
        ingredients: [
          { ingredient: getIngredient('beef'), amount: 200 },
          { ingredient: getIngredient('broccoli'), amount: 150 },
          { ingredient: getIngredient('rice'), amount: 200 },
          { ingredient: getIngredient('carrot'), amount: 50 },
        ],
        recipe: [
          '牛肉切片，用生抽、料酒腌制15分钟',
          '西兰花焯水备用',
          '热锅下油，大火快炒牛肉至变色',
          '加入西兰花和胡萝卜翻炒',
          '调入适量蚝油和盐，盖在米饭上',
        ],
        nutrition: { calories: 750, protein: 58, carbs: 65, fat: 28, fiber: 6 },
        cookingTime: 30,
        difficulty: 'medium',
      },
    ],
    dinner: [
      {
        id: 'muscle-d1',
        type: 'dinner',
        name: '清蒸鱼配时蔬',
        description: '低脂高蛋白，易消化的晚餐选择',
        ingredients: [
          { ingredient: getIngredient('fish'), amount: 200 },
          { ingredient: getIngredient('spinach'), amount: 100 },
          { ingredient: getIngredient('tofu'), amount: 150 },
          { ingredient: getIngredient('mushroom'), amount: 80 },
        ],
        recipe: [
          '鱼洗净，两面抹少许盐和姜丝',
          '大火蒸8-10分钟至熟透',
          '豆腐切块与香菇一起清炒',
          '菠菜焯水后与主菜搭配',
          '淋上蒸鱼豉油即可',
        ],
        nutrition: { calories: 380, protein: 48, carbs: 12, fat: 16, fiber: 5 },
        cookingTime: 25,
        difficulty: 'medium',
      },
    ],
  },
  fatloss: {
    breakfast: [
      {
        id: 'fatloss-b1',
        type: 'breakfast',
        name: '低脂蔬菜蛋饼',
        description: '低卡高纤维，饱腹感强',
        ingredients: [
          { ingredient: getIngredient('egg'), amount: 100 },
          { ingredient: getIngredient('spinach'), amount: 80 },
          { ingredient: getIngredient('tomato'), amount: 60 },
          { ingredient: getIngredient('mushroom'), amount: 50 },
        ],
        recipe: [
          '蔬菜切碎备用',
          '鸡蛋打散，加入蔬菜碎拌匀',
          '加少许盐和黑胡椒调味',
          '不粘锅喷少量油，小火煎至两面金黄',
          '搭配番茄片食用',
        ],
        nutrition: { calories: 220, protein: 18, carbs: 8, fat: 12, fiber: 4 },
        cookingTime: 15,
        difficulty: 'easy',
      },
    ],
    lunch: [
      {
        id: 'fatloss-l1',
        type: 'lunch',
        name: '鸡胸肉沙拉',
        description: '清爽低卡，富含蛋白质和膳食纤维',
        ingredients: [
          { ingredient: getIngredient('chicken-breast'), amount: 150 },
          { ingredient: getIngredient('cucumber'), amount: 100 },
          { ingredient: getIngredient('tomato'), amount: 100 },
          { ingredient: getIngredient('carrot'), amount: 50 },
          { ingredient: getIngredient('broccoli'), amount: 80 },
        ],
        recipe: [
          '鸡胸肉水煮或煎至熟透，撕成丝',
          '蔬菜洗净切丁或片',
          '西兰花焯水沥干',
          '所有食材混合',
          '淋上橄榄油和柠檬汁调味',
        ],
        nutrition: { calories: 320, protein: 42, carbs: 18, fat: 8, fiber: 6 },
        cookingTime: 20,
        difficulty: 'easy',
      },
    ],
    dinner: [
      {
        id: 'fatloss-d1',
        type: 'dinner',
        name: '清炒时蔬豆腐',
        description: '低热量晚餐，促进新陈代谢',
        ingredients: [
          { ingredient: getIngredient('tofu'), amount: 200 },
          { ingredient: getIngredient('cabbage'), amount: 150 },
          { ingredient: getIngredient('mushroom'), amount: 80 },
          { ingredient: getIngredient('greenbean'), amount: 60 },
        ],
        recipe: [
          '豆腐切块，用少油煎至金黄',
          '白菜切丝，香菇切片',
          '热锅下油，爆香蒜末',
          '依次加入蔬菜翻炒',
          '最后加入豆腐，调味即可',
        ],
        nutrition: { calories: 250, protein: 22, carbs: 20, fat: 10, fiber: 8 },
        cookingTime: 20,
        difficulty: 'easy',
      },
    ],
  },
  general: {
    breakfast: [
      {
        id: 'general-b1',
        type: 'breakfast',
        name: '豆浆油条配小菜',
        description: '传统中式早餐，营养均衡',
        ingredients: [
          { ingredient: getIngredient('soymilk'), amount: 300 },
          { ingredient: getIngredient('egg'), amount: 50 },
          { ingredient: getIngredient('cucumber'), amount: 50 },
        ],
        recipe: [
          '豆浆加热至沸腾',
          '煮一个茶叶蛋或水煮蛋',
          '黄瓜切丝配少许醋和香油',
          '搭配一根油条享用',
        ],
        nutrition: { calories: 380, protein: 18, carbs: 45, fat: 15, fiber: 3 },
        cookingTime: 15,
        difficulty: 'easy',
      },
    ],
    lunch: [
      {
        id: 'general-l1',
        type: 'lunch',
        name: '番茄鸡蛋面',
        description: '家常美味，老少皆宜',
        ingredients: [
          { ingredient: getIngredient('noodles'), amount: 150 },
          { ingredient: getIngredient('tomato'), amount: 150 },
          { ingredient: getIngredient('egg'), amount: 100 },
          { ingredient: getIngredient('spinach'), amount: 50 },
        ],
        recipe: [
          '番茄切块，鸡蛋打散',
          '热锅下油，炒散鸡蛋盛出',
          '另起锅炒番茄出汁',
          '加水煮开，下面条',
          '面熟后加入鸡蛋和菠菜即可',
        ],
        nutrition: { calories: 480, protein: 22, carbs: 65, fat: 14, fiber: 5 },
        cookingTime: 25,
        difficulty: 'easy',
      },
    ],
    dinner: [
      {
        id: 'general-d1',
        type: 'dinner',
        name: '红烧排骨配米饭',
        description: '经典中式晚餐，香浓可口',
        ingredients: [
          { ingredient: getIngredient('pork-ribs'), amount: 200 },
          { ingredient: getIngredient('rice'), amount: 150 },
          { ingredient: getIngredient('carrot'), amount: 80 },
          { ingredient: getIngredient('cabbage'), amount: 100 },
        ],
        recipe: [
          '排骨焯水去血沫',
          '热锅下油，加糖炒出焦糖色',
          '下排骨翻炒上色',
          '加入生抽、老抽、料酒和热水',
          '小火炖45分钟至软烂',
          '配白菜和胡萝卜清炒',
        ],
        nutrition: { calories: 680, protein: 35, carbs: 55, fat: 35, fiber: 4 },
        cookingTime: 60,
        difficulty: 'medium',
      },
    ],
  },
};

export const getMealByMode = (mode: DietaryMode, mealType: 'breakfast' | 'lunch' | 'dinner'): Meal => {
  const meals = sampleMeals[mode][mealType];
  return meals[Math.floor(Math.random() * meals.length)];
};
