'use client';

//React Routing
import { useState } from 'react';
import { useRouter } from 'next/navigation';

//FONTAWSOME ICONS
import { FaEnvelope, FaLock, FaDumbbell } from 'react-icons/fa6';

//Link
import Link from 'next/link';

//Auth
import { useAuth } from '../provider/AuthProvider';

//CSS
import '../form.css';

export default function Login() {
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
    <div className="container">
      <div className="form-wrapper flex justify-center items-center">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-intro-wrapper flex flex-col items-center mb-[3rem]">
            <FaDumbbell className="label-icon dumbell" />
            <h1>
              Gym
              <span>Tracker</span>
            </h1>
          </div>
          <div className="form-group flex flex-col gap-[10px] mb-[2rem]">
            <div className="flex items-center gap-4">
              <FaEnvelope className="label-icon" />
              <label htmlFor="email">E-mail</label>
            </div>
            <input
              required
              type="text"
              placeholder="E-mail.."
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="form-group flex flex-col gap-[10px] mb-[2rem]">
            <div className="flex items-center items-center gap-4">
              <FaLock className="label-icon" />
              <label htmlFor="email">Lösenord</label>
            </div>
            <input
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
      </div>
    </div>
  );
}
