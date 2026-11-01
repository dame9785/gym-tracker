'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { requireAuth } from '@/lib/auth';
import { WorkoutScheduleService } from '@/services-server/workout-schedule-service';
import type { CalendarWorkoutViewModel } from '@/types/calender-types';
import type { RegisterWorkoutScheduleDto } from '@/types/workout-types';

const workoutScheduleService = new WorkoutScheduleService();

const createWorkoutScheduleSchema = z.object({
  workoutId: z.number().int().positive(),
  date: z.string().min(1),
});

const calendarMonthSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
});

type ActionError = {
  success: false;
  message: string;
};

type ActionSuccess = {
  success: true;
  message: string;
};

type CalendarActionResult =
  | {
      success: true;
      data: CalendarWorkoutViewModel[];
    }
  | ActionError;

export async function createWorkoutScheduleAction(dto: unknown): Promise<ActionSuccess | ActionError> {
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

export async function getWorkoutSchedulesByMonthAction(year: number, month: number): Promise<CalendarActionResult> {
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
