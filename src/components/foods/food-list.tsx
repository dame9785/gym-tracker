import type { FoodViewModel } from '@/types/food-type';

import Link from 'next/link';
import { Plus, Flame, Beef, Wheat, Droplets } from 'lucide-react';

import styles from './food-list.module.css';

type Props = {
  foods: FoodViewModel[];
};

export default function FoodList({ foods }: Props) {
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
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
