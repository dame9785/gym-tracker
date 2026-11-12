'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/lib/auth';
import { WorkoutScheduleService } from '@/services/workout-schedule-service';

import { calendarMonthSchema, createWorkoutScheduleSchema } from '@/schemas/schedelue-workout-schemas';

import type { AppActionResult } from '@/types/action-types';
import type { WeeklyWorkoutViewModel } from '@/types/workout-types';
import { getActionErrorMessage, getActionValidationErrors } from '@/utils/action-error';

const workoutScheduleService = new WorkoutScheduleService();

export async function createWorkoutScheduleAction(dto: unknown): Promise<AppActionResult> {
  const user = await requireAuth();

  const validation = createWorkoutScheduleSchema.safeParse(dto);

  if (!validation.success) {
    return {
      success: false,
      message: 'Invalid workout schedule data.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await workoutScheduleService.create(validation.data, user.userId);

    revalidatePath('/dashboard');
    revalidatePath('/workout-schedule');

    return {
      success: true,
      message: 'Workout scheduled successfully.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}

export async function getWorkoutSchedulesByMonthAction(year: number, month: number): Promise<AppActionResult<WeeklyWorkoutViewModel[]>> {
  const user = await requireAuth();

  const validation = calendarMonthSchema.safeParse({
    year,
    month,
  });

  if (!validation.success) {
    return {
      success: false,
      message: 'Invalid calendar month.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const workoutSchedules = await workoutScheduleService.getByMonth(user.userId, validation.data.year, validation.data.month);

    return {
      success: true,
      data: workoutSchedules,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: getActionErrorMessage(error),
      errors: getActionValidationErrors(error),
    };
  }
}
