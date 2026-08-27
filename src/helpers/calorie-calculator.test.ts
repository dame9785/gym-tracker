import { calculateCalories } from '@/helpers/calorie-calculator';

const result = calculateCalories({
  weight: 71.5,
  height: 180,
  age: 25,
  gender: 'MALE',
  activityLevel: 'MODERATE',
});

console.log(result);
