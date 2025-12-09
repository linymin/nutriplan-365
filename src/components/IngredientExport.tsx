import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Ingredient, DietaryMode } from '@/types/meal';
import { Download, Share2, Image } from 'lucide-react';
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

  const getModeColor = () => {
    switch (mode) {
      case 'muscle': return 'from-blue-500/20 to-blue-600/10';
      case 'fatloss': return 'from-pink-500/20 to-pink-600/10';
      default: return 'from-emerald-500/20 to-emerald-600/10';
    }
  };

  const groupedIngredients = ingredients.reduce((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = [];
    acc[ing.category].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const handleExport = async () => {
    // For now, we'll copy to clipboard as text
    const textContent = `
🛒 本周采购清单 - ${getModeLabel()}
共${ingredients.length}种食材

${Object.entries(groupedIngredients).map(([category, items]) => 
  `【${category}】\n${items.map(i => `  ${i.emoji} ${i.name}`).join('\n')}`
).join('\n\n')}

由营养膳食规划APP生成
    `.trim();

    try {
      await navigator.clipboard.writeText(textContent);
      toast({
        title: '已复制到剪贴板',
        description: '您可以粘贴分享给他人',
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>导出食材清单</DialogTitle>
        </DialogHeader>
        
        <div ref={cardRef} className="p-1">
          <Card className={`bg-gradient-to-br ${getModeColor()} border-none overflow-hidden`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">🛒 本周采购清单</CardTitle>
                <span className="text-sm font-medium">{getModeLabel()}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                共{ingredients.length}种食材
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(groupedIngredients).map(([category, items]) => (
                <div key={category}>
                  <div className="text-sm font-medium text-foreground mb-2">
                    {category}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map(item => (
                      <span 
                        key={item.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-background/50 rounded-full text-xs"
                      >
                        {item.emoji} {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="pt-3 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground">
                  营养膳食规划APP
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 mt-4">
          <Button className="flex-1 gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            复制文本
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
