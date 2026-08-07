//Types
import type { LogWeightDto, LogWeightResponse } from '@/types/log-weight-types';

//Next Redirect
import { redirect } from 'next/navigation';

export class LogWeightService {
  static async getAll(): Promise<LogWeightResponse | string> {
    try {
      const response = await fetch('/api/log-weight', {
        method: 'GET',
      });

      const result = await response.json();
      if (!result) {
        throw new Error('Nåogit gick fel');
      }
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }

  static async delete(id: number) {
    try {
      const response = await fetch(`/api/log-weight/${id}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
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
      const message = error instanceof Error ? error.message : 'Ett oväntat fel inträffade';
      redirect(`/error?message=${encodeURIComponent(message)}`);
    }
  }
}
