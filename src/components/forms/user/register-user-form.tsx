'use client';

import { FaEnvelope, FaWeightScale, FaPhone, FaRulerVertical, FaMars, FaCakeCandles, FaWeightHanging, FaFlagCheckered, FaUser, FaSignature, FaLock } from 'react-icons/fa6';

import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';

import Button from '@/components/button/button';

import FormStyles from '@/components/forms/form.module.css';
import buttonStyles from '@/components/button/button.module.css';

import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';

import { registerUserSchema, type RegisterUserDto } from '@/schemas/auth-schemas';

import { Gender, GoalType } from '@prisma/client';
import { registerUserAction } from '@/actions/user-actions';

export default function RegisterForm() {
  const router = useRouter();

  const today = new Date();

  const defaultGoalDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');

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
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            <FormField
              htmlFor="email"
              label={
                <span className="flex items-center gap-2">
                  <FaEnvelope className={FormStyles.formIcon} />
                  Email
                </span>
              }
              error={errors.email?.[0]}
            >
              <FormInput name="email" type="email" id="email" autoComplete="email" value={formData.email} placeholder="E-post..." onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.email?.length} />
            </FormField>
          </div>

          {/* USERNAME */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="username"
              label={
                <span className="flex items-center gap-2">
                  <FaUser className={FormStyles.formIcon} />
                  Användarnamn
                </span>
              }
              error={errors.username?.[0]}
            >
              <FormInput name="username" type="text" id="username" autoComplete="username" value={formData.username} placeholder="Användarnamn..." onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.username?.length} />
            </FormField>
          </div>

          {/* FIRST NAME */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="firstName"
              label={
                <span className="flex items-center gap-2">
                  <FaSignature className={FormStyles.formIcon} />
                  Namn
                </span>
              }
              error={errors.firstName?.[0]}
            >
              <FormInput name="firstName" type="text" id="firstName" autoComplete="given-name" value={formData.firstName} placeholder="Namn..." onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.firstName?.length} />
            </FormField>
          </div>

          {/* LAST NAME */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="lastName"
              label={
                <span className="flex items-center gap-2">
                  <FaSignature className={FormStyles.formIcon} />
                  Efternamn
                </span>
              }
              error={errors.lastName?.[0]}
            >
              <FormInput name="lastName" type="text" id="lastName" autoComplete="family-name" value={formData.lastName} placeholder="Efternamn..." onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.lastName?.length} />
            </FormField>
          </div>

          {/* PHONE */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="phoneNumber"
              label={
                <span className="flex items-center gap-2">
                  <FaPhone className={FormStyles.formIcon} />
                  Telefonnummer
                </span>
              }
              hint="Exempel: 076-123 45 67 eller +46 76 123 45 67"
              error={errors.phoneNumber?.[0]}
            >
              <FormInput name="phoneNumber" type="tel" id="phoneNumber" autoComplete="tel" inputMode="tel" value={formData.phoneNumber} placeholder="076-123 45 67" onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.phoneNumber?.length} />
            </FormField>
          </div>

          {/* BODY WEIGHT */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="bodyWeight"
              label={
                <span className="flex items-center gap-2">
                  <FaWeightScale className={FormStyles.formIcon} />
                  Kroppsvikt (kg)
                </span>
              }
              error={errors.bodyWeight?.[0]}
            >
              <FormInput name="bodyWeight" type="number" step="0.1" min="20" max="400" id="bodyWeight" value={formData.bodyWeight || ''} placeholder="Exempel: 70.5" onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.bodyWeight?.length} />
            </FormField>
          </div>

          {/* PASSWORD */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="password"
              label={
                <span className="flex items-center gap-2">
                  <FaLock className={FormStyles.formIcon} />
                  Lösenord
                </span>
              }
              error={formData.password.length === 0 ? errors.password?.[0] : undefined}
            >
              <FormInput value={formData.password} name="password" type="password" id="password" autoComplete="new-password" placeholder="Lösenord..." onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.password?.length} />
            </FormField>

            {formData.password.length > 0 && (
              <div>
                <p className={FormStyles.passwordRequirementsTitle}>Lösenordet måste uppfylla följande krav:</p>

                <ul className={FormStyles.passwordRequirements}>
                  {passwordRequirements.map((requirement) => (
                    <li key={requirement.label} className={requirement.valid ? FormStyles.requirementValid : FormStyles.requirementInvalid}>
                      <span aria-hidden="true">{requirement.valid ? '✓' : '○'}</span>

                      {requirement.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="confirmPassword"
              label={
                <span className="flex items-center gap-2">
                  <FaLock className={FormStyles.formIcon} />
                  Bekräfta lösenord
                </span>
              }
              error={errors.confirmPassword?.[0]}
            >
              <FormInput value={formData.confirmPassword} name="confirmPassword" type="password" id="confirmPassword" autoComplete="new-password" placeholder="Bekräfta lösenord..." onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.confirmPassword?.length} />
            </FormField>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="form-right">
          {/* HEIGHT */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="height"
              label={
                <span className="flex items-center gap-2">
                  <FaRulerVertical className={FormStyles.formIcon} />
                  Längd (cm)
                </span>
              }
              error={errors.height?.[0]}
            >
              <FormInput name="height" type="number" step="0.1" min="100" max="250" id="height" value={formData.height || ''} placeholder="Exempel: 175" onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.height?.length} />
            </FormField>
          </div>

          {/* GENDER */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="gender"
              label={
                <span className="flex items-center gap-2">
                  <FaMars className={FormStyles.formIcon} />
                  Kön
                </span>
              }
              error={errors.gender?.[0]}
            >
              <FormSelect id="gender" name="gender" value={formData.gender} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.gender?.length}>
                <option value="">Välj kön</option>
                <option value={Gender.MALE}>Man</option>
                <option value={Gender.FEMALE}>Kvinna</option>
                <option value={Gender.OTHER}>Annat</option>
              </FormSelect>
            </FormField>
          </div>

          {/* BIRTH DATE */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="birthDate"
              label={
                <span className="flex items-center gap-2">
                  <FaCakeCandles className={FormStyles.formIcon} />
                  Född
                </span>
              }
              error={errors.birthDate?.[0]}
            >
              <FormInput name="birthDate" type="date" id="birthDate" value={formData.birthDate} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.birthDate?.length} />
            </FormField>
          </div>

          {/* GOAL TYPE */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="goalType"
              label={
                <span className="flex items-center gap-2">
                  <FaMars className={FormStyles.formIcon} />
                  Träningsmål
                </span>
              }
              error={errors.goalType?.[0]}
            >
              <FormSelect id="goalType" name="goalType" value={formData.goalType} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.goalType?.length}>
                <option value="">Välj träningsmål</option>
                <option value={GoalType.MUSCLE_GAIN}>Muskelökning</option>
                <option value={GoalType.WEIGHT_LOSS}>Viktnedgång</option>
                <option value={GoalType.MAINTENANCE}>Behålla vikten</option>
              </FormSelect>
            </FormField>
          </div>

          {/* GOAL WEIGHT */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="goalWeight"
              label={
                <span className="flex items-center gap-2">
                  <FaWeightHanging className={FormStyles.formIcon} />
                  Målvikt (kg)
                </span>
              }
              error={errors.goalWeight?.[0]}
            >
              <FormInput value={formData.goalWeight || ''} name="goalWeight" type="number" step="0.1" min="20" max="400" placeholder="Exempel: 75" id="goalWeight" onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.goalWeight?.length} />
            </FormField>
          </div>

          {/* GOAL DATE */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="goalDate"
              label={
                <span className="flex items-center gap-2">
                  <FaFlagCheckered className={FormStyles.formIcon} />
                  Måldatum
                </span>
              }
              error={errors.goalDate?.[0]}
            >
              <FormInput value={formData.goalDate} name="goalDate" type="date" id="goalDate" onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.goalDate?.length} />
            </FormField>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="grid-2 grid">
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Skapar konto...' : 'Skapa konto'}
        </Button>

        <Link href="/account/login" className={`${buttonStyles.button} ${buttonStyles.secondary}`}>
          Gå tillbaka
        </Link>
      </div>
    </form>
  );
}
