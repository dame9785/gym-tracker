export interface Exercise {
  exerciseId: number;
}

export interface ExerciseViewModel {
  id: number;
  name: string;
  slug: string | null;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string | null;
  imagePath: string | null;
  description: string;
  instructions: string;
  techniqueTips: string | null;
}

export interface RegisterWorkoutExerciseDto {
  exerciseId: number;
  sets: number;
  reps: number;
  weight: number | null;
  note: string;
  seconds: number;
}

export interface WorkoutExerciseViewModel {
  exerciseId: number;
  name: string;
  sets: number;
  reps: number;
  order: number;
  weight: number | null;
  seconds: number;
}

export interface WorkoutSessionExerciseViewModel {
  id: number;
  exerciseId: number; // ID från Exercise-tabellen
  workoutExerciseId: number;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string | null;
  description: string;
  instructions: string;
  techniqueTips: string | null;
  order: number;
  note: string | null;
  sets: WorkoutSessionSetViewModel[];
}

export interface WorkoutSessionSetViewModel {
  id: number;
  setNumber: number;
  targetReps: number;
  targetWeight: number | null;
  actualReps: number | null;
  actualWeight: number | null;
  actualSeconds: number | null;
  targetSeconds: number | null;
  completed: boolean;
}
