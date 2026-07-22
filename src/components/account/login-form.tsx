'use client';

//React Routing
import { useState } from 'react';
import { useRouter } from 'next/navigation';

//FONTAWSOME ICONS
import { FaEnvelope, FaLock, FaDumbbell } from 'react-icons/fa6';

//Link
import Link from 'next/link';

//Providers
import { useAuth } from '../../provider/auth-provider';

//CSS
import styles from './form.module.css';
import buttonStyles from '@/components/button/button.module.css';

//Components
import Button from '@/components/button/button';

//Services
import AuthService from '@/services/user.service';

//Toast Alert
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  interface LoginFormData {
    email: string;
    password: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const LoginData: LoginFormData = {
      email: email,
      password: password,
    };

    const response = await AuthService.login(LoginData);
    const data = await response.json();

    if (!data.response.success) {
      const errorMessages: string[] = data.response.errors;

      errorMessages.forEach((message: string) => {
        toast.error(message);
      });

      return;
    }

    localStorage.setItem('token', data.response.userToken);
    refreshUser();
    router.refresh();
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} mx-auto`}>
      <div className={styles.formWrapper}>
        <FaDumbbell className="label-icon dumbell" />
        <h1 className={styles.formTitle}>
          Gym
          <span>Tracker</span>
        </h1>
      </div>
      <div className={styles.formGroup}>
        <div className="flex items-center gap-4">
          <FaEnvelope className={styles.formIcon} />
          <label htmlFor="email" className={styles.formLabel}>
            E-mail
          </label>
        </div>
        <input
          className={styles.formInput}
          required
          type="text"
          placeholder="E-mail.."
          id="email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
      </div>
      <div className={styles.formGroup}>
        <div className="flex items-center gap-4">
          <FaLock className={styles.formIcon} />
          <label htmlFor="email" className={styles.formLabel}>
            Lösenord
          </label>
        </div>
        <input
          className={styles.formInput}
          required
          type="password"
          id="password"
          placeholder="Lösenord.."
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      <div className="grid grid-2">
        <Button type="submit" text="Logga in" variant="primary"></Button>
        <Link href="/login" className={`${buttonStyles.button} ${buttonStyles.secondary}`}>
          Gå tillbaks
        </Link>
      </div>
    </form>
  );
}
