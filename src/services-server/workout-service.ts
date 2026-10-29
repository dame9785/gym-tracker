import { WorkoutRepository } from '@/repositories/workout-repository';
import { ExerciseRepository } from '@/repositories/exercise-repository';

import { WorkoutMapper } from '@/mapping/workout-mapping';
import { ExerciseMapper } from '@/mapping/exericse-mapping';

import type { WorkoutViewModel } from '@/types/workout-types';
import type { ExerciseViewModel } from '@/types/exercise-types';
import type { AddWorkoutDto, UpdateWorkoutDto } from '@/schemas/workout-schemas';

export interface WorkoutDetailsResult {
  workout: WorkoutViewModel;
  exercises: ExerciseViewModel[];
}

export interface WorkoutListResult {
  workouts: WorkoutViewModel[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  };
}

export class WorkoutService {
  private workoutRepository = new WorkoutRepository();
  private exerciseRepository = new ExerciseRepository();

  async create(dto: AddWorkoutDto, userId: number): Promise<WorkoutViewModel> {
    const workout = await this.workoutRepository.create(dto, userId);

    return WorkoutMapper.workoutDtoToViewModel(workout);
  }

  async update(id: number, dto: UpdateWorkoutDto, userId: number): Promise<WorkoutViewModel> {
    const updated = await this.workoutRepository.update(id, dto, userId);

    if (!updated) {
      throw new Error('Could not find workout.');
    }

    const workout = await this.workoutRepository.getById(id, userId);

    if (!workout) {
      throw new Error('Could not find workout.');
    }

    return WorkoutMapper.workoutDtoToViewModel(workout);
  }

  async getAll(page: number, userId: number): Promise<WorkoutListResult> {
    const totalNumberWorkouts = await this.workoutRepository.getTotalNumberOfWorkouts(userId);

    const pageSize = 100;
    const totalPages = Math.ceil(totalNumberWorkouts / pageSize);

    const workouts = await this.workoutRepository.getAll(userId, page, pageSize);

    return {
      workouts: WorkoutMapper.workoutDtosToViewModels(workouts),
      pagination: {
        currentPage: page,
        totalPages,
        pageSize,
        totalItems: totalNumberWorkouts,
      },
    };
  }

  async getById(id: number, userId: number): Promise<WorkoutDetailsResult> {
    const workout = await this.workoutRepository.getById(id, userId);

    if (!workout) {
      throw new Error('Could not find workout.');
    }

    const exercises = await this.exerciseRepository.getAllExersise(userId);

    return {
      workout: WorkoutMapper.workoutDtoToViewModel(workout),
      exercises: exercises.map((exercise) => ExerciseMapper.exerciseModelToViewModel(exercise)),
    };
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.workoutRepository.delete(id, userId);
  }
}
