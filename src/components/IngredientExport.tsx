import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Ingredient, DietaryMode } from '@/types/meal';
import { Download, Share2, Flame, Dumbbell, Wheat, Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IngredientExportProps {
  ingredients: Ingredient[];
  mode: DietaryMode;
}

export const IngredientExport = ({ ingredients, mode }: IngredientExportProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getModeLabel = () => {
    switch (mode) {
      case 'muscle': return '💪 增肌模式';
      case 'fatloss': return '🔥 减脂模式';
      default: return '⚖️ 均衡模式';
    }
  };

  const getModeGradient = () => {
    switch (mode) {
      case 'muscle': return 'from-blue-500/20 via-blue-400/10 to-indigo-500/20';
      case 'fatloss': return 'from-rose-500/20 via-pink-400/10 to-orange-500/20';
      default: return 'from-emerald-500/20 via-green-400/10 to-teal-500/20';
    }
  };

  const groupedIngredients = ingredients.reduce((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = [];
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  // Calculate total nutrition
  const totalNutrition = ingredients.reduce(
    (acc, ing) => ({
      calories: acc.calories + ing.caloriesPer100g,
      protein: acc.protein + ing.proteinPer100g,
      carbs: acc.carbs + ing.carbsPer100g,
      fat: acc.fat + ing.fatPer100g,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '肉类': return '🥩';
      case '海鲜': return '🦐';
      case '蔬菜': return '🥬';
      case '水果': return '🍎';
      case '主食': return '🍚';
      case '蛋奶': return '🥛';
      case '豆制品': return '🫘';
      case '调味料': return '🧂';
      default: return '🍽️';
    }
  };

  const handleExport = async () => {
    const textContent = `
🛒 本周采购清单
━━━━━━━━━━━━━━━━━━━━
${getModeLabel()}
共 ${ingredients.length} 种食材

📊 营养概览（每100g均值）
• 热量: ${Math.round(totalNutrition.calories / ingredients.length)} 千卡
• 蛋白质: ${Math.round(totalNutrition.protein / ingredients.length)}g
• 碳水: ${Math.round(totalNutrition.carbs / ingredients.length)}g
• 脂肪: ${Math.round(totalNutrition.fat / ingredients.length)}g

${Object.entries(groupedIngredients).map(([category, items]) => 
  `${getCategoryIcon(category)} 【${category}】（${items.length}种）\n${items.map(i => `   ${i.emoji} ${i.name}`).join('\n')}`
).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━
🍽️ 营养膳食规划APP
参考标准：中国居民膳食指南（2022）
    `.trim();

    try {
      await navigator.clipboard.writeText(textContent);
      toast({
        title: '✅ 已复制到剪贴板',
        description: '您可以粘贴到微信或其他应用分享',
      });
    } catch {
      toast({
        variant: 'destructive',
        title: '复制失败',
        description: '请手动复制内容',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="w-4 h-4" />
          导出清单
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            导出食材清单
          </DialogTitle>
        </DialogHeader>
        
        <div ref={cardRef} className="p-1">
          <Card className={`bg-gradient-to-br ${getModeGradient()} border-none overflow-hidden`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  🛒 本周采购清单
                </CardTitle>
                <span className="text-sm font-medium px-2 py-1 bg-background/50 rounded-full">
                  {getModeLabel()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                共 <span className="font-semibold text-foreground">{ingredients.length}</span> 种食材
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Nutrition Summary */}
              <div className="p-3 bg-background/60 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">📊 营养概览（每100g均值）</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <Flame className="w-4 h-4 mx-auto text-orange-500 mb-1" />
                    <p className="text-xs font-semibold">{Math.round(totalNutrition.calories / ingredients.length)}</p>
                    <p className="text-[10px] text-muted-foreground">千卡</p>
                  </div>
                  <div className="text-center">
                    <Dumbbell className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                    <p className="text-xs font-semibold">{Math.round(totalNutrition.protein / ingredients.length)}g</p>
                    <p className="text-[10px] text-muted-foreground">蛋白质</p>
                  </div>
                  <div className="text-center">
                    <Wheat className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                    <p className="text-xs font-semibold">{Math.round(totalNutrition.carbs / ingredients.length)}g</p>
                    <p className="text-[10px] text-muted-foreground">碳水</p>
                  </div>
                  <div className="text-center">
                    <Droplets className="w-4 h-4 mx-auto text-purple-500 mb-1" />
                    <p className="text-xs font-semibold">{Math.round(totalNutrition.fat / ingredients.length)}g</p>
                    <p className="text-[10px] text-muted-foreground">脂肪</p>
                  </div>
                </div>
              </div>

              {/* Ingredients by Category */}
              {Object.entries(groupedIngredients).map(([category, items]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                    <span>{getCategoryIcon(category)}</span>
                    <span>{category}</span>
                    <span className="text-xs text-muted-foreground">({items.length}种)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map(item => (
                      <span 
                        key={item.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-background/70 rounded-full text-xs"
                      >
                        {item.emoji} {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="pt-3 border-t border-border/50 text-center">
                <p className="text-[10px] text-muted-foreground">
                  🍽️ 营养膳食规划APP · 参考：中国居民膳食指南（2022）
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 mt-4">
          <Button className="flex-1 gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            复制文本分享
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};