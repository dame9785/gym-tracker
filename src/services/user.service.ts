//Gender Enum
import { Gender } from '@prisma/client';

interface RegisterFormData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  weight: number;
  lenght: number;
  gender: Gender;
  birthDate: string;
  goalTypeId: number;
  goalWeight: number;
  goalDate: string;
  password: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

const AuthService = {
  //Login
  async login(data: LoginFormData) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response;
  },

  //Register User
  async register(data: RegisterFormData) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  },
};

export default AuthService;
