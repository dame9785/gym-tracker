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

interface UpdateUserFormData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bodyWeight: number;
  bodyLenght: number;
  birthDate: string;
  goalWeight: number;
  goalDate: string;
  goalTypeId: number;
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

    console.log('Response', response);
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

  //GET: User By Token
  async getUserByToken(token: string) {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Failed', error);
    }
  },

  //GET: User by ID
  async getUserById(userId: string) {
    const response = await fetch('/api/auth/setting/' + userId, {
      method: 'GET',
    });

    return response.json();
  },

  //PUT: User
  async updateUser(userData: UpdateUserFormData, userId: string) {
    const response = await fetch('/api/auth/update/' + userId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return await response.json();
  },
};

export default AuthService;
