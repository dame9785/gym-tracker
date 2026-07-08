'use client';

//React Routing
import { useState } from 'react';
import { useRouter } from 'next/navigation';

//FONTAWSOME ICONS
import { FaEnvelope, FaLock, FaDumbbell } from 'react-icons/fa6';

//Link
import Link from 'next/link';

//Auth
import { useAuth } from '../../provider/AuthProvider';

//CSS
import styles from './Form.module.css';

function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
      router.refresh();
      refreshUser();
    } else {
      alert(data.message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
        <div className="flex items-center items-center gap-4">
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
        <button type="submit" className="btn btn-primary text-center">
          Logga in
        </button>
        <Link href="/register" className="btn btn-secondary text-center">
          Registera konto
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;
