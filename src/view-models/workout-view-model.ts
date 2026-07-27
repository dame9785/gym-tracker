import ExerciseViewModel from '@/view-models/excercise-view-model';
export interface WorkoutExerciseViewModel {
  exerciseId: number;
  name: string;
  muscleGroup: string;
  equipment: string;
  sets: number;
  reps: number;
  weight: number;
  note: string;
}
export interface WorkoutViewModel {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  exercise: ExerciseViewModel[];
}
