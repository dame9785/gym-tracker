import type { RegisterUserDto } from '@/dto/user-dtos';
import type { RegisterUserResponse } from '@/responses/user-responses';

const API_URL = '/api/auth/';

export default class AuthService {
  //Register
  static async register(dto: RegisterUserDto): Promise<RegisterUserResponse> {
    try {
      const response = await fetch(API_URL + 'register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      });
      const data = (await response.json()) as RegisterUserResponse;
      console.log(data);
      return data;
    } catch (error) {
      throw new Error();
    }
  }
}
