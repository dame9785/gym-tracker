'use client';

import type { FoodViewModel } from '@/types/food-type';

import Link from 'next/link';
import { Plus, Flame, Beef, Wheat, Droplets, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import styles from './food-list.module.css';
import { deleteFoodAction } from '@/actions/food-actions';

type Props = {
  foods: FoodViewModel[];
};

export default function FoodList({ foods }: Props) {
  const router = useRouter();

  const handleDelete = (id: number) => {
    verifyDelete(id);
  };

  const verifyDelete = (id: number): void => {
    toast('Are you sure you want to delete this food?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          await removeFood(id);
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  const removeFood = async (id: number) => {
    try {
      const response = await deleteFoodAction(id);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    } catch (error) {
      console.error('Failed to delete food:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Nutrition</p>
          <h1>Foods</h1>
          <p className={styles.description}>Manage your foods and nutritional values.</p>
        </div>

        <Link href="/foods/add" className={styles.addButton}>
          <Plus size={20} />
          Add food
        </Link>
      </header>

      <section className={styles.content}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Your foods</h2>
            <p>
              {foods.length} {foods.length === 1 ? 'food' : 'foods'} available
            </p>
          </div>
        </div>

        {foods.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No foods found</h2>
            <p>Start by adding your first food.</p>

            <Link href="/foods/add" className={styles.addButton}>
              <Plus size={20} />
              Add your first food
            </Link>
          </div>
        ) : (
          <div className={styles.foodGrid}>
            {foods.map((food) => (
              <article key={food.id} className={styles.foodCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.foodIcon}>
                    <Flame size={22} />
                  </div>

                  <div>
                    <h3>{food.name}</h3>
                    <span>Per 100g</span>
                  </div>
                </div>

                <div className={styles.calories}>
                  <span>Calories</span>

                  <strong>
                    {food.caloriesPer100g}
                    <small> kcal</small>
                  </strong>
                </div>

                <div className={styles.macros}>
                  <div className={styles.macro}>
                    <Beef size={18} />
                    <span>Protein</span>
                    <strong>{food.proteinPer100g}g</strong>
                  </div>

                  <div className={styles.macro}>
                    <Wheat size={18} />
                    <span>Carbs</span>
                    <strong>{food.carbsPer100g}g</strong>
                  </div>

                  <div className={styles.macro}>
                    <Droplets size={18} />
                    <span>Fat</span>
                    <strong>{food.fatPer100g}g</strong>
                  </div>
                </div>

                {/* Edit */}
                <Link
                  href={`/foods/edit/${food.id}`}
                  aria-label={`Redigera ${food.name}`}
                  className="
                          flex h-9 w-9
                          items-center justify-center
                          rounded-lg
                          border border-zinc-700
                          bg-zinc-800/60
                          text-zinc-500
                          transition-all duration-200
                          hover:border-blue-500/40
                          hover:bg-blue-500/10
                          hover:text-blue-400
                        "
                >
                  <Pencil className="h-4 w-4" />
                </Link>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDelete(food.id)}
                  aria-label={`Radera ${food.name}`}
                  className="
                        cursor-pointer
                          flex h-9 w-9
                          items-center justify-center
                          rounded-lg
                          border border-zinc-700
                          bg-zinc-800/60
                          text-zinc-500
                          transition-all duration-200
                          hover:border-red-500/40
                          hover:bg-red-500/10
                          hover:text-red-400
                        "
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
