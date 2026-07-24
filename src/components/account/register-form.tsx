'use client';

//FONTAWSOME ICONS
import {
  FaEnvelope,
  FaWeightScale,
  FaPhone,
  FaRulerVertical,
  FaMars,
  FaCakeCandles,
  FaBullseye,
  FaWeightHanging,
  FaFlagCheckered,
  FaUser,
  FaSignature,
  FaLock,
} from 'react-icons/fa6';

//Gender Enum
import { Gender } from '@prisma/client';

//Toast Alert
import { toast } from 'sonner';

//Components
import Button from '@/components/button/button';

//CSS
import styles from './form.module.css';
import buttonStyles from '@/components/button/button.module.css';

//Link
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';

//Services
import { getGoals } from '@/services/goal.service';
import authService from '@/services/user.service';

//Providers
import { useAuth } from '@/provider/auth-provider';

export default function RegisterForm() {
  interface GoalType {
    id: number;
    title: string;
  }

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

  const router = useRouter();
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const { refreshUser } = useAuth();

  //Get all goals
  useEffect(() => {
    async function loadGoals() {
      try {
        const data = await getGoals();

        setGoals(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadGoals();
  }, []);

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    weight: 0,
    lenght: 0,
    gender: Gender.MALE,
    birthDate: '',
    goalTypeId: 0,
    goalWeight: 0,
    goalDate: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData: RegisterFormData = {
      email: formData.email,
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      weight: Number(formData.weight),
      gender: formData.gender,
      lenght: Number(formData.lenght),
      birthDate: formData.birthDate,
      goalTypeId: Number(formData.goalTypeId),
      goalWeight: Number(formData.goalWeight),
      goalDate: formData.goalDate,
      password: formData.password,
    };

    try {
      const result = await authService.register(userData);

      if (!result.success) {
        setErrorMessages(result.errors);
        toast.error('Användaren skapades inte!');
        return;
      }

      toast.success('Användaren registrerades!');
      localStorage.setItem('token', result.userToken);
      refreshUser();

      setTimeout(() => {
        router.push('/account/settings');
      }, 1000);
    } catch (error: unknown) {}
  };

  return (
    <form className={styles.form} onSubmit={handleSumbit}>
      <div className={styles.formWrapper}>
        <h1 className={styles.formTitle}>
          Registera
          <span> Konto</span>
        </h1>
        {errorMessages.length > 0 && (
          <div className={styles.formErrorMessage}>
            <ul>
              {errorMessages.map((error) => (
                <li key={error}>
                  {'-'}
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.formGrid}>
        <div className="form-left">
          {/* EMAIL */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaEnvelope className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="email">
                Email
              </label>
            </div>
            <input
              className={styles.formInput}
              name="email"
              type="email"
              id="email"
              required
              placeholder="E-post..."
              onChange={handleChange}
            />
          </div>

          {/* USERNAME */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaUser className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="username">
                Användarnamn
              </label>
            </div>
            <input
              className={styles.formInput}
              name="username"
              type="text"
              id="username"
              maxLength={20}
              required
              placeholder="Användarnamn..."
              onChange={handleChange}
            />
          </div>

          {/* NAME */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaSignature className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="firstName">
                Namn
              </label>
            </div>
            <input
              className={styles.formInput}
              name="firstName"
              type="text"
              id="firstName"
              maxLength={20}
              required
              placeholder="Namn..."
              onChange={handleChange}
            />
          </div>

          {/* LAST NAME */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaSignature className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="lastName">
                Efternamn
              </label>
            </div>
            <input
              className={styles.formInput}
              name="lastName"
              type="text"
              maxLength={50}
              id="lastName"
              required
              placeholder="Efternamn..."
              onChange={handleChange}
            />
          </div>

          {/* PHONE */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaPhone className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="phoneNumber">
                Nummer
              </label>
            </div>
            <input
              className={styles.formInput}
              name="phoneNumber"
              type="tel"
              id="phoneNumber"
              maxLength={15}
              required
              placeholder="Telefonnummer..."
              onChange={handleChange}
            />
          </div>

          {/* Body Weight */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaWeightScale className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="weight">
                Kroppsvikt (kg)
              </label>
            </div>
            <input
              className={styles.formInput}
              name="weight"
              type="number"
              step="0.1"
              id="weight"
              required
              placeholder="Ex (40.2kg)"
              onChange={handleChange}
            />
          </div>
          {/* PASSWORD */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaLock className={styles.formIcon} />
              <label htmlFor="password" className={styles.formLabel}>
                Lösenord
              </label>
            </div>
            <input
              className={styles.formInput}
              name="password"
              type="password"
              id="password"
              required
              placeholder="Lösenord..."
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-right">
          {/* Body lenght */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaRulerVertical className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="lenght">
                Längd (cm)
              </label>
            </div>
            <input
              className={styles.formInput}
              name="lenght"
              type="number"
              step="0.1"
              id="lenght"
              required
              placeholder="Ex (150.5cm)"
              onChange={handleChange}
            />
          </div>

          {/* GENDER */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaMars className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="gender">
                Kön
              </label>
            </div>
            <select className={styles.formSelect} id="gender" name="gender" onChange={handleChange}>
              <option value="">Välj kön</option>
              <option value={Gender.MALE}>Man</option>
              <option value={Gender.FEMALE}>Kvinna</option>
              <option value={Gender.OTHER}>Annat</option>
            </select>
          </div>

          {/* Birth */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaCakeCandles className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="birthDate">
                Född
              </label>
            </div>
            <input
              className={styles.formInput}
              name="birthDate"
              type="date"
              id="birthDate"
              placeholder="1997-09-26"
              onChange={handleChange}
            />
          </div>

          {/* Goal */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaBullseye className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="goal">
                Mål
              </label>
            </div>
            <select
              className={styles.formSelect}
              name="goalTypeId"
              value={formData.goalTypeId}
              onChange={handleChange}
            >
              <option value="">Välj mål</option>

              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>

          {/* Goal weight*/}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaWeightHanging className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="goalWeight">
                Mål vikt (kg)
              </label>
            </div>
            <input
              className={styles.formInput}
              name="goalWeight"
              type="number"
              step="0.1"
              placeholder="Ex: 75"
              id="goalWeight"
              onChange={handleChange}
            />
          </div>

          {/* Goal Date */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaFlagCheckered className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="goalDate">
                Måldatum
              </label>
            </div>
            <input
              className={styles.formInput}
              name="goalDate"
              type="date"
              id="goalDate"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-2">
        <Button type="submit" text="Skapa konto" variant="primary"></Button>
        <Link href="/login" className={`${buttonStyles.button} ${buttonStyles.secondary}`}>
          Gå tillbaks
        </Link>
      </div>
    </form>
  );
}
