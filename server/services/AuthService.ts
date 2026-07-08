import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository';
import { generateToken, verifyToken } from '../../lib/jwt';

export class AuthService {
  private userRepository = new UserRepository();

  async register(data: { username: string; email: string; password: string; firstName?: string; lastName?: string }) {
    const existingEmail = await this.userRepository.findByEmail(data.email);

    if (existingEmail) {
      throw new Error('Email already exists.');
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);

    if (existingUsername) {
      throw new Error('Username already exists.');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    return await this.userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      passwordHash,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = generateToken(user.id);

    return {
      user,
      token,
    };
  }

  async getCurrentUser(token: string) {
    const payload = verifyToken(token) as {
      userId: number;
    };

    const user = await this.userRepository.findById(payload.userId);

    if (!user) {
      throw new Error('User not found.');
    }

    return user;
  }
}
