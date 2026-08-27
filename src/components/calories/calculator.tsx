'use client';

import { Flame, Activity, User, Ruler, Weight, Calendar, Target } from 'lucide-react';

import { calculateNutrition } from '@/helpers/nutrition-calculator';
import { useEffect, useState } from 'react';

import type { UserViewModel } from '@/types/user-types';

import type { CalorieCalculatorResult, CalorieGoal, CalorieLog, NutritionGoal, NutritionLogInput } from '@/types/calorie-types';

import { formatDate } from '@/helpers/date';
import { calculateAge } from '@/helpers/calculate-age';
import CalorieService from '@/services/calories-service';
import { getCalorieGoalStats } from '@/data/calorie-goals';
import TodayMeals from './today-meals';
import { toast } from 'sonner';

import NutritionInput from '@/components/calories/Nutrition-Input';
import ProfileStats from '@/components/calories/profile-stats';

type Props = {
  user: UserViewModel;
  calorieStats: CalorieCalculatorResult;
  userToken: string;
  initialNutritionGoal: NutritionGoal;
};

export default function Calculator({ user, calorieStats, userToken, initialNutritionGoal }: Props) {
  const age = calculateAge(user.birthDate);
  const [isGoalSelectorOpen, setIsGoalSelectorOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Aktivt mål
  const [selectedGoal, setSelectedGoal] = useState<CalorieGoal>(initialNutritionGoal.calorieGoal);

  // Sparat näringsmål
  const [nutritionGoal, setNutritionGoal] = useState<NutritionGoal>(initialNutritionGoal);

  // Redan sparat näringsintag idag
  const [currentNutrition, setCurrentNutrition] = useState<NutritionLogInput>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // Nytt intag som användaren skriver in
  const [nutritionData, setNutritionData] = useState<NutritionLogInput>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const [mealRefreshKey, setMealRefreshKey] = useState(0);

  function refreshMeals() {
    setMealRefreshKey((current) => current + 1);
  }

  // Historik
  const [history, setHistory] = useState<CalorieLog[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const stats = getCalorieGoalStats(calorieStats);

  const selectedCalories =
    nutritionGoal.calories ??
    (selectedGoal === 'WEIGHT_LOSS'
      ? calorieStats.weightLossCalories
      : selectedGoal === 'MUSCLE_GAIN'
        ? calorieStats.muscleGainCalories
        : calorieStats.maintenanceCalories);

  // Totalt idag inklusive det användaren håller på att lägga till
  const totalNutritionToday = {
    calories: currentNutrition.calories + nutritionData.calories,
    protein: currentNutrition.protein + nutritionData.protein,
    carbs: currentNutrition.carbs + nutritionData.carbs,
    fat: currentNutrition.fat + nutritionData.fat,
  };

  const progressPercentage = selectedCalories > 0 ? Math.min(Math.round((totalNutritionToday.calories / selectedCalories) * 100), 100) : 0;

  const caloriesRemaining = Math.max(0, selectedCalories - totalNutritionToday.calories);

  const goalLabels: Record<CalorieGoal, string> = {
    WEIGHT_LOSS: 'Gå ner i vikt',
    MAINTENANCE: 'Behåll vikt',
    MUSCLE_GAIN: 'Gå upp i vikt',
  };

  useEffect(() => {
    void loadHistory();
  }, [userToken]);

  async function loadHistory(): Promise<void> {
    try {
      setIsLoadingHistory(true);

      const result = await CalorieService.getHistory(userToken);

      if (result.success && result.data) {
        setHistory(result.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Kunde inte hämta historik');
    } finally {
      setIsLoadingHistory(false);
    }
  }

  useEffect(() => {
    async function loadCurrentNutrition() {
      try {
        const result = await CalorieService.getTodaysNuitration(userToken);

        if (!result.success || !result.data) {
          return;
        }

        // Spara dagens redan loggade totalsumma
        setCurrentNutrition({
          calories: result.data.calories,
          protein: result.data.protein,
          carbs: result.data.carbs,
          fat: result.data.fat,
        });
      } catch (error) {
        console.error('Kunde inte hämta dagens näringsintag:', error);
      }
    }

    void loadCurrentNutrition();
  }, [userToken]);

  async function handleGoalChange(goal: CalorieGoal) {
    const goalCalories =
      goal === 'WEIGHT_LOSS' ? calorieStats.weightLossCalories : goal === 'MUSCLE_GAIN' ? calorieStats.muscleGainCalories : calorieStats.maintenanceCalories;

    const nutrition = calculateNutrition({
      weight: Number(user.bodyWeight),
      calories: goalCalories,
      goal,
    });

    const newNutritionGoal = {
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

    // Collapsa målsektionen
    setIsGoalSelectorOpen(false);

    toast.success('Näringsmål uppdaterat!');
  }

  function handleNutritionChange(field: 'calories' | 'protein' | 'carbs' | 'fat', value: number) {
    setNutritionData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSaveNutrition() {
    try {
      setIsSaving(true);

      // Skickar endast det nya intaget
      const result = await CalorieService.saveNutritionLog(nutritionData, userToken);

      if (!result.success || !result.data) {
        toast.error('Kunde inte spara dagens näringsintag');
        return;
      }

      // Backend returnerar nya totalsumman efter increment
      setCurrentNutrition({
        calories: result.data.calories,
        protein: result.data.protein,
        carbs: result.data.carbs,
        fat: result.data.fat,
      });

      // Nollställ nytt intag
      setNutritionData({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });

      // Uppdatera historiken
      await loadHistory();

      toast.success('Dagens näringsintag sparades!');
    } catch (error) {
      console.error('Kunde inte spara näringsintag:', error);

      toast.error('Något gick fel när intaget skulle sparas');
    } finally {
      setIsSaving(false);
    }
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

        {/* Log today's nutrition */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/3 p-6 shadow-2xl">
          <div className="mb-6">
            <p className="text-sm font-medium text-blue-400">LOGGA INTAG</p>
            <h2 className="mt-1 text-2xl font-bold">Dagens näringsintag</h2>
            <p className="mt-2 text-sm text-slate-400">Lägg till det du har ätit. Värdet läggs till på dagens nuvarande intag.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <NutritionInput id="calories" unit="calories" label="calories" onChange={(value) => handleNutritionChange('calories', value)} />
            <NutritionInput id="carbs" unit="carbs" label="carbs" onChange={(value) => handleNutritionChange('carbs', value)} />
            <NutritionInput id="protein" unit="protein" label="protein" onChange={(value) => handleNutritionChange('protein', value)} />
            <NutritionInput id="fat" unit="fat" label="fat" onChange={(value) => handleNutritionChange('fat', value)} />
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveNutrition}
            className="mt-6  rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? 'Sparar...' : 'Lägg till dagens intag'}
          </button>
        </section>

        {/* History */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/3 p-6">
          <div className="mb-6">
            <p className="text-sm font-medium text-blue-400">HISTORIK</p>
            <h2 className="mt-1 text-2xl font-bold">Näringsintag</h2>
            <p className="mt-2 text-sm text-slate-400">Se ditt intag dag för dag.</p>
          </div>

          {isLoadingHistory ? (
            <p className="text-sm text-slate-400">Hämtar historik...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-slate-400">Ingen historik ännu.</p>
          ) : (
            <div className="space-y-3">
              {history.map((log) => (
                <div key={log.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p>{formatDate(new Date(log.loggedAt))}</p>

                      <p className="mt-1 text-sm text-slate-500">Dagens näringsintag</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold text-orange-400">{log.calories.toLocaleString('sv-SE')} kcal</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-sm">
                    <div>
                      <p className="text-slate-500">Protein</p>

                      <p className="font-semibold">{log.protein} g</p>
                    </div>

                    <div>
                      <p className="text-slate-500">Kolhydrater</p>

                      <p className="font-semibold">{log.carbs} g</p>
                    </div>

                    <div>
                      <p className="text-slate-500">Fett</p>

                      <p className="font-semibold">{log.fat} g</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      <TodayMeals userToken={userToken} />
    </main>
  );
}
