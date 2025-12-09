import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type Step = 'basic' | 'exercise' | 'taste' | 'ingredients';

interface ProfileData {
  height: string;
  weight: string;
  exerciseFrequency: string;
  exerciseTypes: string[];
  tastePreferences: string[];
  dietaryRestrictions: string[];
  cookingPreferences: string[];
  likedIngredients: string[];
  dislikedIngredients: string[];
}

const exerciseFrequencyOptions = [
  { value: 'sedentary', label: '久坐不动', desc: '几乎不运动' },
  { value: 'light', label: '偶尔运动', desc: '每周1-2次' },
  { value: 'moderate', label: '适度运动', desc: '每周3-4次' },
  { value: 'active', label: '经常运动', desc: '每周5-6次' },
  { value: 'very_active', label: '每天运动', desc: '每天都运动' },
];

const exerciseTypeOptions = [
  { value: 'strength', label: '💪 力量训练', desc: '举重、健身' },
  { value: 'cardio', label: '🏃 有氧运动', desc: '跑步、游泳' },
  { value: 'hiit', label: '⚡ HIIT', desc: '高强度间歇' },
  { value: 'yoga', label: '🧘 瑜伽普拉提', desc: '柔韧拉伸' },
  { value: 'sports', label: '⚽ 球类运动', desc: '篮球、羽毛球' },
  { value: 'none', label: '🚫 不运动', desc: '' },
];

const tasteOptions = [
  { value: 'spicy', label: '🌶️ 喜辣' },
  { value: 'sweet', label: '🍯 喜甜' },
  { value: 'salty', label: '🧂 喜咸' },
  { value: 'sour', label: '🍋 喜酸' },
  { value: 'light', label: '🥬 清淡' },
  { value: 'heavy', label: '🍖 重口' },
];

const dietaryRestrictionOptions = [
  { value: 'vegetarian', label: '🥗 素食' },
  { value: 'vegan', label: '🌱 纯素' },
  { value: 'halal', label: '☪️ 清真' },
  { value: 'no_beef', label: '🐄 不吃牛肉' },
  { value: 'no_pork', label: '🐷 不吃猪肉' },
  { value: 'lactose_free', label: '🥛 乳糖不耐' },
  { value: 'gluten_free', label: '🌾 无麸质' },
  { value: 'seafood_allergy', label: '🦐 海鲜过敏' },
  { value: 'nut_allergy', label: '🥜 坚果过敏' },
];

const cookingOptions = [
  { value: 'stir_fry', label: '🍳 炒' },
  { value: 'steam', label: '💨 蒸' },
  { value: 'boil', label: '🥣 煮' },
  { value: 'roast', label: '🔥 烤' },
  { value: 'cold', label: '🥒 凉拌' },
  { value: 'deep_fry', label: '🍤 炸' },
  { value: 'braise', label: '🥘 焖炖' },
];

