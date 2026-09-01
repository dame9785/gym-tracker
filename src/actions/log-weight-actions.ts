'use server';
import { WeightLogService } from '@/services-server/weight-log-service';
import { requireAuth } from '@/lib/auth';
import { AddWeightDto, addWeightSchema, UpdateWeightDto, updateWeightSchema } from '@/schemas/weight-log.schemas';

const weightLogService = new WeightLogService();

export async function deleteLogWeight(id: number) {
  try {
    const user = await requireAuth();

    return await weightLogService.delete(id, user.userId);
  } catch (error) {
    console.error('Delete exercise action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}

export async function CreateWeightLogAction(dto: AddWeightDto) {
  const user = await requireAuth();

  const validation = addWeightSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  return weightLogService.create(validation.data, user.userId);
}

export async function updateLogWeightAction(id: number, dto: UpdateWeightDto) {
  try {
    const user = await requireAuth();

    const validation = updateWeightSchema.safeParse(dto);

    if (!validation.success) {
      return {
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      };
    }

    return await weightLogService.update(id, validation.data, user.userId);
  } catch (error) {
    console.error('Update exercise action failed:', error);

    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
