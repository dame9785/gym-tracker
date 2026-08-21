//Prisma
import { Prisma } from '@prisma/client';

//Types
import type { WorkoutSessionViewModel } from '@/types/workout-types';
import { WorkoutSessionWithExercisesViewModel, WorkoutSessionWithRelations } from '@/types/history-types';

type WorkoutSessionWithExercises = Prisma.WorkoutSessionGetPayload<{
  include: {
    exercises: {
      include: {
        workoutExercise: {
          include: {
            exercise: true;
          };
        };
        sets: true;
      };
    };
  };
}>;

export class WorkoutSessionMapper {
  static mapWorkoutSession(workoutSession: WorkoutSessionWithExercises): WorkoutSessionViewModel {
    const viewModel: WorkoutSessionViewModel = {
      id: workoutSession.id,
      workoutId: workoutSession.workoutId,
      startedAt: workoutSession.startedAt,
      finishedAt: workoutSession.finishedAt,
      status: workoutSession.status,

      exercises: workoutSession.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.workoutExercise.exercise.name,
        muscleGroup: exercise.workoutExercise.exercise.muscleGroup,
        equipment: exercise.workoutExercise.exercise.equipment,
        order: exercise.order,
        note: exercise.workoutExercise.note,

        sets: exercise.sets.map((set) => ({
          id: set.id,
          setNumber: set.setNumber,
          targetReps: set.targetReps,
          targetWeight: set.targetWeight,
          actualReps: set.actualReps,
          actualWeight: set.actualWeight,
          completed: set.completed,
        })),
      })),
    };

    return viewModel;
  }
  static mapWorkoutSessionWithExericses(workoutSession: WorkoutSessionWithRelations): WorkoutSessionWithExercisesViewModel {
    return {
      id: workoutSession.id,
      workoutId: workoutSession.workoutId,
      workoutName: workoutSession.workout.name,
      workoutDescription: workoutSession.workout.description,
      startedAt: workoutSession.startedAt,
      finishedAt: workoutSession.finishedAt,
      status: workoutSession.status,

      exercises: workoutSession.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.workoutExercise.exercise.name,
        muscleGroup: exercise.workoutExercise.exercise.muscleGroup,
        equipment: exercise.workoutExercise.exercise.equipment,
        order: exercise.order,
        note: exercise.workoutExercise.note,

        sets: exercise.sets.map((set) => ({
          id: set.id,
          setNumber: set.setNumber,
          targetReps: set.targetReps,
          targetWeight: set.targetWeight,
          actualReps: set.actualReps,
          actualWeight: set.actualWeight,
          completed: set.completed,
          completedAt: set.completedAt,
        })),
      })),
    };
  }
}
