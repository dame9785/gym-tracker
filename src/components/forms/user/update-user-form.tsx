'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { FaEnvelope, FaWeightScale, FaPhone, FaRulerVertical, FaMars, FaCakeCandles, FaWeightHanging, FaFlagCheckered, FaUser, FaSignature, FaBullseye } from 'react-icons/fa6';

import { Gender, GoalType } from '@prisma/client';

import Button from '@/components/button/button';
import FormStyles from '@/components/forms/form.module.css';

import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';

import { updateUserSchema, type UpdateUserDto } from '@/schemas/auth-schemas';

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
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ['bodyWeight', 'height', 'goalWeight'].includes(name) ? (value === '' ? 0 : Number(value)) : value,
    }));

    // Remove validation error for changed field
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[name];

      return updatedErrors;
    });
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
        </div>

        {/* RIGHT COLUMN */}
        <div className={FormStyles['form-right']}>
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
                  <FaBullseye className={FormStyles.formIcon} />
                  Träningsmål
                </span>
              }
              error={errors.goalType?.[0]}
            >
              <FormSelect id="goalType" name="goalType" value={formData.goalType} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.goalType?.length}>
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
              <FormInput name="goalWeight" type="number" step="0.1" min="20" max="400" id="goalWeight" value={formData.goalWeight || ''} placeholder="Exempel: 75" onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.goalWeight?.length} />
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
              <FormInput name="goalDate" type="date" id="goalDate" value={formData.goalDate} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.goalDate?.length} />
            </FormField>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="grid-2 grid">
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Sparar...' : 'Spara ändringar'}
        </Button>
      </div>
    </form>
  );
}
