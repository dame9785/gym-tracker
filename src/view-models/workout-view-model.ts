import ExerciseViewModel from '@/view-models/excercise-view-model';

export interface WorkoutViewModel {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  exercises: ExerciseViewModel[];
}
