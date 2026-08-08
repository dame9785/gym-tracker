'use client';

//React Routing & Hooks
import { useState } from 'react';
import { useRouter } from 'next/navigation';

//Types
import { LoginDto } from '@/schemas/auth-schemas';

//FONTAWSOME ICONS
import { FaEnvelope, FaLock, FaDumbbell } from 'react-icons/fa6';

//Link
import Link from 'next/link';

//CSS Modules & Styling
import styles from '@/components/forms/form.module.css';
import buttonStyles from '@/components/button/button.module.css';

//Components
import Button from '@/components/button/button';
import LoadingSpinner from '@/components/loading-spinner';

//Services
import AuthService from '@/services/auth-service';

//Toast Alert
import { toast } from 'sonner';

//Auth schema zod validation
import { loginSchema } from '@/schemas/auth-schemas';

export default function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});

    const loginData = {
      email,
      password,
    } satisfies LoginDto;

    const validation = loginSchema.safeParse(loginData);
    if (!validation.success) {
      const fieldErrors = Object.fromEntries(
        validation.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
      );

      setErrors(fieldErrors);
      return;
    }

    try {
      const result = await AuthService.login(validation.data);

      if (!result.success) {
        setErrors(result.fieldErrors ?? {});
        toast.error(result.message || 'Kunde inte logga in.');
        return;
      }
      toast.success('Inloggning lyckades');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Ett oväntat fel inträffade vid inloggningen.');
    } finally {
      setIsLoading(false);
    }
  };

  //Show Loading spinner if loading is true or user is null
  if (isLoading) {
    return <LoadingSpinner />;
  }

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
          type="email"
          name="email"
          placeholder="E-mail.."
          autoComplete="email"
          id="email"
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: '' }));
          }}
        ></input>
        {errors.email && <span className={styles.fieldErrorMessage}>{errors.email}</span>}
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
          type="password"
          name="password"
          id="password"
          autoComplete="current-password"
          placeholder="Lösenord.."
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: '' }));
          }}
        ></input>
        {errors.password && <span className={styles.fieldErrorMessage}>{errors.password}</span>}
      </div>
      <div className="grid grid-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingSpinner /> : 'Logga in'}
        </Button>
        <Link href="/login" className={`${buttonStyles.button} ${buttonStyles.secondary}`}>
          Gå tillbaks
        </Link>
      </div>
      <div className="mt-5">
        <Link href="/account/register">Registera konto</Link>
      </div>
    </form>
  );
}
