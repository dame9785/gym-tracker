'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { FaEnvelope, FaWeightScale, FaPhone, FaRulerVertical, FaMars, FaCakeCandles, FaWeightHanging, FaFlagCheckered, FaUser, FaSignature, FaLock, FaPersonWalking } from 'react-icons/fa6';

import { ActivityLevel, Gender, GoalType } from '@prisma/client';

import Button from '@/components/button/button';
import FormStyles from '@/components/forms/form.module.css';
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';

import { registerUserSchema, type RegisterUserDto } from '@/schemas/auth-schemas';
import { registerUserAction } from '@/actions/user-actions';

import FormPageHeader from '@/components/forms/shared/form-page-header';
import { UserRoundPlus } from 'lucide-react';

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
    gender: Gender.MALE,
    metabolicSex: null,
    birthDate: '2000-01-01',
    activityLevel: ActivityLevel.SEDENTARY,
    goalType: GoalType.MAINTENANCE,
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

    let parsedValue: string | number | null = value;

    switch (name) {
      case 'bodyWeight':
      case 'height':
      case 'goalWeight':
        parsedValue = value === '' ? 0 : Number(value);
        break;

      case 'metabolicSex':
        parsedValue = value === '' ? null : value;
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
      ...(name === 'gender' && value !== Gender.OTHER ? { metabolicSex: null } : {}),
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
        setErrors(Object.fromEntries(Object.entries(response.errors ?? {}).filter((entry): entry is [string, string[]] => entry[1] !== undefined)));

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
      <FormPageHeader backHref="/account/login" backLabel="Back to login" eyebrow="GymTracker account" title="Create" highlightedTitle="account" description="Create your account to manage workouts, track your progress, and reach your fitness goals." icon={UserRoundPlus} />

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
              <FormInput name="email" type="email" id="email" autoComplete="email" value={formData.email} placeholder="Email..." onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.email?.length} />
            </FormField>
          </div>

          {/* USERNAME */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="username"
              label={
                <span className="flex items-center gap-2">
                  <FaUser className={FormStyles.formIcon} />
                  Username
                </span>
              }
              error={errors.username?.[0]}
            >
              <FormInput name="username" type="text" id="username" autoComplete="username" value={formData.username} placeholder="Username..." onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.username?.length} />
            </FormField>
          </div>

          {/* FIRST NAME */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="firstName"
              label={
                <span className="flex items-center gap-2">
                  <FaSignature className={FormStyles.formIcon} />
                  First name
                </span>
              }
              error={errors.firstName?.[0]}
            >
              <FormInput name="firstName" type="text" id="firstName" autoComplete="given-name" value={formData.firstName} placeholder="First name..." onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.firstName?.length} />
            </FormField>
          </div>

          {/* LAST NAME */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="lastName"
              label={
                <span className="flex items-center gap-2">
                  <FaSignature className={FormStyles.formIcon} />
                  Last name
                </span>
              }
              error={errors.lastName?.[0]}
            >
              <FormInput name="lastName" type="text" id="lastName" autoComplete="family-name" value={formData.lastName} placeholder="Last name..." onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.lastName?.length} />
            </FormField>
          </div>

          {/* PHONE */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="phoneNumber"
              label={
                <span className="flex items-center gap-2">
                  <FaPhone className={FormStyles.formIcon} />
                  Phone number
                </span>
              }
              hint="Example: 076-123 45 67 or +46 76 123 45 67"
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
                  Body weight (kg)
                </span>
              }
              error={errors.bodyWeight?.[0]}
            >
              <FormInput name="bodyWeight" type="number" step="0.1" min="20" max="400" id="bodyWeight" value={formData.bodyWeight || ''} placeholder="Example: 70.5" onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.bodyWeight?.length} />
            </FormField>
          </div>

          {/* PASSWORD */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="password"
              label={
                <span className="flex items-center gap-2">
                  <FaLock className={FormStyles.formIcon} />
                  Password
                </span>
              }
              error={formData.password.length === 0 ? errors.password?.[0] : undefined}
            >
              <FormInput value={formData.password} name="password" type="password" id="password" autoComplete="new-password" placeholder="Password..." onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.password?.length} />
            </FormField>

            {formData.password.length > 0 && (
              <div>
                <p className={FormStyles.passwordRequirementsTitle}>Your password must meet the following requirements:</p>

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
                  Confirm password
                </span>
              }
              error={errors.confirmPassword?.[0]}
            >
              <FormInput value={formData.confirmPassword} name="confirmPassword" type="password" id="confirmPassword" autoComplete="new-password" placeholder="Confirm password..." onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.confirmPassword?.length} />
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
                  Height (cm)
                </span>
              }
              error={errors.height?.[0]}
            >
              <FormInput name="height" type="number" step="0.1" min="100" max="250" id="height" value={formData.height || ''} placeholder="Example: 175" onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.height?.length} />
            </FormField>
          </div>

          {/* GENDER */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="gender"
              label={
                <span className="flex items-center gap-2">
                  <FaMars className={FormStyles.formIcon} />
                  Gender
                </span>
              }
              error={errors.gender?.[0]}
            >
              <FormSelect id="gender" name="gender" value={formData.gender} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.gender?.length}>
                <option value="">Select gender</option>
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </FormSelect>
            </FormField>
          </div>

          {/* METABOLIC SEX */}
          {formData.gender === Gender.OTHER && (
            <div className={FormStyles.formGroup}>
              <FormField
                htmlFor="metabolicSex"
                label={
                  <span className="flex items-center gap-2">
                    <FaMars className={FormStyles.formIcon} />
                    Metabolic sex
                  </span>
                }
                error={errors.metabolicSex?.[0]}
              >
                <FormSelect id="metabolicSex" name="metabolicSex" value={formData.metabolicSex ?? ''} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.metabolicSex?.length}>
                  <option value="">Select metabolic sex</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </FormSelect>
              </FormField>
            </div>
          )}

          {/* BIRTH DATE */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="birthDate"
              label={
                <span className="flex items-center gap-2">
                  <FaCakeCandles className={FormStyles.formIcon} />
                  Date of birth
                </span>
              }
              error={errors.birthDate?.[0]}
            >
              <FormInput name="birthDate" type="date" id="birthDate" value={formData.birthDate} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.birthDate?.length} />
            </FormField>
          </div>

          {/* ACTIVITY LEVEL */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="activityLevel"
              label={
                <span className="flex items-center gap-2">
                  <FaPersonWalking className={FormStyles.formIcon} />
                  Activity level
                </span>
              }
              hint="Choose the option that best describes your usual activity level."
              error={errors.activityLevel?.[0]}
            >
              <FormSelect id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.activityLevel?.length}>
                <option value="">Select activity level</option>
                <option value={ActivityLevel.SEDENTARY}>Sedentary – little or no exercise</option>
                <option value={ActivityLevel.LIGHT}>Light – exercise 1–3 days per week</option>
                <option value={ActivityLevel.MODERATE}>Moderate – exercise 3–5 days per week</option>
                <option value={ActivityLevel.ACTIVE}>Active – exercise 6–7 days per week</option>
                <option value={ActivityLevel.VERY_ACTIVE}>Very active – intense exercise daily</option>
              </FormSelect>
            </FormField>
          </div>

          {/* GOAL TYPE */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="goalType"
              label={
                <span className="flex items-center gap-2">
                  <FaMars className={FormStyles.formIcon} />
                  Fitness goal
                </span>
              }
              error={errors.goalType?.[0]}
            >
              <FormSelect id="goalType" name="goalType" value={formData.goalType} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.goalType?.length}>
                <option value="">Select fitness goal</option>
                <option value={GoalType.MUSCLE_GAIN}>Build muscle</option>
                <option value={GoalType.WEIGHT_LOSS}>Lose weight</option>
                <option value={GoalType.MAINTENANCE}>Maintain weight</option>
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
                  Target weight (kg)
                </span>
              }
              error={errors.goalWeight?.[0]}
            >
              <FormInput value={formData.goalWeight || ''} name="goalWeight" type="number" step="0.1" min="20" max="400" placeholder="Example: 75" id="goalWeight" onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.goalWeight?.length} />
            </FormField>
          </div>

          {/* GOAL DATE */}
          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="goalDate"
              label={
                <span className="flex items-center gap-2">
                  <FaFlagCheckered className={FormStyles.formIcon} />
                  Target date
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
          {isSaving ? 'Creating account...' : 'Create account'}
        </Button>
      </div>
    </form>
  );
}
