import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DietAnalysisCard } from '@/components/DietAnalysisCard';
import { Header } from '@/components/Header';
import { Calendar, Target, Utensils, ArrowLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { NutritionInfo } from '@/types/meal';

interface DietRecord {
  id: string;
  week_start_date: string;
  mode: string;
  planned_nutrition: NutritionInfo;
  actual_nutrition: NutritionInfo;
  adoption_rate: number;
  recommendations: string[];
}

const DietTracking = () => {
  const navigate = useNavigate();
  const { weeklyMealPlan, dietRecords } = useMealPlan();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedRecords, setSavedRecords] = useState<DietRecord[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      } else {
        // Fetch diet records from database
        fetchDietRecords(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchDietRecords = async (userId: string) => {
    const { data, error } = await supabase
      .from('diet_records')
      .select('*')
      .eq('user_id', userId)
      .order('week_start_date', { ascending: false })
      .limit(8);

    if (!error && data) {
      // Transform the data to match our interface
      const transformedRecords: DietRecord[] = data.map(record => ({
        id: record.id,
        week_start_date: record.week_start_date,
        mode: record.mode,
        planned_nutrition: record.planned_nutrition as unknown as NutritionInfo,
        actual_nutrition: record.actual_nutrition as unknown as NutritionInfo,
        adoption_rate: record.adoption_rate ?? 0,
        recommendations: record.recommendations ?? [],
      }));
      setSavedRecords(transformedRecords);
    }
    setLoading(false);
  };

  const calculateAdoptionRate = () => {
    if (!weeklyMealPlan) return 0;
    const adoptedDays = weeklyMealPlan.days.filter(d => d.adopted).length;
    return Math.round((adoptedDays / 7) * 100);
  };

  const getTrendIcon = (trend: 'increasing' | 'stable' | 'decreasing') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case 'muscle': return '增肌模式';
      case 'fatloss': return '减脂模式';
      default: return '均衡模式';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/recipes')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回食谱
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">饮食跟踪与分析</h1>
          <p className="text-muted-foreground">追踪您的饮食情况，获取个性化建议</p>
        </div>

        {/* Current Week Overview */}
        {weeklyMealPlan && (
          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                本周饮食概览
              </CardTitle>
              <CardDescription>
                {weeklyMealPlan.weekStartDate} 开始的一周
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-secondary/30 rounded-xl">
                  <div className="text-2xl font-bold text-primary">{calculateAdoptionRate()}%</div>
                  <div className="text-sm text-muted-foreground">采纳率</div>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-xl">
                  <div className="text-2xl font-bold text-[hsl(var(--protein))]">
                    {Math.round(weeklyMealPlan.totalNutrition.protein)}g
                  </div>
                  <div className="text-sm text-muted-foreground">总蛋白质</div>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-xl">
                  <div className="text-2xl font-bold text-[hsl(var(--carbs))]">
                    {Math.round(weeklyMealPlan.totalNutrition.carbs)}g
                  </div>
                  <div className="text-sm text-muted-foreground">总碳水</div>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-xl">
                  <div className="text-2xl font-bold text-accent">
                    {Math.round(weeklyMealPlan.totalNutrition.calories)}
                  </div>
                  <div className="text-sm text-muted-foreground">总热量</div>
                </div>
              </div>

              {/* Daily adoption status */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-foreground mb-2">每日采纳情况</div>
                <div className="flex gap-2">
                  {weeklyMealPlan.days.map((day, index) => (
                    <div
                      key={index}
                      className={`flex-1 p-2 rounded-lg text-center text-sm ${
                        day.adopted 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {day.dayName.slice(1)}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diet Analysis */}
        <DietAnalysisCard />

        {/* Historical Records */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              历史记录
            </CardTitle>
            <CardDescription>过去几周的饮食情况</CardDescription>
          </CardHeader>
          <CardContent>
            {savedRecords.length > 0 ? (
              <div className="space-y-4">
                {savedRecords.map((record) => (
                  <div 
                    key={record.id}
                    className="p-4 border border-border rounded-xl hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{record.week_start_date}</div>
                        <Badge variant="outline" className="mt-1">
                          {getModeLabel(record.mode)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {record.adoption_rate}%
                        </div>
                        <div className="text-sm text-muted-foreground">采纳率</div>
                      </div>
                    </div>
                    <Progress value={record.adoption_rate} className="h-2" />
                    
                    {record.recommendations && record.recommendations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                          {record.recommendations[0]}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Utensils className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无历史记录</p>
                <p className="text-sm">完成一周的饮食计划后，这里会显示您的记录</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="glass-card mt-6">
          <CardHeader>
            <CardTitle>下周建议</CardTitle>
            <CardDescription>基于您的饮食情况，我们为您准备了以下建议</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dietRecords.length > 0 ? (
                dietRecords[dietRecords.length - 1].recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm text-foreground">{rec}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <p>完成本周饮食计划后，将获得个性化建议</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DietTracking;
