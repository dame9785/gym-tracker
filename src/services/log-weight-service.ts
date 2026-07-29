import { LogWeightDto } from '@/dto/log-weight-dto';
import { LogWeightResponse } from '@/responses/weight-log-response';

export class LogWeightService {
  static async getAll(): Promise<LogWeightResponse | string> {
    try {
      const response = await fetch('/api/log-weight', {
        method: 'GET',
      });

      const result = await response.json();
      console.log(result);
      if (!result) {
        throw new Error('Nåogit gick fel');
      }
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async create(dto: LogWeightDto): Promise<LogWeightResponse | string> {
    try {
      const response = await fetch('/api/log-weight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const error = await response.text();
        return 'Något gick fel.';
        throw new Error(error);
      }
      return (await response.json()) as LogWeightResponse;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
