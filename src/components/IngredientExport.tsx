import { useRef, useState, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Ingredient, DietaryMode } from '@/types/meal';
import { Download, Share2, Flame, Dumbbell, Wheat, Droplets, Image, Copy, Loader2, ShoppingCart, Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { calculateWeeklyPurchaseAmount } from '@/utils/ingredientRecommendation';

interface IngredientExportProps {
  ingredients: Ingredient[];
  mode: DietaryMode;
}

interface IngredientWithAmount extends Ingredient {
  weeklyAmount: number;
  weeklyUnit: string;
}

export const IngredientExport = ({ ingredients, mode }: IngredientExportProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const [isExporting, setIsExporting] = useState(false);

  // Calculate weekly amounts for each ingredient
  const ingredientsWithAmounts = useMemo((): IngredientWithAmount[] => {
    return ingredients.map(ing => {
      const { amount, unit } = calculateWeeklyPurchaseAmount(ing, mode, profile, ingredients.length);
      return {
        ...ing,
        weeklyAmount: amount,
        weeklyUnit: unit,
      };
    });
  }, [ingredients, mode, profile]);

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

  const getModeColor = () => {
    switch (mode) {
      case 'muscle': return '#3b82f6';
      case 'fatloss': return '#f43f5e';
      default: return '#10b981';
    }
  };

  const groupedIngredients = ingredientsWithAmounts.reduce((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = [];
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, IngredientWithAmount[]>);

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

  // Format amount display
  const formatAmount = (amount: number, unit: string) => {
    if (unit === '个') return `${amount}个`;
    if (unit === '毫升') return amount >= 1000 ? `${(amount / 1000).toFixed(1)}L` : `${amount}ml`;
    return amount >= 1000 ? `${(amount / 1000).toFixed(1)}kg` : `${amount}g`;
  };

  const handleExportImage = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `采购清单_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          
          toast({
            title: '✅ 图片已保存',
            description: '采购清单图片已下载到您的设备',
          });
        }
      }, 'image/png');
    } catch (error) {
      console.error('Export error:', error);
      toast({
        variant: 'destructive',
        title: '导出失败',
        description: '请重试或使用文本复制功能',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = async () => {
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
  `${getCategoryIcon(category)} 【${category}】（${items.length}种）\n${items.map(i => `   ${i.emoji} ${i.name} - ${formatAmount(i.weeklyAmount, i.weeklyUnit)}`).join('\n')}`
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

  const currentDate = new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <ShoppingCart className="w-4 h-4" />
          导出清单
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            导出采购清单
          </DialogTitle>
        </DialogHeader>
        
        <div ref={cardRef} className="p-1">
          <Card 
            className={`bg-gradient-to-br ${getModeGradient()} border-2 overflow-hidden`}
            style={{ borderColor: getModeColor() + '40' }}
          >
            <CardHeader className="pb-3 relative">
              <div 
                className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
                style={{ backgroundColor: getModeColor() }}
              />
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  🛒 本周采购清单
                </CardTitle>
                <span 
                  className="text-sm font-medium px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: getModeColor() }}
                >
                  {getModeLabel()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5" />
                  共 <span className="font-semibold text-foreground">{ingredients.length}</span> 种食材（含建议购买量）
                </span>
                <span className="text-xs">{currentDate}</span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Nutrition Summary */}
              <div className="p-3 bg-background/80 rounded-xl shadow-sm">
                <p className="text-xs text-muted-foreground mb-3 font-medium">📊 营养概览（每100g均值）</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-orange-500/10 rounded-lg">
                    <Flame className="w-5 h-5 mx-auto text-orange-500 mb-1" />
                    <p className="text-sm font-bold text-orange-600">{Math.round(totalNutrition.calories / ingredients.length)}</p>
                    <p className="text-[10px] text-muted-foreground">千卡</p>
                  </div>
                  <div className="text-center p-2 bg-blue-500/10 rounded-lg">
                    <Dumbbell className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                    <p className="text-sm font-bold text-blue-600">{Math.round(totalNutrition.protein / ingredients.length)}g</p>
                    <p className="text-[10px] text-muted-foreground">蛋白质</p>
                  </div>
                  <div className="text-center p-2 bg-amber-500/10 rounded-lg">
                    <Wheat className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                    <p className="text-sm font-bold text-amber-600">{Math.round(totalNutrition.carbs / ingredients.length)}g</p>
                    <p className="text-[10px] text-muted-foreground">碳水</p>
                  </div>
                  <div className="text-center p-2 bg-purple-500/10 rounded-lg">
                    <Droplets className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                    <p className="text-sm font-bold text-purple-600">{Math.round(totalNutrition.fat / ingredients.length)}g</p>
                    <p className="text-[10px] text-muted-foreground">脂肪</p>
                  </div>
                </div>
              </div>

              {/* Ingredients by Category with amounts */}
              <div className="space-y-3">
                {Object.entries(groupedIngredients).map(([category, items]) => (
                  <div key={category} className="bg-background/60 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                      <span className="text-base">{getCategoryIcon(category)}</span>
                      <span>{category}</span>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: getModeColor() + '80' }}
                      >
                        {items.length}种
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {items.map(item => (
                        <div 
                          key={item.id}
                          className="flex items-center justify-between px-2.5 py-1.5 bg-background rounded-lg text-xs border border-border/50"
                        >
                          <span className="flex items-center gap-1.5 font-medium">
                            {item.emoji} {item.name}
                          </span>
                          <span 
                            className="font-bold px-2 py-0.5 rounded"
                            style={{ 
                              backgroundColor: getModeColor() + '15',
                              color: getModeColor()
                            }}
                          >
                            {formatAmount(item.weeklyAmount, item.weeklyUnit)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">
                    🍽️ 营养膳食规划APP
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    参考：中国居民膳食指南（2022）
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 mt-4">
          <Button 
            className="flex-1 gap-2" 
            onClick={handleExportImage}
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Image className="w-4 h-4" />
            )}
            {isExporting ? '导出中...' : '保存图片'}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 gap-2" 
            onClick={handleCopyText}
          >
            <Copy className="w-4 h-4" />
            复制文本
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
