'use client';

//FONTAWSOME ICONS
import {
  FaEnvelope,
  FaWeightScale,
  FaPhone,
  FaRulerVertical,
  FaMars,
  FaCakeCandles,
  FaWeightHanging,
  FaFlagCheckered,
  FaUser,
  FaSignature,
  FaLock,
} from 'react-icons/fa6';

//Toast Alert
import { toast } from 'sonner';

//Components
import Button from '@/components/button/button';

//Styling
import FormStyles from '@/components/forms/form.module.css';
import buttonStyles from '@/components/button/button.module.css';

//NEXT & Hooks
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

//Types
import { registerUserSchema, type RegisterUserDto } from '@/schemas/auth-schemas';
import { Gender, GoalType } from '@prisma/client';

import { registerUserAction } from '@/actions/user-actions';

export default function RegisterForm() {
  const router = useRouter();

  /*States*/
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<RegisterUserDto>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bodyWeight: 0,
    height: 0,
    gender: 'MALE',
    birthDate: new Date().toISOString().split('T')[0],
    goalType: 'MAINTENANCE',
    goalWeight: 0,
    goalDate: '',
    password: '',
  });

  const cleanValidationError = (name: string): void => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name as keyof typeof newErrors];

      return newErrors;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    //Remove only the validation error for the specified field
    cleanValidationError(name);

    let parsedValue: string | number | Date = value;

    // Convert numeric form fields from strings to numbers
    switch (name) {
      case 'bodyWeight':
      case 'height':
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

    /*zod validation*/
    const validate = registerUserSchema.safeParse(formData);
    if (!validate.success) {
      setErrors(validate.error.flatten().fieldErrors);
      return;
    }

    setIsSaving(true);

    /*Remove all the validation error*/
    setErrors({});

    try {
      const response = await registerUserAction(validate.data);

      if (!response.success) {
        if (response.errors) {
          setErrors(response.errors);
        }

        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/account/settings');
    } catch (error) {
      console.error('Failed to create food:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
              autoComplete="email"
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
              autoComplete="username"
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
              autoComplete="given-name"
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
              id="lastName"
              autoComplete="family-name"
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
              autoComplete="tel"
              value={formData.phoneNumber}
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
              autoComplete="new-password"
              placeholder="Lösenord..."
              onChange={handleChange}
            />
            {errors.password && <p className={FormStyles.fieldErrorMessage}>{errors.password}</p>}
          </div>
        </div>

        <div className="form-right">
          {/* Height */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaRulerVertical className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="height">
                Längd (cm)
              </label>
            </div>
            <input
              className={FormStyles.formInput}
              name="height"
              type="number"
              step="0.1"
              id="height"
              value={formData.height}
              placeholder="Ex (150.5cm)"
              onChange={handleChange}
            />
            {errors.height && <p className={FormStyles.fieldErrorMessage}>{errors.height}</p>}
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
              value={formData.gender}
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
              value={formData.birthDate}
              onChange={handleChange}
            />
            {errors.birthDate && <p className={FormStyles.fieldErrorMessage}>{errors.birthDate}</p>}
          </div>

          {/* Goal Type*/}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaMars className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="goalType">
                Goal type
              </label>
            </div>
            <select
              className={FormStyles.formSelect}
              id="goalType"
              name="goalType"
              value={formData.goalType}
              onChange={handleChange}
            >
              <option value="">Select goal type</option>
              <option value={GoalType.MUSCLE_GAIN}>Muscle Gain</option>
              <option value={GoalType.WEIGHT_LOSS}>Weight Loss</option>
              <option value={GoalType.MAINTENANCE}>Maintenance</option>
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
            <input
              className={FormStyles.formInput}
              value={formData.goalDate}
              name="goalDate"
              type="date"
              id="goalDate"
              onChange={handleChange}
            />
            {errors.goalDate && <p className={FormStyles.fieldErrorMessage}>{errors.goalDate}</p>}
          </div>
        </div>
      </div>
      <div className="grid grid-2">
        <Button type="submit" variant="primary" disabled={isSaving}>
          Skapa konto
        </Button>
        <Link href="/account/login" className={`${buttonStyles.button} ${buttonStyles.secondary}`}>
          Gå tillbaks
        </Link>
      </div>
    </form>
  );
}