const commonIngredients = {
  liked: [
    { value: 'chicken', label: '🍗 鸡肉' },
    { value: 'pork', label: '🥩 猪肉' },
    { value: 'beef', label: '🥩 牛肉' },
    { value: 'fish', label: '🐟 鱼肉' },
    { value: 'shrimp', label: '🦐 虾' },
    { value: 'eggs', label: '🥚 鸡蛋' },
    { value: 'tofu', label: '🧈 豆腐' },
    { value: 'broccoli', label: '🥦 西兰花' },
    { value: 'tomato', label: '🍅 番茄' },
    { value: 'potato', label: '🥔 土豆' },
    { value: 'rice', label: '🍚 米饭' },
    { value: 'noodles', label: '🍜 面条' },
  ],
  disliked: [
    { value: 'cilantro', label: '🌿 香菜' },
    { value: 'celery', label: '🥬 芹菜' },
    { value: 'bitter_melon', label: '🥒 苦瓜' },
    { value: 'eggplant', label: '🍆 茄子' },
    { value: 'mushroom', label: '🍄 蘑菇' },
    { value: 'onion', label: '🧅 洋葱' },
    { value: 'garlic', label: '🧄 大蒜' },
    { value: 'ginger', label: '🫚 姜' },
    { value: 'liver', label: '🫀 肝脏' },
    { value: 'blood_tofu', label: '🩸 血豆腐' },
  ],
};

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<Step>('basic');
  const [profileData, setProfileData] = useState<ProfileData>({
    height: '',
    weight: '',
    exerciseFrequency: '',
    exerciseTypes: [],
    tastePreferences: [],
    dietaryRestrictions: [],
    cookingPreferences: [],
    likedIngredients: [],
    dislikedIngredients: [],
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
      
      // Check if profile already complete
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            if (data?.height && data?.weight) {
              // Profile already set up, go to mode selection
              navigate('/mode');
            }
          });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const toggleArrayItem = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(value)
          ? arr.filter(v => v !== value)
          : [...arr, value],
      };
    });
  };

  const handleSave = async () => {
    if (!user) return;

    if (!profileData.height || !profileData.weight) {
      toast({
        variant: 'destructive',
        title: '请填写完整',
        description: '身高和体重是必填项',
      });
      setStep('basic');
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        height: parseFloat(profileData.height),
        weight: parseFloat(profileData.weight),
        exercise_frequency: profileData.exerciseFrequency || null,
        exercise_types: profileData.exerciseTypes,
        taste_preferences: profileData.tastePreferences,
        dietary_restrictions: profileData.dietaryRestrictions,
        cooking_preferences: profileData.cookingPreferences,
        liked_ingredients: profileData.likedIngredients,
        disliked_ingredients: profileData.dislikedIngredients,
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: '保存失败',
        description: error.message,
      });
    } else {
      toast({
        title: '保存成功',
        description: '您的个人信息已保存',
      });
      navigate('/mode');
    }
    setSaving(false);
  };

  const steps: Step[] = ['basic', 'exercise', 'taste', 'ingredients'];
  const currentStepIndex = steps.indexOf(step);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1]);
    } else {
      handleSave();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
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
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">完善您的信息</h1>
          <p className="text-muted-foreground">这将帮助我们为您提供更精准的膳食推荐</p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all ${
                i <= currentStepIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>
              {step === 'basic' && '基本信息'}
              {step === 'exercise' && '运动习惯'}
              {step === 'taste' && '饮食偏好'}
              {step === 'ingredients' && '食材喜好'}
            </CardTitle>
            <CardDescription>
              {step === 'basic' && '填写您的身高体重'}
              {step === 'exercise' && '选择您的运动频率和类型'}
              {step === 'taste' && '选择您的口味偏好和饮食禁忌'}
              {step === 'ingredients' && '选择您喜欢和不喜欢的食材'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 'basic' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">身高 (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={profileData.height}
                    onChange={(e) => setProfileData(prev => ({ ...prev, height: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">体重 (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="65"
                    value={profileData.weight}
                    onChange={(e) => setProfileData(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {step === 'exercise' && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">运动频率</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {exerciseFrequencyOptions.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setProfileData(prev => ({ ...prev, exerciseFrequency: opt.value }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          profileData.exerciseFrequency === opt.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-sm text-muted-foreground">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">运动类型 (可多选)</Label>
                  <div className="flex flex-wrap gap-2">
                    {exerciseTypeOptions.map(opt => (
                      <Badge
                        key={opt.value}
                        variant={profileData.exerciseTypes.includes(opt.value) ? 'default' : 'outline'}
                        className="cursor-pointer text-sm py-2 px-3"
                        onClick={() => toggleArrayItem('exerciseTypes', opt.value)}
                      >
                        {opt.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 'taste' && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">口味偏好 (可多选)</Label>
                  <div className="flex flex-wrap gap-2">
                    {tasteOptions.map(opt => (
                      <Badge
                        key={opt.value}
                        variant={profileData.tastePreferences.includes(opt.value) ? 'default' : 'outline'}
                        className="cursor-pointer text-sm py-2 px-3"
                        onClick={() => toggleArrayItem('tastePreferences', opt.value)}
                      >
                        {opt.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">饮食禁忌 (可多选)</Label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryRestrictionOptions.map(opt => (
                      <Badge
                        key={opt.value}
                        variant={profileData.dietaryRestrictions.includes(opt.value) ? 'default' : 'outline'}
                        className="cursor-pointer text-sm py-2 px-3"
                        onClick={() => toggleArrayItem('dietaryRestrictions', opt.value)}
                      >
                        {opt.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">喜欢的烹饪方式 (可多选)</Label>
                  <div className="flex flex-wrap gap-2">
                    {cookingOptions.map(opt => (
                      <Badge
                        key={opt.value}
                        variant={profileData.cookingPreferences.includes(opt.value) ? 'default' : 'outline'}
                        className="cursor-pointer text-sm py-2 px-3"
                        onClick={() => toggleArrayItem('cookingPreferences', opt.value)}
                      >
                        {opt.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 'ingredients' && (
              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">喜欢吃的食材 (可多选)</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonIngredients.liked.map(opt => (
                      <Badge
                        key={opt.value}
                        variant={profileData.likedIngredients.includes(opt.value) ? 'default' : 'outline'}
                        className="cursor-pointer text-sm py-2 px-3"
                        onClick={() => toggleArrayItem('likedIngredients', opt.value)}
                      >
                        {opt.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">不喜欢吃的食材 (可多选)</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonIngredients.disliked.map(opt => (
                      <Badge
                        key={opt.value}
                        variant={profileData.dislikedIngredients.includes(opt.value) ? 'destructive' : 'outline'}
                        className="cursor-pointer text-sm py-2 px-3"
                        onClick={() => toggleArrayItem('dislikedIngredients', opt.value)}
                      >
                        {opt.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                上一步
              </Button>
              <Button onClick={nextStep} disabled={saving}>
                {currentStepIndex === steps.length - 1 ? (
                  saving ? '保存中...' : '完成设置'
                ) : (
                  <>
                    下一步
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
