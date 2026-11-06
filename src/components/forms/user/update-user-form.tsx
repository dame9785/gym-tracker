
'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
  FaBullseye,
} from 'react-icons/fa6';

import { Gender, GoalType } from '@prisma/client';

import Button from '@/components/button/button';
import FormStyles from '@/components/forms/form.module.css';

import {
  updateUserSchema,
  type UpdateUserDto,
} from '@/schemas/auth-schemas';

import type { UserSettingsViewModel } from '@/types/user-types';
import { updateUserAction } from '@/actions/user-actions';

interface Props {
  user: UserSettingsViewModel;
}

export default function UpdateUserForm({ user }: Props) {
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const formatDateForInput = (date: string): string => {
    if (!date) return '';

    return date.split('T')[0];
  };

  const [formData, setFormData] = useState<UpdateUserDto>({
    email: user.email ?? '',
    username: user.username ?? '',
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    phoneNumber: user.phoneNumber ?? '',
    bodyWeight: user.bodyWeight,
    height: user.height,
    gender: user.gender,
    birthDate: formatDateForInput(user.birthDate),
    goalType: user.goalType,
    goalWeight: user.goalWeight,
    goalDate: formatDateForInput(user.goalDate),
  });

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ['bodyWeight', 'height', 'goalWeight'].includes(name)
        ? value === ''
          ? 0
          : Number(value)
        : value,
    }));

    // Remove validation error for changed field
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[name];

      return updatedErrors;
    });
  };

  // Render field validation error
  const renderFieldError = (name: keyof UpdateUserDto) => {
    const error = errors[name]?.[0];

    if (!error) return null;

    return (
      <p className={FormStyles.fieldErrorMessage} role="alert">
        {error}
      </p>
    );
  };

  // Submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = updateUserSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = await updateUserAction(validation.data);

      if (!response.success) {
        setErrors(response.errors ?? {});
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className={FormStyles.form} onSubmit={handleSubmit}>
      {/* FORM TITLE */}
      <div className={FormStyles.formWrapper}>
        <h1 className={FormStyles.formTitle}>
          Ändra konto
          <span> Inställningar</span>
        </h1>
      </div>

      <div className={FormStyles.formGrid}>

        {/* LEFT COLUMN */}
        <div className={FormStyles['form-left']}>

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

            {renderFieldError('email')}
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
              autoComplete="username"
              value={formData.username}
              placeholder="Användarnamn..."
              onChange={handleChange}
            />

            {renderFieldError('username')}
          </div>

          {/* FIRST NAME */}
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
              autoComplete="given-name"
              value={formData.firstName}
              placeholder="Namn..."
              onChange={handleChange}
            />

            {renderFieldError('firstName')}
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
              id="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              placeholder="Efternamn..."
              onChange={handleChange}
            />

            {renderFieldError('lastName')}
          </div>

          {/* PHONE */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaPhone className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="phoneNumber">
                Telefonnummer
              </label>
            </div>

            <input
              className={FormStyles.formInput}
              name="phoneNumber"
              type="tel"
              id="phoneNumber"
              autoComplete="tel"
              inputMode="tel"
              value={formData.phoneNumber}
              placeholder="076-123 45 67"
              onChange={handleChange}
            />

            <small>
              Exempel: 076-123 45 67 eller +46 76 123 45 67
            </small>

            {renderFieldError('phoneNumber')}
          </div>

          {/* BODY WEIGHT */}
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
              min="20"
              max="400"
              id="bodyWeight"
              value={formData.bodyWeight || ''}
              placeholder="Exempel: 70.5"
              onChange={handleChange}
            />

            {renderFieldError('bodyWeight')}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={FormStyles['form-right']}>

          {/* HEIGHT */}
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
              min="100"
              max="250"
              id="height"
              value={formData.height || ''}
              placeholder="Exempel: 175"
              onChange={handleChange}
            />

            {renderFieldError('height')}
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
              <option value={Gender.MALE}>Man</option>
              <option value={Gender.FEMALE}>Kvinna</option>
              <option value={Gender.OTHER}>Annat</option>
            </select>

            {renderFieldError('gender')}
          </div>

          {/* BIRTH DATE */}
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
              value={formData.birthDate}
              onChange={handleChange}
            />

            {renderFieldError('birthDate')}
          </div>

          {/* GOAL TYPE */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaBullseye className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="goalType">
                Träningsmål
              </label>
            </div>

            <select
              className={FormStyles.formSelect}
              id="goalType"
              name="goalType"
              value={formData.goalType}
              onChange={handleChange}
            >
              <option value={GoalType.MUSCLE_GAIN}>
                Muskelökning
              </option>
              <option value={GoalType.WEIGHT_LOSS}>
                Viktnedgång
              </option>
              <option value={GoalType.MAINTENANCE}>
                Behålla vikten
              </option>
            </select>

            {renderFieldError('goalType')}
          </div>

          {/* GOAL WEIGHT */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaWeightHanging className={FormStyles.formIcon} />
              <label className={FormStyles.formLabel} htmlFor="goalWeight">
                Målvikt (kg)
              </label>
            </div>

            <input
              className={FormStyles.formInput}
              name="goalWeight"
              type="number"
              step="0.1"
              min="20"
              max="400"
              id="goalWeight"
              value={formData.goalWeight || ''}
              placeholder="Exempel: 75"
              onChange={handleChange}
            />

            {renderFieldError('goalWeight')}
          </div>

          {/* GOAL DATE */}
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
              value={formData.goalDate}
              onChange={handleChange}
            />

            {renderFieldError('goalDate')}
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="grid grid-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isSaving}
        >
          {isSaving ? 'Sparar...' : 'Spara ändringar'}
        </Button>
      </div>
    </form>
  );
}
