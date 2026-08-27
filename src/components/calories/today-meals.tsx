'use client';

import { useEffect, useState } from 'react';
import { Loader2, Utensils } from 'lucide-react';

import MealService from '@/services/meal-service';
import { Meal, MealType } from '@prisma/client';

type Props = {
  userToken: string;
};

const mealTypeLabels: Record<MealType, string> = {
  BREAKFAST: '🍳 Frukost',
  LUNCH: '🥗 Lunch',
  DINNER: '🍽️ Middag',
  SNACK: '🍎 Mellanmål',
};

export default function TodayMeals({ userToken }: Props) {
  return (
    <h1>Hej</h1>
    // <section className="rounded-2xl border border-white/10 bg-card p-6">
    //   <div className="mb-6 flex items-center gap-3">
    //     <div className="rounded-xl bg-blue-500/10 p-3">
    //       <Utensils className="h-5 w-5 text-blue-400" />
    //     </div>

    //     <div>
    //       <h2 className="text-xl font-bold">Dagens måltider</h2>

    //       <p className="text-sm text-muted-foreground">{meals.length} sparade måltider idag</p>
    //     </div>
    //   </div>

    //   {meals.length === 0 ? (
    //     <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
    //       <p className="font-medium">Inga måltider ännu</p>

    //       <p className="mt-1 text-sm text-muted-foreground">Lägg till din första måltid ovan.</p>
    //     </div>
    //   ) : (
    //     <div className="space-y-4">
    //       {meals.map((meal) => {
    //         const totals = meal.items.reduce(
    //           (total, item) => ({
    //             calories: total.calories + item.calories,
    //             protein: total.protein + item.protein,
    //             carbs: total.carbs + item.carbs,
    //             fat: total.fat + item.fat,
    //           }),
    //           {
    //             calories: 0,
    //             protein: 0,
    //             carbs: 0,
    //             fat: 0,
    //           },
    //         );

    //         return (
    //           <article key={meal.id} className="rounded-xl border border-white/10 p-4">
    //             <div className="flex items-start justify-between gap-4">
    //               <div>
    //                 <p className="text-sm text-blue-400">{meal.mealType ? mealTypeLabels[meal.mealType] : '🍴 Måltid'}</p>

    //                 <h3 className="mt-1 font-semibold">{meal.name}</h3>

    //                 <p className="mt-1 text-sm text-muted-foreground">{meal.items.map((item) => item.food.name).join(' · ')}</p>
    //               </div>

    //               <div className="text-right">
    //                 <p className="text-lg font-bold text-blue-400">{Math.round(totals.calories)} kcal</p>
    //               </div>
    //             </div>

    //             <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/10 pt-4 text-center">
    //               <div>
    //                 <p className="font-semibold">{Math.round(totals.calories)}</p>
    //                 <p className="text-xs text-muted-foreground">kcal</p>
    //               </div>

    //               <div>
    //                 <p className="font-semibold">{Math.round(totals.protein)}g</p>
    //                 <p className="text-xs text-muted-foreground">Protein</p>
    //               </div>

    //               <div>
    //                 <p className="font-semibold">{Math.round(totals.carbs)}g</p>
    //                 <p className="text-xs text-muted-foreground">Kolhydrater</p>
    //               </div>

    //               <div>
    //                 <p className="font-semibold">{Math.round(totals.fat)}g</p>
    //                 <p className="text-xs text-muted-foreground">Fett</p>
    //               </div>
    //             </div>

    //             <div className="mt-4 space-y-2">
    //               {meal.items.map((item) => (
    //                 <div key={item.id} className="flex justify-between text-sm text-muted-foreground">
    //                   <span>
    //                     {item.food.name} · {item.grams} g
    //                   </span>

    //                   <span>{Math.round(item.calories)} kcal</span>
    //                 </div>
    //               ))}
    //             </div>
    //           </article>
    //         );
    //       })}
    //     </div>
    //   )}
    // </section>
  );
}
