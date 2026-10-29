'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaDumbbell } from 'react-icons/fa6';
import { toast } from 'sonner';

import type { LoginDto } from '@/schemas/auth-schemas';
import { loginUserAction } from '@/actions/user-actions';
import Button from '@/components/button/button';
import styles from '@/components/forms/form.module.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const dto = {
      email,
      password,
    } satisfies LoginDto;

    setIsSaving(true);
    setErrors({});

    try {
      const response = await loginUserAction(dto);

      if (!response.success) {
        setErrors(response.errors ?? {});
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Failed to login:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
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
            Email
          </label>
        </div>

        <input
          className={styles.formInput}
          type="email"
          name="email"
          id="email"
          placeholder="Email..."
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {errors.email && <p className={styles.fieldErrorMessage}>{errors.email.join(', ')}</p>}
      </div>

      {/* Password */}
      <div className={styles.formGroup}>
        <div className={styles.labelWrapper}>
          <FaLock className={styles.formIcon} />

          <label className={styles.formLabel} htmlFor="password">
            Password
          </label>
        </div>

        <input
          className={styles.formInput}
          type="password"
          name="password"
          id="password"
          placeholder="Password..."
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {errors.password && <p className={styles.fieldErrorMessage}>{errors.password.join(', ')}</p>}
      </div>

      {/* Login button */}
      <div className="grid grid-1">
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Logging in...' : 'Log in'}
        </Button>
      </div>

      {/* Register */}
      <div className="mt-10 flex justify-center">
        <Link href="/account/register" className="border-b border-solid border-amber-500 p-2 hover:text-amber-600">
          Create an account
        </Link>
      </div>
    </form>
  );
}
