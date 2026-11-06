
'use client';

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

import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';

import Button from '@/components/button/button';

import FormStyles from '@/components/forms/form.module.css';
import buttonStyles from '@/components/button/button.module.css';

import {
  registerUserSchema,
  type RegisterUserDto,
} from '@/schemas/auth-schemas';

import { Gender, GoalType } from '@prisma/client';
import { registerUserAction } from '@/actions/user-actions';

export default function RegisterForm() {
  const router = useRouter();

const today = new Date();

const defaultGoalDate = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0'),
].join('-');

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
    birthDate: '2000-01-01',
    goalType: 'MAINTENANCE',
    goalWeight: 0,
    goalDate: defaultGoalDate,
    password: '',
    confirmPassword: '',
  });

  // Password requirements
  const passwordRequirements = [
    {
      label: 'At least 12 characters',
      valid: formData.password.length >= 12,
    },
    {
      label: 'Maximum 128 characters',
      valid: formData.password.length <= 128,
    },
    {
      label: 'At least one uppercase letter',
      valid: /[A-Z]/.test(formData.password),
    },
    {
      label: 'At least one lowercase letter',
      valid: /[a-z]/.test(formData.password),
    },
    {
      label: 'At least one number',
      valid: /[0-9]/.test(formData.password),
    },
    {
      label: 'At least one special character',
      valid: /[^A-Za-z0-9]/.test(formData.password),
    },
  ];

  // Remove validation error for a specific field
  const cleanValidationError = (name: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];

      return newErrors;
    });
  };

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    cleanValidationError(name);

    let parsedValue: string | number = value;

    switch (name) {
      case 'bodyWeight':
      case 'height':
      case 'goalWeight':
        parsedValue = value === '' ? 0 : Number(value);
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  // Get first validation error for a field
  const renderFieldError = (name: keyof RegisterUserDto) => {
    const error = errors[name]?.[0];

    if (!error) return null;

    return (
      <p className={FormStyles.fieldErrorMessage} role="alert">
        {error}
      </p>
    );
  };

  // Submit registration form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = registerUserSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = await registerUserAction(validation.data);

      if (!response.success) {
        setErrors(response.errors ?? {});
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to register user:', error);
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
        <div className={FormStyles.formLeft}>

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

          {/* PASSWORD */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaLock className={FormStyles.formIcon} />
              <label
                htmlFor="password"
                className={FormStyles.formLabel}
              >
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

            {formData.password.length > 0 ? (
              <div>
                <p className={FormStyles.passwordRequirementsTitle}>
                  Lösenordet måste uppfylla följande krav:
                </p>

                <ul className={FormStyles.passwordRequirements}>
                  {passwordRequirements.map((requirement) => (
                    <li
                      key={requirement.label}
                      className={
                        requirement.valid
                          ? FormStyles.requirementValid
                          : FormStyles.requirementInvalid
                      }
                    >
                      <span aria-hidden="true">
                        {requirement.valid ? '✓' : '○'}
                      </span>

                      {requirement.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              renderFieldError('password')
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={FormStyles.formGroup}>
            <div className={FormStyles.labelWrapper}>
              <FaLock className={FormStyles.formIcon} />
              <label
                htmlFor="confirmPassword"
                className={FormStyles.formLabel}
              >
                Bekräfta lösenord
              </label>
            </div>

            <input
              className={FormStyles.formInput}
              value={formData.confirmPassword}
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Bekräfta lösenord..."
              onChange={handleChange}
            />

            {renderFieldError('confirmPassword')}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="form-right">

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
              <option value="">Välj kön</option>
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
              <FaMars className={FormStyles.formIcon} />
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
              <option value="">Välj träningsmål</option>
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
              value={formData.goalWeight || ''}
              name="goalWeight"
              type="number"
              step="0.1"
              min="20"
              max="400"
              placeholder="Exempel: 75"
              id="goalWeight"
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
              value={formData.goalDate}
              name="goalDate"
              type="date"
              id="goalDate"
              onChange={handleChange}
            />

            {renderFieldError('goalDate')}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid grid-2">
        <Button
          type="submit"
          variant="primary"
          disabled={isSaving}
        >
          {isSaving ? 'Skapar konto...' : 'Skapa konto'}
        </Button>

        <Link
          href="/account/login"
          className={`${buttonStyles.button} ${buttonStyles.secondary}`}
        >
          Gå tillbaka
        </Link>
      </div>
    </form>
  );
}
