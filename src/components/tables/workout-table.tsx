'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import Button from '@/components/button/button';
import ButtonStyle from '@/components/button/button.module.css';
import WorkoutService from '@/services/workout-service';
import { WorkoutViewModel } from '@/view-models/workout-view-model';
import { toast } from 'sonner';

export default function WorkoutTable() {
  const [workouts, setWorkouts] = useState<WorkoutViewModel[]>([]);

  //GET: Workouts
  useEffect(() => {
    const fetchWorkouts = async () => {
      const result = await WorkoutService.getAll();
      if (result.success) {
        setWorkouts(result.workouts);
      }
    };

    fetchWorkouts();
  }, []);

  //Handle Delete workout
  const handledDelete = async (id: number): Promise<void> => {
    if (!id) {
      toast('Kunde inte hitta workout');
    }
    confirmDelete(id);
  };

  //Confirm delete or not.
  const confirmDelete = (id: number) => {
    toast('Är du säker på att du vill radera övningen?', {
      action: {
        label: 'Radera',
        onClick: async () => {
          await callDeleteApi(id);
        },
      },
      cancel: {
        label: 'Avbryt',
        onClick: () => {},
      },
    });
  };

  //Call API To Delete Workout
  const callDeleteApi = async (id: number) => {
    try {
      const result = await WorkoutService.delete(id);

      if (!result.success) {
        toast.error('Något gick fel, övning ej borttagen');
        return;
      }
      //Remove workout from list
      removeWorkoutFromList(id);
    } catch {
      toast.error('Något gick fel, övning ej borttagen');
    }
  };

  //Remove Workout from workout-list
  const removeWorkoutFromList = (id: number): void => {
    setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
    toast.success('Övning borttagen');
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">
      <table className="w-full border-collapse">
        <thead className="bg-zinc-800">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Namn
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Beskrivning
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Övningar
            </th>

            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Skapad
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Uppdaterad
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Åtgärder
            </th>
          </tr>
        </thead>

        <tbody>
          {workouts.map((workout) => (
            <tr
              key={workout.id}
              className="border-t border-zinc-800 transition-colors hover:bg-zinc-800/40"
            >
              <td className="px-6 py-5 font-semibold text-white">{workout.name}</td>
              <td className="max-w-sm px-6 py-5 text-zinc-300">{workout.description ?? '-'}</td>
              <td className="px-6 py-5">
                <div className="flex flex-wrap gap-2">
                  {workout.exercise.map((exercise) => (
                    <span
                      key={exercise.id}
                      className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-300"
                    >
                      {exercise.name}
                    </span>
                  ))}
                </div>
              </td>

              <td className="px-6 py-5 text-zinc-300">
                {new Date(workout.createdAt).toLocaleDateString('sv-SE')}
              </td>
              <td className="px-6 py-5 text-zinc-300">
                {new Date(workout.updatedAt).toLocaleDateString('sv-SE')}
              </td>
              <td className="px-6 py-5">
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/workout/edit/${workout.id}`}
                    className={`${ButtonStyle.button} ${ButtonStyle.secondary} ${ButtonStyle.sm}`}
                  >
                    Redigera
                  </Link>

                  <Button
                    type="button"
                    text="Ta bort"
                    variant="delete"
                    size="sm"
                    onClick={() => handledDelete(workout.id)}
                  />
                </div>
              </td>
            </tr>
          ))}

          {workouts.length === 0 && (
            <tr>
              <td colSpan={7} className="py-12 text-center text-zinc-500">
                Du har inga träningspass ännu.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
