import { DietaryMode } from '@/types/meal';
import { Dumbbell, Scale, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DietaryModeSelectorProps {
  selectedMode: DietaryMode;
  onModeChange: (mode: DietaryMode) => void;
}

const modes: { mode: DietaryMode; label: string; description: string; icon: React.ReactNode }[] = [
  {
    mode: 'muscle',
    label: '增肌模式',
    description: '高蛋白、高碳水，促进肌肉生长',
    icon: <Dumbbell className="w-8 h-8" />,
  },
  {
    mode: 'fatloss',
    label: '减脂模式',
    description: '低卡路里、高蛋白，加速脂肪燃烧',
    icon: <Scale className="w-8 h-8" />,
  },
  {
    mode: 'general',
    label: '均衡模式',
    description: '营养均衡，维持健康体重',
    icon: <Heart className="w-8 h-8" />,
  },
];

export const DietaryModeSelector = ({ selectedMode, onModeChange }: DietaryModeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {modes.map(({ mode, label, description, icon }) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={cn(
            'mode-card text-left',
            mode === 'muscle' && 'bg-muscle-light border-muscle/30 hover:border-muscle',
            mode === 'fatloss' && 'bg-fatloss-light border-fatloss/30 hover:border-fatloss',
            mode === 'general' && 'bg-general-light border-general/30 hover:border-general',
            selectedMode === mode && mode === 'muscle' && 'border-muscle ring-2 ring-muscle/20',
            selectedMode === mode && mode === 'fatloss' && 'border-fatloss ring-2 ring-fatloss/20',
            selectedMode === mode && mode === 'general' && 'border-general ring-2 ring-general/20',
          )}
        >
          <div className={cn(
            'mb-4',
            mode === 'muscle' && 'text-muscle',
            mode === 'fatloss' && 'text-fatloss',
            mode === 'general' && 'text-general',
          )}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold mb-1">{label}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {selectedMode === mode && (
            <div className={cn(
              'absolute top-4 right-4 w-3 h-3 rounded-full',
              mode === 'muscle' && 'bg-muscle',
              mode === 'fatloss' && 'bg-fatloss',
              mode === 'general' && 'bg-general',
            )} />
          )}
        </button>
      ))}
    </div>
  );
};
