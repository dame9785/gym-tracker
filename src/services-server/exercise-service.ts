import { ExerciseRepository } from '@/repositories/exercise-repository';
import { ExerciseMapper } from '@/mapping/exericse-mapping';

import type { ExerciseListResult, ExerciseResult } from '@/types/exercise-types';

import { registerExerciseSchema, updateExerciseSchema, type RegisterExericseDto, type UpdateExericseDto } from '@/schemas/exercise-schema';

export class ExerciseService {
  private exerciseRepository = new ExerciseRepository();

  async getAllExersise(userId: number): Promise<ExerciseListResult> {
    const exercises = await this.exerciseRepository.getAllExersise(userId);

    return exercises.map((exercise) => ExerciseMapper.exerciseModelToViewModel(exercise));
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.exerciseRepository.delete(id, userId);
  }

  async registerExercise(dto: RegisterExericseDto, userId: number): Promise<ExerciseResult> {
    const validation = registerExerciseSchema.safeParse(dto);

    if (!validation.success) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.error.flatten().fieldErrors)}`);
    }

    const exercise = await this.exerciseRepository.register(validation.data, userId);

    return ExerciseMapper.exerciseModelToViewModel(exercise);
  }

  async getById(id: number, userId: number): Promise<ExerciseResult> {
    const exercise = await this.exerciseRepository.getById(id, userId);

    if (!exercise) {
      throw new Error('Exercise not found.');
    }

    return ExerciseMapper.exerciseModelToViewModel(exercise);
  }

  async getBySlug(slug: string, userId: number): Promise<ExerciseResult> {
    const exercise = await this.exerciseRepository.getBySlug(slug, userId);

    if (!exercise) {
      throw new Error('Exercise not found.');
    }

    return ExerciseMapper.exerciseModelToViewModel(exercise);
  }

  async update(id: number, dto: UpdateExericseDto, userId: number): Promise<void> {
    const validation = updateExerciseSchema.safeParse(dto);

    if (!validation.success) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.error.flatten().fieldErrors)}`);
    }

    await this.exerciseRepository.update(id, validation.data, userId);
  }
}
