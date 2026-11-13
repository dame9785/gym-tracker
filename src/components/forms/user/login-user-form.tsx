'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaEnvelope, FaLock } from 'react-icons/fa6';
import { Dumbbell } from 'lucide-react';
import FormPageHeader from '@/components/forms/shared/form-page-header';
import { toast } from 'sonner';

import type { LoginDto } from '@/schemas/auth-schemas';
import { loginUserAction } from '@/actions/user-actions';

import Button from '@/components/button/button';
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';

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
        setErrors(Object.fromEntries(Object.entries(response.errors ?? {}).filter((entry): entry is [string, string[]] => entry[1] !== undefined)));
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

  const clearFieldError = (name: string) => {
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[name];
      return updatedErrors;
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} mx-auto`}>
      <FormPageHeader backHref="/" backLabel="Back to home" showBackButton={false} eyebrow="Welcome to GymTracker" title="Sign" highlightedTitle="in" description="Log in to manage your workouts and track your fitness progress." icon={Dumbbell} />

      <div className={styles.formGroup}>
        <FormField
          htmlFor="email"
          label={
            <span className="flex items-center gap-2">
              <FaEnvelope className={styles.formIcon} />
              Email
            </span>
          }
          required
          error={errors.email?.join(', ')}
        >
          <FormInput
            type="email"
            name="email"
            id="email"
            placeholder="Email..."
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError('email');
            }}
            disabled={isSaving}
            aria-invalid={!!errors.email?.length}
            required
          />
        </FormField>
      </div>

      <div className={styles.formGroup}>
        <FormField
          htmlFor="password"
          label={
            <span className="flex items-center gap-2">
              <FaLock className={styles.formIcon} />
              Password
            </span>
          }
          required
          error={errors.password?.join(', ')}
        >
          <FormInput
            type="password"
            name="password"
            id="password"
            placeholder="Password..."
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError('password');
            }}
            disabled={isSaving}
            aria-invalid={!!errors.password?.length}
            required
          />
        </FormField>
      </div>

      <div className={styles.forgotPasswordWrapper}>
        <Link href="/account/forgot-password">Forgot your password?</Link>
      </div>

      <div className="grid-1 grid">
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Logging in...' : 'Log in'}
        </Button>
      </div>

      <div className="mt-10 flex justify-center">
        <Link href="/account/register" className="border-b border-solid border-amber-500 p-2 hover:text-amber-600">
          Create an account
        </Link>
      </div>
    </form>
  );
}
