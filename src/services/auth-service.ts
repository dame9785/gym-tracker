import { RegisterUserDto } from '@/dto/register-user-dto';

export default class AuthService {
  //Register
  static async register(dto: RegisterUserDto) {
    const response = fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    return (await response).json();
  }
}
