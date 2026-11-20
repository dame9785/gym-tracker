type Props = {
  isCalculating: boolean;
  onCalculate: () => void;
};

import Button from '@/components/button/button';

export default function NutritionGoalsPrompt({ isCalculating, onCalculate }: Props) {
  return (
    <section className="border-primary/30 bg-primary/5 rounded-xl border p-4">
      <h3 className="text-text font-semibold">Your nutrition goals are not set yet</h3>

      <p className="text-text-secondary mt-1 text-sm">Calculate your personal daily calorie and macronutrient targets based on your profile and activity level.</p>

      <Button type="button" variant="primary" size="md" onClick={onCalculate} disabled={isCalculating} loading={isCalculating} className="mt-4">
        {isCalculating ? 'Calculating...' : 'Calculate nutrition goals'}
      </Button>
    </section>
  );
}
