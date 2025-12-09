-- Create profiles table to store user personal information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  height DECIMAL(5,1), -- in cm
  weight DECIMAL(5,1), -- in kg
  exercise_frequency TEXT CHECK (exercise_frequency IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  exercise_types TEXT[], -- array of exercise types
  taste_preferences TEXT[], -- 辣/甜/咸/清淡
  dietary_restrictions TEXT[], -- 素食/清真/过敏原
  cooking_preferences TEXT[], -- 炒/蒸/煮/烤
  liked_ingredients TEXT[], -- 喜欢吃的食材
  disliked_ingredients TEXT[], -- 不吃的食材
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create weekly meal plans table
CREATE TABLE public.weekly_meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('muscle', 'fatloss', 'general')),
  plan_data JSONB NOT NULL,
  ingredients_used JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.weekly_meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meal plans" 
ON public.weekly_meal_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal plans" 
ON public.weekly_meal_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans" 
ON public.weekly_meal_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create diet records table for tracking
CREATE TABLE public.diet_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('muscle', 'fatloss', 'general')),
  planned_nutrition JSONB NOT NULL,
  actual_nutrition JSONB NOT NULL,
  adoption_rate DECIMAL(5,2) DEFAULT 0, -- 0-100
  category_breakdown JSONB,
  recommendations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.diet_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own diet records" 
ON public.diet_records 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diet records" 
ON public.diet_records 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diet records" 
ON public.diet_records 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger for updating profiles updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();