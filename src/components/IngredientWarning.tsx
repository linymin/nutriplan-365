import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface IngredientWarningProps {
  currentCount: number;
  minimumCount: number;
  suggestions: string[];
}

export const IngredientWarning = ({
  currentCount,
  minimumCount,
  suggestions,
}: IngredientWarningProps) => {
  return (
    <Alert variant="destructive" className="border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-300">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-semibold">食材种类不足</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>
          当前已选择 <span className="font-bold">{currentCount}</span> 种食材，
          建议至少选择 <span className="font-bold">{minimumCount}</span> 种以确保一周饮食营养均衡。
        </p>
        {suggestions.length > 0 && (
          <div className="mt-3">
            <p className="font-medium mb-1">建议补充：</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};
