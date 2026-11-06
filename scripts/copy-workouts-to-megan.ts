import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DAVID_USERNAME = 'Djanar97';
const MEGAN_USERNAME = 'MegRitzh';

const DATES = [
  {
    date: '2026-11-04',
    start: new Date('2026-11-04T00:00:00+01:00'),
    end: new Date('2026-11-05T00:00:00+01:00'),
  },
  {
    date: '2026-11-06',
    start: new Date('2026-11-06T00:00:00+01:00'),
    end: new Date('2026-11-07T00:00:00+01:00'),
  },
];

function adjustWeight(weight: number | null): number | null {
  if (weight === null) return null;

  return Math.abs(weight - 12.5) < 0.001 ? 2.5 : weight;
}

async function main() {
  await prisma.$transaction(
    async (tx) => {
      // 1. Find users
      const david = await tx.user.findUnique({
        where: { username: DAVID_USERNAME },
      });

      const megan = await tx.user.findUnique({
        where: { username: MEGAN_USERNAME },
      });

      if (!david || !megan) {
        throw new Error('David or Megan was not found.');
      }

      console.log(`David: ${david.id}`);
      console.log(`Megan: ${megan.id}`);

      // 2. Fetch David's completed sessions
      const sessions = await tx.workoutSession.findMany({
        where: {
          userId: david.id,
          status: 'COMPLETED',
          OR: DATES.map((date) => ({
            startedAt: {
              gte: date.start,
              lt: date.end,
            },
          })),
        },
        include: {
          workout: {
            include: {
              exercises: {
                include: {
                  exercise: {
                    include: {
                      muscles: true,
                    },
                  },
                },
              },
            },
          },
          exercises: {
            include: {
              sets: true,
            },
          },
        },
        orderBy: {
          startedAt: 'asc',
        },
      });

      // Require exactly one completed session per date
      for (const date of DATES) {
        const count = sessions.filter((session) => session.startedAt >= date.start && session.startedAt < date.end).length;

        if (count !== 1) {
          throw new Error(`Expected exactly one completed session on ${date.date}, found ${count}.`);
        }
      }

      // 3. Prevent duplicate sessions
      const existingSessions = await tx.workoutSession.count({
        where: {
          userId: megan.id,
          OR: DATES.map((date) => ({
            startedAt: {
              gte: date.start,
              lt: date.end,
            },
          })),
        },
      });

      if (existingSessions > 0) {
        throw new Error('Megan already has sessions on these dates. Aborting to prevent duplicates.');
      }

      // 4. Copy exercises and workouts
      const workoutMap = new Map<
        number,
        {
          id: number;
          exerciseMap: Map<number, number>;
        }
      >();

      const exerciseMap = new Map<number, number>();

      for (const session of sessions) {
        const sourceWorkout = session.workout;

        if (workoutMap.has(sourceWorkout.id)) continue;

        const newWorkout = await tx.workout.create({
          data: {
            userId: megan.id,
            name: sourceWorkout.name,
            description: sourceWorkout.description,
            estimatedMinutes: sourceWorkout.estimatedMinutes,
          },
        });

        const workoutExerciseMap = new Map<number, number>();

        for (const sourceWE of sourceWorkout.exercises) {
          let newExerciseId = exerciseMap.get(sourceWE.exerciseId);

          // Copy each exercise only once
          if (!newExerciseId) {
            const sourceExercise = sourceWE.exercise;

            const newExercise = await tx.exercise.create({
              data: {
                userId: megan.id,
                name: sourceExercise.name,
                slug: sourceExercise.slug ? `${sourceExercise.slug.slice(0, 140)}-megan-${sourceExercise.id}` : null,
                equipment: sourceExercise.equipment,
                imagePath: sourceExercise.imagePath,
                description: sourceExercise.description,
                instructions: sourceExercise.instructions,
                techniqueTips: sourceExercise.techniqueTips,
                muscles: {
                  create: sourceExercise.muscles.map((muscle) => ({
                    role: muscle.role,
                    muscleGroupId: muscle.muscleGroupId,
                  })),
                },
              },
            });

            newExerciseId = newExercise.id;

            exerciseMap.set(sourceWE.exerciseId, newExerciseId);
          }

          const newWE = await tx.workoutExercise.create({
            data: {
              workoutId: newWorkout.id,
              exerciseId: newExerciseId,
              sets: sourceWE.sets,
              reps: sourceWE.reps,
              weight: adjustWeight(sourceWE.weight),
              order: sourceWE.order,
              seconds: sourceWE.seconds,
              note: sourceWE.note,
              archivedAt: sourceWE.archivedAt,
            },
          });

          workoutExerciseMap.set(sourceWE.id, newWE.id);
        }

        workoutMap.set(sourceWorkout.id, {
          id: newWorkout.id,
          exerciseMap: workoutExerciseMap,
        });
      }

      // 5. Copy schedules and completed sessions
      for (const session of sessions) {
        const copiedWorkout = workoutMap.get(session.workoutId);

        if (!copiedWorkout) {
          throw new Error('Copied workout mapping not found.');
        }

        const date = DATES.find((item) => session.startedAt >= item.start && session.startedAt < item.end);

        if (!date) {
          throw new Error('Session date not recognized.');
        }

        const sourceSchedules = await tx.workoutSchedule.findMany({
          where: {
            userId: david.id,
            workoutId: session.workoutId,
            date: {
              gte: date.start,
              lt: date.end,
            },
          },
        });

        if (sourceSchedules.length > 0) {
          for (const schedule of sourceSchedules) {
            await tx.workoutSchedule.create({
              data: {
                userId: megan.id,
                workoutId: copiedWorkout.id,
                date: schedule.date,
              },
            });
          }
        } else {
          // Fallback if the original schedule is missing
          await tx.workoutSchedule.create({
            data: {
              userId: megan.id,
              workoutId: copiedWorkout.id,
              date: date.start,
            },
          });
        }

        // Copy session and all exercise snapshots
        await tx.workoutSession.create({
          data: {
            userId: megan.id,
            workoutId: copiedWorkout.id,
            workoutName: session.workoutName,
            workoutDescription: session.workoutDescription,
            startedAt: session.startedAt,
            finishedAt: session.finishedAt,
            status: 'COMPLETED',
            activeKey: null,

            exercises: {
              create: session.exercises.map((exercise) => {
                const newWorkoutExerciseId = copiedWorkout.exerciseMap.get(exercise.workoutExerciseId);

                if (!newWorkoutExerciseId) {
                  throw new Error(`Missing workout exercise mapping: ${exercise.workoutExerciseId}`);
                }

                return {
                  workoutExerciseId: newWorkoutExerciseId,
                  exerciseName: exercise.exerciseName,
                  exerciseImagePath: exercise.exerciseImagePath,
                  exerciseEquipment: exercise.exerciseEquipment,
                  exerciseDescription: exercise.exerciseDescription,
                  exerciseInstructions: exercise.exerciseInstructions,
                  exerciseTechniqueTips: exercise.exerciseTechniqueTips,
                  primaryMuscle: exercise.primaryMuscle,
                  secondaryMuscles: exercise.secondaryMuscles,
                  order: exercise.order,

                  sets: {
                    create: exercise.sets.map((set) => ({
                      setNumber: set.setNumber,
                      targetReps: set.targetReps,
                      targetSeconds: set.targetSeconds,
                      targetWeight: adjustWeight(set.targetWeight),
                      actualReps: set.actualReps,
                      actualSeconds: set.actualSeconds,
                      actualWeight: adjustWeight(set.actualWeight),
                      completed: true,
                      completedAt: set.completedAt ?? session.finishedAt ?? new Date(),
                    })),
                  },
                };
              }),
            },
          },
        });

        console.log(`Copied ${session.workoutName} for ${date.date}`);
      }

      console.log('Successfully copied both workouts to Megan!');
    },
    {
      maxWait: 10000,
      timeout: 60000,
    },
  );
}

main()
  .catch((error) => {
    console.error('Copy failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
