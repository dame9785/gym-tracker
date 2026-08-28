//Goal Type
export type GoalApiResponse = GoalTypeViewModel[];

export interface GoalTypeViewModel {
  id: number;
  title: string;
}

export interface GoalViewModel {
  calorieGoal: 'WEIGHT_LOSS' | 'MAINTENANCE' | 'MUSCLE_GAIN' | null;

  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}
