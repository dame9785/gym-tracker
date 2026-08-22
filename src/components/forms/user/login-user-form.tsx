'use client';

// React
import { useState } from 'react';

// Next.js
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Types
import type { LoginDto } from '@/schemas/auth-schemas';

// Icons
import { FaEnvelope, FaLock, FaDumbbell } from 'react-icons/fa6';

// CSS
import styles from '@/components/forms/form.module.css';
import buttonStyles from '@/components/button/button.module.css';

// Components
import Button from '@/components/button/button';

// Services
import AuthService from '@/services/auth-service';

// Toast
import { toast } from 'sonner';

// Schemas
import { loginSchema } from '@/schemas/auth-schemas';

//Helpers
import { ErrorsHelper } from '@/helpers/error-helper';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginDto, string>>>({});

  //Routing
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    } satisfies LoginDto;

    // ZOD Validation
    const validation = loginSchema.safeParse(loginData);

    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<LoginDto>(validation.error.issues));
      return;
    }

    // Start loading only after validation succeeds
    setIsLoading(true);
    setErrors({});

    try {
      const result = await AuthService.login(validation.data);

      if (!result.success) {
        if (result.errors) {
          setErrors(ErrorsHelper.getFormErrorsFromApi<LoginDto>(result.errors));
        }

        toast.error(result.message);
        return;
      }

      toast.success('Inloggning lyckades');
      router.replace('/dashboard');
    } catch (error) {
      toast.error('Ett oväntat fel inträffade vid inloggningen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} mx-auto`}>
      <div className={styles.formWrapper}>
        <h1 className={styles.formTitle}>
          Gym
          <span>Tracker</span>
        </h1>
        <FaDumbbell className={styles.formIcon} />
      </div>

      {/* Email */}
      <div className={styles.formGroup}>
        <div className={styles.labelWrapper}>
          <FaEnvelope className={styles.formIcon} />

          <label className={styles.formLabel} htmlFor="email">
            E-mail
          </label>
        </div>

        <input
          className={styles.formInput}
          type="email"
          name="email"
          id="email"
          placeholder="E-mail..."
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({
              ...prev,
              email: undefined,
            }));
          }}
        />
        {errors.email && <p className={styles.fieldErrorMessage}>{errors.email}</p>}
      </div>

      {/* Password */}
      <div className={styles.formGroup}>
        <div className={styles.labelWrapper}>
          <FaLock className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="password">
            Lösenord
          </label>
        </div>

        <input
          className={styles.formInput}
          type="password"
          name="password"
          id="password"
          placeholder="Lösenord..."
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({
              ...prev,
              password: undefined,
            }));
          }}
        />
        {errors.password && <p className={styles.fieldErrorMessage}>{errors.password}</p>}
      </div>

      {/* Login button */}
      <div className="grid grid-1">
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Loggar in...' : 'Logga in'}
        </Button>
      </div>

      {/* Register */}
      <div className="flex justify-center mt-10">
        <Link href="/account/register" className="border-b border-solid p-2 border-amber-500 hover:text-amber-600">
          Registrera konto
        </Link>
      </div>
    </form>
  );
}
