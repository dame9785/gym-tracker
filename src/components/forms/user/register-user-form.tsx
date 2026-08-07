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
import LoadingSpinner from '@/components/loading-spinner';

//Styling
import FormStyles from '@/components/forms/form.module.css';
import buttonStyles from '@/components/button/button.module.css';

//NEXT & Hooks
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

//Services
import AuthService from '@/services/auth-service';
import GoalService from '@/services/goal-service';

//Providers
import { useAuth } from '@/provider/auth-provider';

//Types
import type { RegisterUserDto } from '@/schemas/auth-schemas';
import type { GoalType } from '@/types/goal-types';

export default function RegisterForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [goals, setGoals] = useState<GoalType[]>([]);
  const { refreshUser } = useAuth();

  //Get all goals
  useEffect(() => {
    async function loadGoals() {
      setIsLoading(true);
      try {
        const goals = await GoalService.getAll();
        if (goals.length === 0) {
          toast.warning('Det finns inga mål ännu.');
        }
        setGoals(goals);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
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
    birthDate: new Date().toISOString().split('T')[0],
    goalTypeId: 0,
    goalWeight: 0,
    goalDate: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let parsedValue: string | number | Date = value;

    switch (name) {
      case 'bodyWeight':
      case 'bodyLenght':
      case 'goalWeight':
      case 'goalTypeId':
        parsedValue = Number(value);
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (goals.length === 0) {
      toast.warning('Något är fel, inga mål finns.');
      return;
    }

    const userData = {
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
    } satisfies RegisterUserDto;

    try {
      const result = await AuthService.register(userData);

      if (!result.success) {
        setErrors(result.fieldErrors ?? {});

        toast.error('Användaren skapades inte!');
        return;
      }

      if (!result.userToken) {
        toast.error('Ingen token returnerades.');
        return;
      }

      localStorage.setItem('token', result.userToken);

      setErrors({});
      toast.success('Användaren registrerades!');

      await refreshUser();
      router.push('/account/settings');
    } catch (error) {
      console.error(error);
      toast.error('Något gick fel, kontot kunde inte registreras.');
    } finally {
      setIsLoading(false);
      router.push('/Dahboard');
    }
  };

  //Show Loading spinner if loading is true or user is null
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form className={FormStyles.form} onSubmit={handleSubmit}>
      <div className={FormStyles.formWrapper}>
        <h1 className={FormStyles.formTitle}>
          Registera
          <span> Konto</span>
        </h1>
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
              value={formData.email}
              placeholder="E-post..."
              onChange={handleChange}
            />
            {errors.email && <p className={FormStyles.fieldErrorMessage}>{errors.email}</p>}
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
              value={formData.username}
              id="username"
              maxLength={20}
              required
              placeholder="Användarnamn..."
              onChange={handleChange}
            />
            {errors.username && <p className={FormStyles.fieldErrorMessage}>{errors.username}</p>}
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
              value={formData.firstName}
              id="firstName"
              maxLength={20}
              required
              placeholder="Namn..."
              onChange={handleChange}
            />
            {errors.firstName && <p className={FormStyles.fieldErrorMessage}>{errors.firstName}</p>}
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
              value={formData.lastName}
              maxLength={50}
              id="lastName"
              required
              placeholder="Efternamn..."
              onChange={handleChange}
            />
            {errors.lastName && <p className={FormStyles.fieldErrorMessage}>{errors.lastName}</p>}
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
              value={formData.phoneNumber}
              maxLength={15}
              required
              placeholder="Telefonnummer..."
              onChange={handleChange}
            />
            {errors.phoneNumber && <p className={FormStyles.fieldErrorMessage}>{errors.phoneNumber}</p>}
          </div>

          {/* Body Weight */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaWeightScale className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="bodyWeight">
                Kroppsvikt (kg)
              </label>
            </div>
            <input
              className={FormStyles.formInput}
              name="bodyWeight"
              type="number"
              step="0.1"
              id="bodyWeight"
              value={formData.bodyWeight}
              required
              placeholder="Ex (40.2kg)"
              onChange={handleChange}
            />
            {errors.bodyWeight && <p className={FormStyles.fieldErrorMessage}>{errors.bodyWeight}</p>}
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
              value={formData.password}
              name="password"
              type="password"
              id="password"
              required
              placeholder="Lösenord..."
              onChange={handleChange}
            />
            {errors.password && <p className={FormStyles.fieldErrorMessage}>{errors.password}</p>}
          </div>
        </div>

        <div className="form-right">
          {/* Body lenght */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaRulerVertical className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="bodyLenght">
                Längd (cm)
              </label>
            </div>
            <input
              className={FormStyles.formInput}
              name="bodyLenght"
              type="number"
              step="0.1"
              id="bodyLenght"
              value={formData.bodyLenght}
              required
              placeholder="Ex (150.5cm)"
              onChange={handleChange}
            />
            {errors.bodyLenght && <p className={FormStyles.fieldErrorMessage}>{errors.bodyLenght}</p>}
          </div>

          {/* GENDER */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaMars className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="gender">
                Kön
              </label>
            </div>
            <select className={FormStyles.formSelect} id="gender" name="gender" value={formData.gender} onChange={handleChange}>
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
              value={formData.birthDate}
              onChange={handleChange}
            />
            {errors.birthDate && <p className={FormStyles.fieldErrorMessage}>{errors.birthDate}</p>}
          </div>

          {/* Goal */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaBullseye className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="goal">
                Mål
              </label>
            </div>
            <select className={FormStyles.formSelect} name="goalTypeId" value={formData.goalTypeId} onChange={handleChange}>
              <option value="">Välj mål</option>

              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
            {errors.goalTypeId && <p className={FormStyles.fieldErrorMessage}>{errors.goalTypeId}</p>}
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
              value={formData.goalWeight}
              name="goalWeight"
              type="number"
              step="0.1"
              placeholder="Ex: 75"
              id="goalWeight"
              onChange={handleChange}
            />
            {errors.goalWeight && <p className={FormStyles.fieldErrorMessage}>{errors.goalWeight}</p>}
          </div>

          {/* Goal Date */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaFlagCheckered className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="goalDate">
                Måldatum
              </label>
            </div>
            <input className={FormStyles.formInput} value={formData.goalDate} name="goalDate" type="date" id="goalDate" onChange={handleChange} />
            {errors.goalDate && <p className={FormStyles.fieldErrorMessage}>{errors.goalDate}</p>}
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
