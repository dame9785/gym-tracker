'use server';

import { revalidatePath } from 'next/cache';

import { requireAuth } from '@/lib/auth';
import { WorkoutScheduleService } from '@/services/workout-schedule-service';
import type { RegisterWorkoutScheduleDto } from '@/types/workout-schedule-types';
import type { AppActionResult } from '@/types/action-types';
import type { WeeklyWorkoutViewModel } from '@/types/workout-types';

import { calendarMonthSchema, createWorkoutScheduleSchema } from '@/schemas/schedelue-workout-schemas';

const workoutScheduleService = new WorkoutScheduleService();

export async function createWorkoutScheduleAction(dto: unknown): Promise<AppActionResult> {
  const user = await requireAuth();

  try {
    const validation = createWorkoutScheduleSchema.safeParse(dto);

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid workout schedule data.',
      };
    }

    await workoutScheduleService.create(validation.data as RegisterWorkoutScheduleDto, user.userId);

    revalidatePath('/dashboard');
    revalidatePath('/workout-schedule');

    return {
      success: true,
      message: 'Workout scheduled successfully.',
    };
  } catch (error: unknown) {
    console.error('Create workout schedule action failed:', error);

    return {
      success: false,
      message: 'Could not schedule workout. Please try again.',
    };
  }
}

export async function getWorkoutSchedulesByMonthAction(year: number, month: number): Promise<AppActionResult<WeeklyWorkoutViewModel[]>> {
  const user = await requireAuth();

  try {
    const validation = calendarMonthSchema.safeParse({ year, month });

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid calendar month.',
      };
    }

    const workoutSchedules = await workoutScheduleService.getByMonth(user.userId, validation.data.year, validation.data.month);

    return {
      success: true,
      data: workoutSchedules,
    };
  } catch (error: unknown) {
    console.error('Get workout schedules by month action failed:', error);

    return {
      success: false,
      message: 'Could not load workout schedules.',
    };
  }
}
