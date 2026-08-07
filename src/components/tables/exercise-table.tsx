'use client';

//Components
import Button from '@/components/button/button';

//Modules & Styling
import ButtonStyle from '@/components/button/button.module.css';

//Services
import ExerciseService from '@/services/exercise-service';

//Types
import type { ExerciseViewModel } from '@/types/exercise-types';

//Alert toast sooner
import { toast } from 'sonner';

//NEXT & Hooks
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ExerciseTable() {
  const [exercises, setExercises] = useState<ExerciseViewModel[]>([]);

  //Get all exericses
  useEffect(() => {
    const fetchExercises = async () => {
      const data = await ExerciseService.getAll();
      setExercises(data);
    };
    fetchExercises();
  }, []);

  //Handle delete
  const handleDelete = async (id: number) => {
    const result = await ExerciseService.delete(id);
    if (!result.success) {
      toast.error('Gick inte radera övning');
    }
    verifyDelete(id);
  };

  //Pop up verify delete
  const verifyDelete = (id: number): void => {
    toast('Är du säker på att du vill radera övningen?', {
      action: {
        label: 'Radera',
        onClick: async () => {
          await removeExericse(id);
        },
      },
      cancel: {
        label: 'Avbryt',
        onClick: () => {},
      },
    });
  };

  //Remove Exercise from array
  const removeExericse = (id: number): void => {
    setExercises((prev) => prev.filter((f) => f.id !== id));
    toast.success('Övning raderad');
  };

  return (
    <table className="w-full border-collapse">
      <thead className="bg-zinc-800">
        <tr>
          <th className="border-b border-zinc-700 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Övning</th>
          <th className="border-b border-zinc-700 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Muskelgrupp</th>
          <th className="border-b border-zinc-700 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Redskap</th>
          <th className="border-b border-zinc-700 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Redigera</th>
        </tr>
      </thead>

      <tbody>
        {exercises.map((exercise) => {
          return (
            <tr key={exercise.id} className="bg-zinc-900/50 transition-colors hover:bg-zinc-800">
              <td className="border-b border-zinc-800 px-6 py-4 text-zinc-100">{exercise.name}</td>
              <td className="border-b border-zinc-800 px-6 py-4 text-zinc-300">{exercise.muscleGroup}</td>
              <td className="border-b border-zinc-800 px-6 py-4 text-zinc-300">{exercise.equipment}</td>
              <td className="border-b border-zinc-800 px-6 py-4 text-zinc-300">
                <div className="flex gap-4">
                  <Link className={`${ButtonStyle.button} ${ButtonStyle.secondary} ${ButtonStyle.sm}`} href={`/exercise/${exercise.id}`}>
                    Redigera
                  </Link>
                  <Button type="submit" text="Radera övning" variant="delete" size="sm" onClick={() => handleDelete(exercise.id)}></Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
