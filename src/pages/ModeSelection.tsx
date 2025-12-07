import { useNavigate } from 'react-router-dom';
import { DietaryMode } from '@/types/meal';
import { useMealPlan } from '@/contexts/MealPlanContext';
import { Header } from '@/components/Header';
import { Sparkles, Dumbbell, Scale, Heart, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const modes: { mode: DietaryMode; label: string; description: string; icon: React.ReactNode; color: string }[] = [
  {
    mode: 'muscle',
    label: '增肌模式',
    description: '高蛋白高碳水，促进肌肉生长',
    icon: <Dumbbell className="w-8 h-8" />,
    color: 'from-orange-500 to-red-500',
  },
  {
    mode: 'fatloss',
    label: '减脂模式',
    description: '低热量高纤维，健康减重',
    icon: <Scale className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
  },
  {
    mode: 'general',
    label: '均衡模式',
    description: '营养均衡，维持健康体态',
    icon: <Heart className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500',
  },
];

const ModeSelection = () => {
  const navigate = useNavigate();
  const { mode: selectedMode, setMode } = useMealPlan();

  const handleModeSelect = (mode: DietaryMode) => {
    setMode(mode);
  };

  const handleContinue = () => {
    if (selectedMode) {
      navigate('/ingredients');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            第一步：选择饮食模式
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            选择您的<span className="text-primary">饮食目标</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            根据您的健身目标，我们将为您定制专属的膳食计划和营养配比
          </p>
        </section>

        {/* Mode Cards */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          {modes.map(({ mode, label, description, icon, color }) => (
            <button
              key={mode}
              onClick={() => handleModeSelect(mode)}
              className={cn(
                'relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden',
                selectedMode === mode
                  ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
              )}
            >
              {/* Background gradient */}
              <div className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300',
                color,
                selectedMode === mode ? 'opacity-10' : 'group-hover:opacity-5'
              )} />

              <div className="relative">
                <div className={cn(
                  'w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-colors',
                  selectedMode === mode ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                )}>
                  {icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{label}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>

                {selectedMode === mode && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </section>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedMode}
            className={cn(
              'flex items-center gap-3 px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300',
              selectedMode
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            继续选择食材
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default ModeSelection;
