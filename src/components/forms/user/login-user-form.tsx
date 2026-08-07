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

//Providers
import { useAuth } from '@/provider/auth-provider';

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

export default function LoginForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Show loading spinner
    setIsLoading(true);

    const loginData = {
      email,
      password,
    } satisfies LoginDto;

    try {
      const result = await AuthService.login(loginData);

      if (!result.success) {
        setErrors(result.fieldErrors ?? {});

        toast.error('Något gick fel, gick inte logga in');
        return;
      }

      localStorage.setItem('token', result.userToken ?? '');
      await refreshUser();

      router.refresh();
      router.push('/');
    } catch (error) {
      toast.error('Något gick fel, kontot kunde ej loggas in');
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
        <input className={styles.formInput} required type="text" placeholder="E-mail.." id="email" onChange={(e) => setEmail(e.target.value)}></input>
        {errors.email && <p className={styles.fieldErrorMessage}>{errors.email}</p>}
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
        {errors.password && <p className={styles.fieldErrorMessage}>{errors.password}</p>}
      </div>
      <div className="grid grid-2">
        <Button type="submit" text="Logga in" variant="primary"></Button>
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
