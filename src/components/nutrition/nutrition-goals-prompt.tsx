type Props = {
  isCalculating: boolean;
  onCalculate: () => void;
};

export default function NutritionGoalsPrompt({ isCalculating, onCalculate }: Props) {
  return (
    <section className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4">
      <h3 className="font-semibold text-white">Your nutrition goals are not set yet</h3>

      <p className="mt-1 text-sm text-zinc-400">Calculate your personal daily calorie and macronutrient targets based on your profile and activity level.</p>

      <button type="button" onClick={onCalculate} disabled={isCalculating} className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50">
        {isCalculating ? 'Calculating...' : 'Calculate nutrition goals'}
      </button>
    </section>
  );
}
