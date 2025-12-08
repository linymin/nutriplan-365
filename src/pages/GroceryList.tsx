import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { Header } from '@/components/Header';
import { WeeklyGroceryList } from '@/components/WeeklyGroceryList';
import { generateGroceryList, nutritionTargets } from '@/data/meals';
import { DietaryMode } from '@/types/meal';
import { ShoppingCart, ArrowLeft, Bell, Dumbbell, Flame, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const modeConfig = {
  muscle: {
    name: '增肌模式',
    description: '高蛋白、高碳水',
    icon: Dumbbell,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  fatloss: {
    name: '减脂模式',
    description: '低热量、高蛋白',
    icon: Flame,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
  general: {
    name: '均衡模式',
    description: '营养均衡',
    icon: Scale,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
};

const GroceryList = () => {
  const navigate = useNavigate();
  const { mode: contextMode, pushDay, setPushDay, pushTime, setPushTime } = useMealPlan();
  const [selectedMode, setSelectedMode] = useState<DietaryMode>(contextMode || 'general');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Generate grocery list based on selected mode
  const groceryList = useMemo(() => {
    const items = generateGroceryList(selectedMode, 7);
    return items.map(item => ({
      ...item,
      checked: false,
    }));
  }, [selectedMode]);

  const handleSaveSettings = () => {
    setIsSettingsOpen(false);
    toast({
      title: '推送设置已保存',
      description: `每${dayNames[pushDay]} ${pushTime} 将推送采购清单`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <section className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <ShoppingCart className="w-4 h-4" />
            本周采购清单
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            为您定制的<span className="text-primary">一周采购</span>清单
          </h1>
          <p className="text-muted-foreground">
            根据饮食模式智能计算，满足一周所需营养
          </p>
        </section>

        {/* Mode Selection */}
        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">选择饮食模式生成采购清单</h3>
          <div className="grid grid-cols-3 gap-4">
            {(Object.keys(modeConfig) as DietaryMode[]).map((modeKey) => {
              const config = modeConfig[modeKey];
              const Icon = config.icon;
              const isSelected = selectedMode === modeKey;
              
              return (
                <button
                  key={modeKey}
                  onClick={() => setSelectedMode(modeKey)}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all text-left',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/30'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', config.bgColor)}>
                    <Icon className={cn('w-5 h-5', config.color)} />
                  </div>
                  <p className="font-medium text-sm">{config.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate('/recipes')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回食谱
          </Button>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Bell className="w-4 h-4" />
                推送设置
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>采购清单推送设置</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">
                  设置每周推送采购清单的时间，我们将根据您的饮食模式为您推荐本周所需食材
                </p>
                <div className="space-y-2">
                  <Label>推送日期</Label>
                  <Select value={pushDay.toString()} onValueChange={(v) => setPushDay(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dayNames.map((name, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>推送时间</Label>
                  <Input
                    type="time"
                    value={pushTime}
                    onChange={(e) => setPushTime(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveSettings} className="w-full">
                  保存设置
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grocery Info */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-lg">🛒</span>
              </div>
              <div>
                <p className="font-medium">{modeConfig[selectedMode].name}采购清单</p>
                <p className="text-sm text-muted-foreground">共 {groceryList.length} 种食材</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">下次推送</p>
              <p className="text-sm font-medium">{dayNames[pushDay]} {pushTime}</p>
            </div>
          </div>
        </div>

        {/* Grocery List */}
        <WeeklyGroceryList items={groceryList} />

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            参考标准：《中国居民膳食指南（2022）》
          </p>
        </footer>
      </main>
    </div>
  );
};

export default GroceryList;
