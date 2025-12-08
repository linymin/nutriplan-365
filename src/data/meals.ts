import { Dish, DietaryMode, NutritionTarget, Ingredient, Meal, NutritionInfo } from '@/types/meal';
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

// Complete dish database with detailed recipes
export const dishDatabase: Dish[] = [
  // 增肌菜品
  {
    id: 'beef-broccoli-stir-fry',
    name: '蚝油牛肉西兰花',
    description: '经典增肌菜，高蛋白低脂肪，牛肉鲜嫩，西兰花爽脆',
    ingredients: [
      { ingredient: getIngredient('beef'), amount: 200 },
      { ingredient: getIngredient('broccoli'), amount: 150 },
    ],
    recipe: [
      '牛肉逆纹切薄片，用料酒、生抽、淀粉腌制15分钟',
      '西兰花切小朵，沸水中加少许盐和油，焯水1分钟捞出',
      '热锅凉油，油温七成热时快速滑炒牛肉至变色盛出',
      '锅留底油，爆香蒜末，下西兰花翻炒',
      '加入牛肉，调入蚝油、少许盐，大火快速翻炒均匀即可',
    ],
    cookingTime: 20,
    difficulty: 'medium',
    suitableFor: ['muscle', 'general'],
    mealTypes: ['lunch', 'dinner'],
  },
  {
    id: 'steamed-chicken-breast',
    name: '清蒸鸡胸肉',
    description: '低脂高蛋白，保留鸡肉原汁原味',
    ingredients: [
      { ingredient: getIngredient('chicken-breast'), amount: 200 },
    ],
    recipe: [
      '鸡胸肉洗净，用刀背轻轻拍松',
      '两面抹少许盐、料酒、姜丝，腌制10分钟',
      '放入蒸锅，大火蒸15分钟至熟透',
      '取出切片，淋上蒸鱼豉油和少许香油',
      '撒上葱花即可上桌',
    ],
    cookingTime: 25,
    difficulty: 'easy',
    suitableFor: ['muscle', 'fatloss'],
    mealTypes: ['lunch', 'dinner'],
  },
  {
    id: 'scrambled-eggs-tomato',
    name: '番茄炒蛋',
    description: '经典家常菜，酸甜可口，营养丰富',
    ingredients: [
      { ingredient: getIngredient('tomato'), amount: 200 },
      { ingredient: getIngredient('egg'), amount: 100 },
    ],
    recipe: [
      '番茄洗净切块，鸡蛋打散加少许盐搅匀',
      '热锅下油，倒入蛋液快速划散，凝固后盛出',
      '锅中再加少许油，下番茄块中火翻炒出汁',
      '加入少许糖提鲜，倒入炒好的鸡蛋',
      '轻轻翻炒均匀，撒上葱花即可出锅',
    ],
    cookingTime: 15,
    difficulty: 'easy',
    suitableFor: ['muscle', 'fatloss', 'general'],
    mealTypes: ['breakfast', 'lunch', 'dinner'],
  },
  {
    id: 'garlic-spinach',
    name: '蒜蓉菠菜',
    description: '清淡爽口，富含铁质和膳食纤维',
    ingredients: [
      { ingredient: getIngredient('spinach'), amount: 200 },
    ],
    recipe: [
      '菠菜洗净，沸水焯烫30秒捞出沥干',
      '大蒜切末备用',
      '热锅下油，爆香蒜末',
      '下菠菜快速翻炒，加盐调味',
      '出锅前淋少许香油提香',
    ],
    cookingTime: 10,
    difficulty: 'easy',
    suitableFor: ['muscle', 'fatloss', 'general'],
    mealTypes: ['lunch', 'dinner'],
  },
  {
    id: 'steamed-fish',
    name: '清蒸鲈鱼',
    description: '鱼肉鲜嫩，高蛋白低脂肪，营养价值极高',
    ingredients: [
      { ingredient: getIngredient('fish'), amount: 300 },
    ],
    recipe: [
      '鱼洗净，两面划几刀方便入味',
      '鱼身抹少许盐，肚内塞入姜片',
      '水开后放入蒸锅，大火蒸8-10分钟',
      '倒掉盘中蒸出的汤汁，铺上葱丝姜丝',
      '淋上热油和蒸鱼豉油即可',
    ],
    cookingTime: 20,
    difficulty: 'medium',
    suitableFor: ['muscle', 'fatloss', 'general'],
    mealTypes: ['lunch', 'dinner'],
  },
  {
    id: 'mapo-tofu',
    name: '麻婆豆腐',
    description: '川菜经典，麻辣鲜香，下饭神器',
    ingredients: [
      { ingredient: getIngredient('tofu'), amount: 300 },
      { ingredient: getIngredient('pork-lean'), amount: 50 },
    ],
    recipe: [
      '豆腐切小块，沸水中加盐焯烫2分钟捞出',
      '猪肉末用料酒腌制',
      '热锅下油，爆香豆瓣酱和蒜末',
      '下肉末炒散，加水和豆腐，小火煮5分钟',
      '勾芡收汁，撒花椒粉和葱花出锅',
    ],
    cookingTime: 20,
    difficulty: 'medium',
    suitableFor: ['general'],
    mealTypes: ['lunch', 'dinner'],
  },
  {
    id: 'shrimp-cucumber',
    name: '虾仁炒黄瓜',
    description: '清淡爽口，高蛋白低热量',
    ingredients: [
      { ingredient: getIngredient('shrimp'), amount: 150 },
      { ingredient: getIngredient('cucumber'), amount: 200 },
    ],
    recipe: [
      '虾仁洗净沥干，用料酒、盐、淀粉抓匀腌制',
      '黄瓜洗净切片',
      '热锅下油，滑炒虾仁至变色盛出',
      '锅中再下少许油，炒黄瓜片至断生',
      '加入虾仁，调入盐翻炒均匀即可',
    ],
    cookingTime: 15,
    difficulty: 'easy',
    suitableFor: ['muscle', 'fatloss'],
    mealTypes: ['lunch', 'dinner'],
  },
  {
    id: 'braised-pork-ribs',
    name: '红烧排骨',
    description: '色泽红亮，肉质软烂，香浓可口',
    ingredients: [
      { ingredient: getIngredient('pork-ribs'), amount: 300 },
    ],
    recipe: [
      '排骨冷水下锅，加姜片焯水后洗净',
      '热锅下油，加冰糖炒出焦糖色',
      '下排骨翻炒上色，加生抽、老抽、料酒',
      '加热水没过排骨，大火烧开转小火炖40分钟',
      '大火收汁，撒葱花出锅',
    ],
    cookingTime: 60,
    difficulty: 'medium',
    suitableFor: ['muscle', 'general'],
    mealTypes: ['lunch', 'dinner'],
  },
  {
    id: 'oatmeal-banana',
    name: '香蕉燕麦粥',
    description: '营养早餐，饱腹感强，能量持久',
    ingredients: [
      { ingredient: getIngredient('oats'), amount: 60 },
      { ingredient: getIngredient('banana'), amount: 100 },
      { ingredient: getIngredient('milk'), amount: 200 },
    ],
    recipe: [
      '燕麦片倒入碗中',
      '牛奶加热至微沸，倒入燕麦中',
      '搅拌均匀，静置2分钟让燕麦软化',
      '香蕉切片摆放在燕麦粥上',
      '可加少许蜂蜜调味',
    ],
    cookingTime: 10,
    difficulty: 'easy',
    suitableFor: ['muscle', 'general'],
    mealTypes: ['breakfast'],
  },
  {
    id: 'boiled-eggs',
    name: '白煮蛋',
    description: '简单营养，优质蛋白来源',
    ingredients: [
      { ingredient: getIngredient('egg'), amount: 100 },
    ],
    recipe: [
      '鸡蛋洗净放入冷水锅中',
      '水开后转小火煮8-10分钟',
      '捞出立即放入冷水中浸泡',
      '剥壳即可食用',
    ],
    cookingTime: 15,
    difficulty: 'easy',
    suitableFor: ['muscle', 'fatloss', 'general'],
    mealTypes: ['breakfast'],
  },
  {
    id: 'sauteed-cabbage',
    name: '清炒大白菜',
    description: '清淡爽口，富含维生素和膳食纤维',
    ingredients: [
      { ingredient: getIngredient('cabbage'), amount: 300 },
    ],
    recipe: [
      '白菜洗净，菜帮菜叶分开切块',
      '热锅下油，爆香蒜片',
      '先下菜帮翻炒1分钟',
      '再下菜叶，加盐翻炒至软',
      '出锅前可加少许醋提鲜',
    ],
    cookingTime: 10,
    difficulty: 'easy',
    suitableFor: ['fatloss', 'general'],
    mealTypes: ['lunch', 'dinner'],
  },
  {
    id: 'egg-drop-soup',
    name: '番茄蛋花汤',
    description: '开胃汤品，酸甜可口',
    ingredients: [
      { ingredient: getIngredient('tomato'), amount: 150 },
      { ingredient: getIngredient('egg'), amount: 50 },
    ],
    recipe: [
      '番茄去皮切小块，鸡蛋打散',
      '锅中加水烧开，放入番茄煮3分钟',
      '加盐、少许糖调味',
      '淋入蛋液，用筷子轻轻划散',
      '撒葱花，滴几滴香油即可',
    ],
    cookingTime: 15,
    difficulty: 'easy',
    suitableFor: ['fatloss', 'general'],
    mealTypes: ['breakfast', 'lunch', 'dinner'],
  },
  {
    id: 'mushroom-chicken',
    name: '香菇炖鸡',
    description: '鲜香味美，滋补养身',
    ingredients: [
      { ingredient: getIngredient('chicken-leg'), amount: 300 },
      { ingredient: getIngredient('mushroom'), amount: 100 },
    ],
    recipe: [
      '鸡腿切块焯水洗净，香菇泡发切片',
      '热锅下油，放入姜片和鸡块煸炒',
      '加料酒、生抽翻炒上色',
      '加入香菇和热水，大火烧开转小火炖30分钟',
      '加盐调味，大火收汁即可',
    ],
    cookingTime: 45,
    difficulty: 'medium',
    suitableFor: ['muscle', 'general'],
    mealTypes: ['lunch', 'dinner'],
  },
  {
    id: 'sweet-potato-porridge',
    name: '红薯粥',
    description: '粗粮早餐，促进消化，能量稳定释放',
    ingredients: [
      { ingredient: getIngredient('sweet-potato'), amount: 150 },
      { ingredient: getIngredient('rice'), amount: 50 },
    ],
    recipe: [
      '红薯洗净去皮切小块',
      '大米淘洗干净',
      '锅中加水，放入大米大火烧开',
      '转小火煮15分钟后加入红薯块',
      '继续煮20分钟至粥稠红薯软烂',
    ],
    cookingTime: 40,
    difficulty: 'easy',
    suitableFor: ['general'],
    mealTypes: ['breakfast'],
  },
  {
    id: 'steamed-rice',
    name: '白米饭',
    description: '主食基础，提供能量',
    ingredients: [
      { ingredient: getIngredient('rice'), amount: 100 },
    ],
    recipe: [
      '大米淘洗2-3遍至水清',
      '加入1:1.2比例的清水',
      '浸泡20分钟',
      '放入电饭锅按下煮饭键',
      '煮好后焖5分钟再开盖',
    ],
    cookingTime: 30,
    difficulty: 'easy',
    suitableFor: ['muscle', 'general'],
    mealTypes: ['lunch', 'dinner'],
  },
  {
    id: 'salmon-salad',
    name: '三文鱼沙拉',
    description: '高蛋白低碳水，富含Omega-3脂肪酸',
    ingredients: [
      { ingredient: getIngredient('salmon'), amount: 150 },
      { ingredient: getIngredient('cucumber'), amount: 100 },
      { ingredient: getIngredient('tomato'), amount: 100 },
    ],
    recipe: [
      '三文鱼用盐和黑胡椒腌制',
      '平底锅少油煎至两面金黄',
      '黄瓜、番茄切片铺底',
      '三文鱼切块摆放在蔬菜上',
      '淋上橄榄油和柠檬汁调味',
    ],
    cookingTime: 20,
    difficulty: 'easy',
    suitableFor: ['muscle', 'fatloss'],
    mealTypes: ['lunch', 'dinner'],
  },
  {
    id: 'tofu-vegetable-soup',
    name: '豆腐蔬菜汤',
    description: '清淡低卡，补充水分和营养',
    ingredients: [
      { ingredient: getIngredient('tofu'), amount: 150 },
      { ingredient: getIngredient('spinach'), amount: 100 },
      { ingredient: getIngredient('carrot'), amount: 50 },
    ],
    recipe: [
      '豆腐切小块，菠菜洗净，胡萝卜切丝',
      '锅中加水烧开，放入胡萝卜煮3分钟',
      '加入豆腐，煮5分钟',
      '最后放入菠菜，加盐调味',
      '滴几滴香油即可出锅',
    ],
    cookingTime: 15,
    difficulty: 'easy',
    suitableFor: ['fatloss', 'general'],
    mealTypes: ['dinner'],
  },
  {
    id: 'corn-salad',
    name: '玉米沙拉',
    description: '清新爽口，富含膳食纤维',
    ingredients: [
      { ingredient: getIngredient('corn'), amount: 150 },
      { ingredient: getIngredient('cucumber'), amount: 100 },
    ],
    recipe: [
      '玉米煮熟后剥粒',
      '黄瓜切丁',
      '将玉米粒和黄瓜丁混合',
      '加入少许盐和橄榄油',
      '拌匀即可食用',
    ],
    cookingTime: 20,
    difficulty: 'easy',
    suitableFor: ['fatloss', 'general'],
    mealTypes: ['lunch'],
  },
  {
    id: 'egg-fried-rice',
    name: '蛋炒饭',
    description: '经典主食，简单快手',
    ingredients: [
      { ingredient: getIngredient('rice'), amount: 200 },
      { ingredient: getIngredient('egg'), amount: 100 },
      { ingredient: getIngredient('carrot'), amount: 30 },
    ],
    recipe: [
      '米饭提前放凉，用手抓散',
      '鸡蛋打散，胡萝卜切丁',
      '热锅多油，炒蛋液至凝固划散',
      '加入米饭翻炒，让每粒米都裹上蛋液',
      '加入胡萝卜丁，盐调味炒匀',
    ],
    cookingTime: 15,
    difficulty: 'easy',
    suitableFor: ['muscle', 'general'],
    mealTypes: ['lunch', 'dinner'],
  },
  {
    id: 'milk-oats',
    name: '牛奶燕麦',
    description: '快手早餐，营养均衡',
    ingredients: [
      { ingredient: getIngredient('milk'), amount: 250 },
      { ingredient: getIngredient('oats'), amount: 50 },
    ],
    recipe: [
      '燕麦倒入碗中',
      '牛奶微波加热1分钟',
      '将热牛奶倒入燕麦中',
      '搅拌均匀静置2分钟',
      '可加入水果或坚果',
    ],
    cookingTime: 5,
    difficulty: 'easy',
    suitableFor: ['muscle', 'fatloss', 'general'],
    mealTypes: ['breakfast'],
  },
];

