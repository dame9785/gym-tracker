type Props = {
  isCalculating: boolean;
  onCalculate: () => void;
};

export default function NutritionGoalsPrompt({ isCalculating, onCalculate }: Props) {
  return (
    <section className="border-primary/30 bg-primary/5 rounded-xl border p-4">
      <h3 className="text-text font-semibold">Your nutrition goals are not set yet</h3>

      <p className="text-text-secondary mt-1 text-sm">Calculate your personal daily calorie and macronutrient targets based on your profile and activity level.</p>

      <button type="button" onClick={onCalculate} disabled={isCalculating} className="bg-primary text-primary-foreground hover:bg-primary-hover mt-4 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50">
        {isCalculating ? 'Calculating...' : 'Calculate nutrition goals'}
      </button>
    </section>
  );
}
