import RegisterExerciseDto from '@/dto/register-exercise.dto';

export default class ExerciseService {
  static async register(dto: RegisterExerciseDto) {
    try {
      const response = fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      if ((await response).ok) {
        return 'Något gick fel';
      }

      return (await response).json();
    } catch (error) {
      return 'Något gick fel';
    }
  }
}
