import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  height: number | null;
  weight: number | null;
  exerciseFrequency: string | null;
  exerciseTypes: string[];
  tastePreferences: string[];
  dietaryRestrictions: string[];
  cookingPreferences: string[];
  likedIngredients: string[];
  dislikedIngredients: string[];
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setProfile({
            height: data.height,
            weight: data.weight,
            exerciseFrequency: data.exercise_frequency,
            exerciseTypes: data.exercise_types || [],
            tastePreferences: data.taste_preferences || [],
            dietaryRestrictions: data.dietary_restrictions || [],
            cookingPreferences: data.cooking_preferences || [],
            likedIngredients: data.liked_ingredients || [],
            dislikedIngredients: data.disliked_ingredients || [],
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取用户信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
