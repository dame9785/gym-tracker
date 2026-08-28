'use client';

import { Flame, Activity, User, Ruler, Weight, Calendar, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { calculateNutrition } from '@/helpers/nutrition-calculator';
import { calculateAge } from '@/helpers/calculate-age';

import type { UserViewModel } from '@/types/user-types';
import type { CalorieCalculatorResult, CalorieGoal, NutritionGoal, NutritionLogInput } from '@/types/calorie-types';

import CalorieService from '@/services/calories-service';
import MealService from '@/services/meal-service';

import { getCalorieGoalStats } from '@/data/calorie-goals';

import ProfileStats from '@/components/calories/profile-stats';

const mealService = new MealService();

type Props = {
  user: UserViewModel;
  calorieStats: CalorieCalculatorResult;
  userToken: string;
  initialNutritionGoal: NutritionGoal;
};

export default function Calculator({ user, calorieStats, userToken, initialNutritionGoal }: Props) {
  const age = calculateAge(user.birthDate);

  // Aktivt mål
  const [selectedGoal, setSelectedGoal] = useState<CalorieGoal>(initialNutritionGoal.calorieGoal);

  // Sparat näringsmål
  const [nutritionGoal, setNutritionGoal] = useState<NutritionGoal>(initialNutritionGoal);

  // Dagens totala intag från Meals
  const [currentNutrition, setCurrentNutrition] = useState<NutritionLogInput>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // Används för att uppdatera dagens meals
  const [mealRefreshKey, setMealRefreshKey] = useState(0);

  function refreshMeals() {
    setMealRefreshKey((current) => current + 1);
  }

  // Hämta dagens nutrition från Meals
  useEffect(() => {
    async function loadCurrentNutrition() {
      try {
        const result = await mealService.getTodayMeals(userToken);

        console.log('Today meals result:', result);

        if (!result.success || !result.data) {
          setCurrentNutrition({
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          });

          return;
        }

        setCurrentNutrition({
          calories: result.data.totals.calories,
          protein: result.data.totals.protein,
          carbs: result.data.totals.carbs,
          fat: result.data.totals.fat,
        });
      } catch (error) {
        console.error('Kunde inte hämta dagens näringsintag:', error);
      }
    }

    void loadCurrentNutrition();
  }, [userToken, mealRefreshKey]);

  const stats = getCalorieGoalStats(calorieStats);

  const selectedCalories =
    nutritionGoal.calories ??
    (selectedGoal === 'WEIGHT_LOSS'
      ? calorieStats.weightLossCalories
      : selectedGoal === 'MUSCLE_GAIN'
        ? calorieStats.muscleGainCalories
        : calorieStats.maintenanceCalories);

  // Dagens totalsumma kommer ENDAST från Meals
  const totalNutritionToday = {
    calories: currentNutrition.calories,
    protein: currentNutrition.protein,
    carbs: currentNutrition.carbs,
    fat: currentNutrition.fat,
  };

  const progressPercentage = selectedCalories > 0 ? Math.min(Math.round((totalNutritionToday.calories / selectedCalories) * 100), 100) : 0;

  const caloriesRemaining = Math.max(0, selectedCalories - totalNutritionToday.calories);

  const goalLabels: Record<CalorieGoal, string> = {
    WEIGHT_LOSS: 'Gå ner i vikt',
    MAINTENANCE: 'Behåll vikt',
    MUSCLE_GAIN: 'Gå upp i vikt',
  };

  async function handleGoalChange(goal: CalorieGoal) {
    const goalCalories =
      goal === 'WEIGHT_LOSS' ? calorieStats.weightLossCalories : goal === 'MUSCLE_GAIN' ? calorieStats.muscleGainCalories : calorieStats.maintenanceCalories;

    const nutrition = calculateNutrition({
      weight: Number(user.bodyWeight),
      calories: goalCalories,
      goal,
    });

    const newNutritionGoal: NutritionGoal = {
      calorieGoal: goal,
      calories: nutrition.calories ?? 0,
      protein: nutrition.protein ?? 0,
      carbs: nutrition.carbs ?? 0,
      fat: nutrition.fat ?? 0,
    };

    const response = await CalorieService.updateCalorieGoal(newNutritionGoal, userToken);
    if (!response.success) {
      toast.error('Kunde inte spara ditt näringsmål');
      return;
    }

    setSelectedGoal(goal);
    setNutritionGoal(newNutritionGoal);

    toast.success('Näringsmål uppdaterat!');
  }

  return (
    <main className="min-h-screen px-4 py-8 text-white md:px-6 md:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10">
              <Flame className="size-5 text-orange-400" />
            </div>

            <span className="text-sm font-medium text-slate-300">{user.username}</span>

            <span className="text-xs font-semibold tracking-[0.2em] text-blue-400">NUTRITION</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Kalorikalkylator</h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            En uppskattning av ditt dagliga kaloribehov baserat på din vikt, längd, ålder, kön och aktivitetsnivå.
          </p>
        </header>

        {/* Profile */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
              <User className="size-6 text-blue-400" />
            </div>

            <div className="flex-1">
              <p className="text-sm text-slate-400">Beräkning baserad på</p>

              <h2 className="mt-1 text-lg font-semibold">Dina nuvarande uppgifter</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ProfileStats icon={<Weight />} label="Vikt" value={`${Number(user.bodyWeight)} kg`} />

              <ProfileStats icon={<Ruler />} label="Längd" value={`${Number(user.height)} cm`} />

              <ProfileStats icon={<Calendar />} label="Ålder" value={`${age} år`} />

              <ProfileStats icon={<Activity />} label="Kön" value={user.gender === 'MALE' ? 'Man' : user.gender === 'FEMALE' ? 'Kvinna' : 'Annat'} />
            </div>
          </div>
        </section>

        {/* Goals */}
        <section className="rounded-2xl border border-white/10 bg-white/3 p-6 shadow-2xl backdrop-blur md:p-7">
          <div className="mb-6">
            <p className="text-sm font-medium text-blue-400">REKOMMENDERAT INTAG</p>

            <h2 className="mt-1 text-2xl font-bold">Välj ditt mål</h2>

            <p className="mt-2 text-sm text-slate-400">Klicka på ett mål för att använda det som ditt aktiva kalorimål.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              const isSelected = selectedGoal === stat.goal;

              return (
                <button
                  key={stat.title}
                  type="button"
                  onClick={() => handleGoalChange(stat.goal)}
                  className={`group rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1 ${
                    isSelected ? stat.activeClass : stat.borderClass
                  }`}
                >
                  <div className={`mb-5 flex size-11 items-center justify-center rounded-xl ${stat.iconClass}`}>
                    <Icon className="size-5" />
                  </div>

                  <p className="text-sm text-slate-400">{stat.title}</p>

                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-2xl font-bold">
                      {Math.round(selectedGoal === stat.goal && nutritionGoal.calories !== null ? nutritionGoal.calories : stat.calories).toLocaleString(
                        'sv-SE',
                      )}
                    </span>

                    <span className="text-sm text-slate-400">kcal</span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-500">{stat.description}</p>

                  {isSelected && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-white">
                      <Target className="size-4" />
                      Aktivt mål
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Today's intake */}
        <section className="mt-6 rounded-2xl border border-blue-500/20 bg-linear-to-br from-blue-500/10 via-transparent to-transparent p-6 shadow-2xl md:p-7">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-medium text-blue-400">DAGENS INTAG</p>

              <h2 className="mt-2 text-4xl font-bold tracking-tight">
                {totalNutritionToday.calories.toLocaleString('sv-SE')}

                <span className="ml-2 text-lg font-normal text-slate-400">kcal</span>
              </h2>

              <p className="mt-3 text-sm text-slate-400">Aktivt mål: {goalLabels[selectedGoal]}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 px-5 py-4 text-right">
              <p className="text-xs text-slate-400">Dagens mål</p>

              <p className="mt-1 text-xl font-bold text-blue-400">{Math.round(selectedCalories).toLocaleString('sv-SE')} kcal</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-400">Dagens framsteg</span>

              <span className="font-semibold">{progressPercentage}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 p-4">
            {totalNutritionToday.calories >= selectedCalories ? (
              <>
                <p className="font-semibold text-green-400">🎉 Du har uppnått ditt kalorimål!</p>

                <p className="mt-1 text-sm text-slate-400">Du har ätit {totalNutritionToday.calories.toLocaleString('sv-SE')} kcal idag.</p>
              </>
            ) : (
              <>
                <p className="font-semibold text-blue-400">Du har {caloriesRemaining.toLocaleString('sv-SE')} kcal kvar</p>

                <p className="mt-1 text-sm text-slate-400">Fortsätt logga ditt kaloriintag under dagen.</p>
              </>
            )}
          </div>
        </section>

        {/* BMR */}
        <section className="relative mt-6 overflow-hidden rounded-2xl border border-orange-500/20 bg-linear-to-br from-orange-500/10 via-transparent to-transparent p-6 shadow-2xl md:p-7">
          <div className="absolute -right-8 -top-8 opacity-10">
            <Flame className="size-40" />
          </div>

          <div className="relative">
            <div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-orange-500/10">
              <Flame className="size-6 text-orange-400" />
            </div>

            <p className="text-sm font-medium text-orange-400">BASALOMSÄTTNING</p>

            <h2 className="mt-1 text-xl font-semibold">Din BMR</h2>

            <div className="my-6">
              <span className="text-5xl font-bold tracking-tight">{Math.round(calorieStats.bmr).toLocaleString('sv-SE')}</span>

              <span className="ml-2 text-sm text-slate-400">kcal / dag</span>
            </div>

            <div className="border-t border-white/10 pt-5">
              <p className="text-sm leading-6 text-slate-400">
                Detta är den uppskattade mängden energi din kropp behöver i vila för att upprätthålla grundläggande funktioner.
              </p>
            </div>
          </div>
        </section>

        {/* Information */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/2 p-5">
          <div className="flex gap-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
              <Activity className="size-5 text-blue-400" />
            </div>

            <div>
              <h3 className="font-semibold">Observera</h3>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Kaloriberäkningen är en uppskattning och ditt faktiska energibehov kan variera beroende på träningsintensitet, vardagsaktivitet och
                kroppssammansättning.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