// Calculate nutrition from dish ingredients
export const calculateDishNutrition = (dish: Dish): NutritionInfo => {
  return dish.ingredients.reduce(
    (acc, { ingredient, amount }) => ({
      calories: acc.calories + (ingredient.caloriesPer100g * amount / 100),
      protein: acc.protein + (ingredient.proteinPer100g * amount / 100),
      carbs: acc.carbs + (ingredient.carbsPer100g * amount / 100),
      fat: acc.fat + (ingredient.fatPer100g * amount / 100),
      fiber: acc.fiber + 1.5,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
};

// Find dishes that use user's ingredients
export const findMatchingDishes = (
  userIngredients: Ingredient[],
  mode: DietaryMode,
  mealType: 'breakfast' | 'lunch' | 'dinner'
): Dish[] => {
  const userIngredientIds = new Set(userIngredients.map(i => i.id));
  
  return dishDatabase.filter(dish => {
    // Check if dish is suitable for the mode and meal type
    if (!dish.suitableFor.includes(mode)) return false;
    if (!dish.mealTypes.includes(mealType)) return false;
    
    // Check if user has at least one main ingredient
    const hasMainIngredient = dish.ingredients.some(({ ingredient }) => 
      userIngredientIds.has(ingredient.id)
    );
    
    return hasMainIngredient;
  });
};

// Generate a balanced meal with multiple dishes
export const generateMeal = (
  mode: DietaryMode,
  mealType: 'breakfast' | 'lunch' | 'dinner',
  userIngredients: Ingredient[],
  usedDishIds: Set<string> = new Set()
): Meal => {
  const matchingDishes = findMatchingDishes(userIngredients, mode, mealType)
    .filter(dish => !usedDishIds.has(dish.id));
  
  // If no matching dishes, get default dishes for this mode/type
  const availableDishes = matchingDishes.length > 0 
    ? matchingDishes 
    : dishDatabase.filter(d => 
        d.suitableFor.includes(mode) && 
        d.mealTypes.includes(mealType) &&
        !usedDishIds.has(d.id)
      );
  
  // Select dishes for the meal
  const selectedDishes: Dish[] = [];
  const shuffled = [...availableDishes].sort(() => Math.random() - 0.5);
  
  // Breakfast: 1-2 dishes
  // Lunch/Dinner: 2-3 dishes (main + side + optional soup/staple)
  const dishCount = mealType === 'breakfast' ? Math.min(2, shuffled.length) : Math.min(3, shuffled.length);
  
  for (let i = 0; i < dishCount && i < shuffled.length; i++) {
    selectedDishes.push(shuffled[i]);
  }
  
  // Calculate total nutrition
  const totalNutrition = selectedDishes.reduce(
    (acc, dish) => {
      const dishNutrition = calculateDishNutrition(dish);
      return {
        calories: acc.calories + dishNutrition.calories,
        protein: acc.protein + dishNutrition.protein,
        carbs: acc.carbs + dishNutrition.carbs,
        fat: acc.fat + dishNutrition.fat,
        fiber: acc.fiber + dishNutrition.fiber,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
  
  return {
    id: `${mode}-${mealType}-${Date.now()}`,
    type: mealType,
    dishes: selectedDishes,
    totalNutrition: {
      calories: Math.round(totalNutrition.calories),
      protein: Math.round(totalNutrition.protein),
      carbs: Math.round(totalNutrition.carbs),
      fat: Math.round(totalNutrition.fat),
      fiber: Math.round(totalNutrition.fiber),
    },
  };
};

// Generate balanced daily meals
export const generateDailyMeals = (
  mode: DietaryMode,
  userIngredients: Ingredient[]
): { breakfast: Meal; lunch: Meal; dinner: Meal } => {
  const usedDishIds = new Set<string>();
  
  const breakfast = generateMeal(mode, 'breakfast', userIngredients, usedDishIds);
  breakfast.dishes.forEach(d => usedDishIds.add(d.id));
  
  const lunch = generateMeal(mode, 'lunch', userIngredients, usedDishIds);
  lunch.dishes.forEach(d => usedDishIds.add(d.id));
  
  const dinner = generateMeal(mode, 'dinner', userIngredients, usedDishIds);
  
  return { breakfast, lunch, dinner };
};

// Generate grocery list from meals
export const generateGroceryList = (
  mode: DietaryMode,
  days: number = 7
): { ingredient: Ingredient; amount: number }[] => {
  const groceryMap = new Map<string, { ingredient: Ingredient; amount: number }>();
  
  // Get dishes suitable for this mode
  const suitableDishes = dishDatabase.filter(d => d.suitableFor.includes(mode));
  
  // Create a sample week of meals
  for (let day = 0; day < days; day++) {
    const shuffled = [...suitableDishes].sort(() => Math.random() - 0.5);
    const dailyDishes = shuffled.slice(0, 6); // 2 dishes per meal x 3 meals
    
    dailyDishes.forEach(dish => {
      dish.ingredients.forEach(({ ingredient, amount }) => {
        const existing = groceryMap.get(ingredient.id);
        if (existing) {
          existing.amount += amount;
        } else {
          groceryMap.set(ingredient.id, { ingredient, amount });
        }
      });
    });
  }
  
  return Array.from(groceryMap.values());
};
