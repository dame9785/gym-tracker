import { ExerciseRepository } from '@/repositories/exercise-repository';
import { createSlug } from '@/lib/slug';
import { ExerciseMapper } from '@/mapping/exercise-mapping';

import type { ExerciseViewModel } from '@/types/exercise-types';

import { registerExerciseSchema, updateExerciseSchema, type RegisterExericseDto, type UpdateExericseDto } from '@/schemas/exercise-schema';

export class ExerciseService {
  private readonly exerciseRepository = new ExerciseRepository();

  async getAllExersise(userId: number): Promise<ExerciseViewModel[]> {
    const exercises = await this.exerciseRepository.getAllExersise(userId);

    return exercises.map((exercise) => ExerciseMapper.exerciseModelToViewModel(exercise));
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.exerciseRepository.delete(id, userId);
  }

  async registerExercise(dto: RegisterExericseDto, userId: number): Promise<ExerciseViewModel> {
    const validation = registerExerciseSchema.safeParse(dto);

    if (!validation.success) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.error.flatten().fieldErrors)}`);
    }

    const baseSlug = createSlug(validation.data.name);

    if (!baseSlug) {
      throw new Error('Could not generate a valid exercise slug.');
    }

    const slug = await this.generateUniqueSlug(baseSlug);
    const exercise = await this.exerciseRepository.register(validation.data, userId, slug);

    return ExerciseMapper.exerciseModelToViewModel(exercise);
  }

  async getById(id: number, userId: number): Promise<ExerciseViewModel> {
    const exercise = await this.exerciseRepository.getById(id, userId);

    if (!exercise) {
      throw new Error('Exercise not found.');
    }

    return ExerciseMapper.exerciseModelToViewModel(exercise);
  }

  async getBySlug(slug: string, userId: number): Promise<ExerciseViewModel> {
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

    const existing = await this.exerciseRepository.getById(id, userId);

    if (!existing) {
      throw new Error('Exercise not found.');
    }

    let slug: string | undefined;

    if (validation.data.name !== undefined && (validation.data.name !== existing.name || !existing.slug)) {
      const baseSlug = createSlug(validation.data.name);

      if (!baseSlug) {
        throw new Error('Could not generate a valid exercise slug.');
      }

      slug = await this.generateUniqueSlug(baseSlug, id);
    }

    await this.exerciseRepository.update(id, validation.data, userId, slug);
  }


  private async generateUniqueSlug(baseSlug: string, excludeId?: number): Promise<string> {
    let slug = baseSlug;
    let counter = 1;

    while (await this.exerciseRepository.isSlugTaken(slug, excludeId)) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }
}
