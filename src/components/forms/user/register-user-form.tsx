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
import FormStyles from './form.module.css';
import buttonStyles from '@/components/button/button.module.css';

//Link
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';

//Services
import AuthService from '@/services/auth-service';
import GoalService from '@/services/goal-service';

//Providers
import { useAuth } from '@/provider/auth-provider';

//Dtos
import RegisterUserDto from '@/dto/register-user-dto';

export default function RegisterForm() {
  interface GoalType {
    id: number;
    title: string;
  }

  const router = useRouter();
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const { refreshUser } = useAuth();

  //Get all goals
  useEffect(() => {
    async function loadGoals() {
      try {
        const goals = await GoalService.getAll();
        if (goals.length === 0) {
          toast.warning('Det finns inga mål ännu.');
        }
        setGoals(goals);
      } catch (error) {
        console.error(error);
      }
    }

    loadGoals();
  }, []);

  const [formData, setFormData] = useState<RegisterUserDto>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bodyWeight: 0,
    bodyLenght: 0,
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

    if (goals.length === 0) {
      toast.warning('Något är fel, inga mål finns.');
      return;
    }

    const userData: RegisterUserDto = {
      email: formData.email,
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      bodyWeight: Number(formData.bodyWeight),
      gender: formData.gender,
      bodyLenght: Number(formData.bodyLenght),
      birthDate: formData.birthDate,
      goalTypeId: Number(formData.goalTypeId),
      goalWeight: Number(formData.goalWeight),
      goalDate: formData.goalDate,
      password: formData.password,
    };

    try {
      const result = await AuthService.register(userData);

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
    } catch (error: unknown) {
      toast.error('Något gick fel, kontot kunde inte registreras');
    }
  };

  return (
    <form className={FormStyles.form} onSubmit={handleSumbit}>
      <div className={FormStyles.formWrapper}>
        <h1 className={FormStyles.formTitle}>
          Registera
          <span> Konto</span>
        </h1>
        {errorMessages.length > 0 && (
          <div className={FormStyles.formErrorMessage}>
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
      <div className={FormStyles.formGrid}>
        <div className="form-left">
          {/* EMAIL */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaEnvelope className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="email">
                Email
              </label>
            </div>
            <input
              className={FormStyles.formInput}
              name="email"
              type="email"
              id="email"
              required
              placeholder="E-post..."
              onChange={handleChange}
            />
          </div>

          {/* USERNAME */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaUser className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="username">
                Användarnamn
              </label>
            </div>
            <input
              className={FormStyles.formInput}
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
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaSignature className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="firstName">
                Namn
              </label>
            </div>
            <input
              className={FormStyles.formInput}
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
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaSignature className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="lastName">
                Efternamn
              </label>
            </div>
            <input
              className={FormStyles.formInput}
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
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaPhone className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="phoneNumber">
                Nummer
              </label>
            </div>
            <input
              className={FormStyles.formInput}
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
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaWeightScale className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="weight">
                Kroppsvikt (kg)
              </label>
            </div>
            <input
              className={FormStyles.formInput}
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
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaLock className={FormStyles.formIcon} />
              <label htmlFor="password" className={FormStyles.formLabel}>
                Lösenord
              </label>
            </div>
            <input
              className={FormStyles.formInput}
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
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaRulerVertical className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="lenght">
                Längd (cm)
              </label>
            </div>
            <input
              className={FormStyles.formInput}
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
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaMars className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="gender">
                Kön
              </label>
            </div>
            <select
              className={FormStyles.formSelect}
              id="gender"
              name="gender"
              onChange={handleChange}
            >
              <option value="">Välj kön</option>
              <option value={Gender.MALE}>Man</option>
              <option value={Gender.FEMALE}>Kvinna</option>
              <option value={Gender.OTHER}>Annat</option>
            </select>
          </div>

          {/* Birth */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaCakeCandles className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="birthDate">
                Född
              </label>
            </div>
            <input
              className={FormStyles.formInput}
              name="birthDate"
              type="date"
              id="birthDate"
              placeholder="1997-09-26"
              onChange={handleChange}
            />
          </div>

          {/* Goal */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaBullseye className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="goal">
                Mål
              </label>
            </div>
            <select
              className={FormStyles.formSelect}
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
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaWeightHanging className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="goalWeight">
                Mål vikt (kg)
              </label>
            </div>
            <input
              className={FormStyles.formInput}
              name="goalWeight"
              type="number"
              step="0.1"
              placeholder="Ex: 75"
              id="goalWeight"
              onChange={handleChange}
            />
          </div>

          {/* Goal Date */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaFlagCheckered className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="goalDate">
                Måldatum
              </label>
            </div>
            <input
              className={FormStyles.formInput}
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
