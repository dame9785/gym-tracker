import { WorkoutRepository } from '@/repositories/workout-repository';
import { ExerciseRepository } from '@/repositories/exercise-repository';

import { WorkoutMapper } from '@/mapping/workout-mapping';
import { ExerciseMapper } from '@/mapping/exercise-mapping';

import type { WorkoutViewModel, WorkoutDetailsResult, WorkoutListResult } from '@/types/workout-types';

import type { AddWorkoutDto, UpdateWorkoutDto } from '@/schemas/workout-schemas';

export class WorkoutService {
  private readonly workoutRepository = new WorkoutRepository();
  private readonly exerciseRepository = new ExerciseRepository();

  private readonly pageSize = 100;

  async create(dto: AddWorkoutDto, userId: number): Promise<WorkoutViewModel> {
    const workout = await this.workoutRepository.create(dto, userId);

    return WorkoutMapper.workoutDtoToViewModel(workout);
  }

  async update(id: number, dto: UpdateWorkoutDto, userId: number): Promise<WorkoutViewModel> {
    const workout = await this.workoutRepository.update(id, dto, userId);

    if (!workout) {
      throw new Error('Could not find workout.');
    }

    return WorkoutMapper.workoutDtoToViewModel(workout);
  }

  async getAll(page: number, userId: number): Promise<WorkoutListResult> {
    const [totalNumberWorkouts, workouts] = await Promise.all([this.workoutRepository.getTotalNumberOfWorkouts(userId), this.workoutRepository.getAll(userId, page, this.pageSize)]);

    const totalPages = Math.ceil(totalNumberWorkouts / this.pageSize);

    return {
      workouts: WorkoutMapper.workoutDtosToViewModels(workouts),
      pagination: {
        currentPage: page,
        totalPages,
        pageSize: this.pageSize,
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
