import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { WeeklyMealPlan, DietaryMode, NutritionInfo } from '@/types/meal';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export const useMealPlanStorage = () => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const saveMealPlan = async (plan: WeeklyMealPlan): Promise<boolean> => {
    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: 'destructive',
          title: '请先登录',
          description: '保存食谱需要登录账户',
        });
        return false;
      }

      // Check if plan for this week already exists
      const { data: existingPlan } = await supabase
        .from('weekly_meal_plans')
        .select('id')
        .eq('user_id', user.id)
        .eq('week_start_date', plan.weekStartDate)
        .maybeSingle();

      const planData = {
        user_id: user.id,
        week_start_date: plan.weekStartDate,
        mode: plan.mode,
        plan_data: JSON.parse(JSON.stringify(plan)) as Json,
        ingredients_used: JSON.parse(JSON.stringify(plan.ingredientsUsed)) as Json,
      };

      let error;
      if (existingPlan) {
        const result = await supabase
          .from('weekly_meal_plans')
          .update(planData)
          .eq('id', existingPlan.id);
        error = result.error;
      } else {
        const result = await supabase
          .from('weekly_meal_plans')
          .insert([planData]);
        error = result.error;
      }

      if (error) {
        throw error;
      }

      toast({
        title: '保存成功',
        description: '您的周食谱已保存到云端',
      });
      
      return true;
    } catch (err) {
      toast({
        variant: 'destructive',
        title: '保存失败',
        description: err instanceof Error ? err.message : '请稍后重试',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveDietRecord = async (
    weekStartDate: string,
    mode: DietaryMode,
    plannedNutrition: NutritionInfo,
    actualNutrition: NutritionInfo,
    adoptionRate: number,
    categoryBreakdown: { category: string; plannedAmount: number; actualAmount: number }[],
    recommendations: string[]
  ): Promise<boolean> => {
    setSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: 'destructive',
          title: '请先登录',
        });
        return false;
      }

      // Check if record exists
      const { data: existingRecord } = await supabase
        .from('diet_records')
        .select('id')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartDate)
        .maybeSingle();

      const recordData = {
        user_id: user.id,
        week_start_date: weekStartDate,
        mode,
        planned_nutrition: JSON.parse(JSON.stringify(plannedNutrition)) as Json,
        actual_nutrition: JSON.parse(JSON.stringify(actualNutrition)) as Json,
        adoption_rate: adoptionRate,
        category_breakdown: JSON.parse(JSON.stringify(categoryBreakdown)) as Json,
        recommendations,
      };

      let error;
      if (existingRecord) {
        const result = await supabase
          .from('diet_records')
          .update(recordData)
          .eq('id', existingRecord.id);
        error = result.error;
      } else {
        const result = await supabase
          .from('diet_records')
          .insert([recordData]);
        error = result.error;
      }

      if (error) {
        throw error;
      }

      return true;
    } catch (err) {
      toast({
        variant: 'destructive',
        title: '保存饮食记录失败',
        description: err instanceof Error ? err.message : '请稍后重试',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const loadMealPlan = async (weekStartDate: string): Promise<WeeklyMealPlan | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from('weekly_meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartDate)
        .maybeSingle();

      if (error || !data) return null;

      return data.plan_data as unknown as WeeklyMealPlan;
    } catch {
      return null;
    }
  };

  return {
    saving,
    saveMealPlan,
    saveDietRecord,
    loadMealPlan,
  };
};
