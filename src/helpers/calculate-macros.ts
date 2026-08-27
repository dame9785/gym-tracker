type CalculateMacrosProps = {
  calories: number;
  weight: number;
};

export function calculateMacros({ calories, weight }: CalculateMacrosProps) {
  // Protein: cirka 2 gram per kg kroppsvikt
  const protein = Math.round(weight * 2);

  // Fett: cirka 0.9 gram per kg kroppsvikt
  const fat = Math.round(weight * 0.9);

  // Protein och fett innehåller 4 respektive 9 kcal per gram
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;

  // Resterande kalorier blir kolhydrater
  const remainingCalories = calories - proteinCalories - fatCalories;

  const carbs = Math.round(remainingCalories / 4);

  return {
    calories,
    protein,
    carbs,
    fat,
  };
}
