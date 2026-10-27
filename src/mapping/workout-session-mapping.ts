import { MuscleRole, Prisma } from '@prisma/client';

import type { WorkoutSessionViewModel } from '@/types/workout-types';
import type { WorkoutSessionWithExercisesViewModel, WorkoutSessionWithRelations } from '@/types/history-types';

type WorkoutSessionWithExercises = Prisma.WorkoutSessionGetPayload<{
  include: {
    exercises: {
      include: {
        workoutExercise: {
          include: {
            exercise: {
              include: {
                muscles: {
                  include: {
                    muscleGroup: true;
                  };
                };
              };
            };
          };
        };
        sets: true;
      };
    };
  };
}>;

export class WorkoutSessionMapper {
  static mapWorkoutSession(workoutSession: WorkoutSessionWithExercises): WorkoutSessionViewModel {
    return {
      id: workoutSession.id,
      workoutId: workoutSession.workoutId,
      startedAt: workoutSession.startedAt,
      finishedAt: workoutSession.finishedAt,
      status: workoutSession.status,

      exercises: workoutSession.exercises.map((exercise) => {
        const exerciseModel = exercise.workoutExercise.exercise;

        const primaryMuscle = exerciseModel.muscles.find((muscle) => muscle.role === MuscleRole.PRIMARY);

        const secondaryMuscles = exerciseModel.muscles.filter((muscle) => muscle.role === MuscleRole.SECONDARY).map((muscle) => muscle.muscleGroup.name);

        return {
          id: exercise.id,
          name: exerciseModel.name,
          primaryMuscle: primaryMuscle?.muscleGroup.name ?? '',
          secondaryMuscles,
          equipment: exerciseModel.equipment,
          description: exerciseModel.description,
          instructions: exerciseModel.instructions,
          techniqueTips: exerciseModel.techniqueTips,
          order: exercise.order,
          note: exercise.workoutExercise.note,

          sets: exercise.sets.map((set) => ({
            id: set.id,
            setNumber: set.setNumber,
            targetReps: set.targetReps,
            targetWeight: set.targetWeight,
            actualReps: set.actualReps,
            actualSeconds: set.actualSeconds,
            targetSeconds: set.targetSeconds,
            actualWeight: set.actualWeight,
            completed: set.completed,
          })),
        };
      }),
    };
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

      exercises: workoutSession.exercises.map((exercise) => {
        const exerciseModel = exercise.workoutExercise.exercise;

        const primaryMuscle = exerciseModel.muscles.find((muscle) => muscle.role === MuscleRole.PRIMARY);

        const secondaryMuscles = exerciseModel.muscles.filter((muscle) => muscle.role === MuscleRole.SECONDARY).map((muscle) => muscle.muscleGroup.name);

        return {
          id: exercise.id,
          name: exerciseModel.name,
          primaryMuscle: primaryMuscle?.muscleGroup.name ?? '',
          secondaryMuscles,
          equipment: exerciseModel.equipment,
          description: exerciseModel.description,
          instructions: exerciseModel.instructions,
          techniqueTips: exerciseModel.techniqueTips,
          order: exercise.order,
          note: exercise.workoutExercise.note,

          sets: exercise.sets.map((set) => ({
            id: set.id,
            setNumber: set.setNumber,
            targetReps: set.targetReps,
            targetSeconds: set.targetSeconds,
            targetWeight: set.targetWeight,
            actualReps: set.actualReps,
            actualSeconds: set.actualSeconds,
            actualWeight: set.actualWeight,
            completed: set.completed,
            completedAt: set.completedAt,
          })),
        };
      }),
    };
  }
}
