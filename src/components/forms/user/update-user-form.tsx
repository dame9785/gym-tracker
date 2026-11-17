'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { FaEnvelope, FaWeightScale, FaPhone, FaRulerVertical, FaMars, FaCakeCandles, FaWeightHanging, FaFlagCheckered, FaUser, FaSignature, FaBullseye, FaPersonWalking } from 'react-icons/fa6';

import { ActivityLevel, Gender, GoalType, MetabolicSex } from '@prisma/client';

import Button from '@/components/button/button';
import FormStyles from '@/components/forms/form.module.css';
import FormPageHeader from '@/components/forms/shared/form-page-header';

import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';

import { updateUserSchema, type UpdateUserDto } from '@/schemas/auth-schemas';

import type { UserSettingsViewModel } from '@/types/user-types';
import { updateUserAction } from '@/actions/user-actions';

import { UserRoundCog } from 'lucide-react';

interface Props {
  user: UserSettingsViewModel;
}

type UpdateUserFormData = Omit<UpdateUserDto, 'activityLevel'> & {
  activityLevel: ActivityLevel | '';
};

export default function UpdateUserForm({ user }: Props) {
  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const formatDateForInput = (date: string): string => {
    if (!date) return '';

    return date.split('T')[0];
  };

  const [formData, setFormData] = useState<UpdateUserFormData>({
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
    activityLevel: user.activityLevel ?? '',
    metabolicSex: user.metabolicSex ?? null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ['bodyWeight', 'height', 'goalWeight'].includes(name) ? (value === '' ? 0 : Number(value)) : name === 'metabolicSex' ? (value === '' ? null : value) : value,
    }));

    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[name];

      return updatedErrors;
    });
  };

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
        setErrors(Object.fromEntries(Object.entries(response.errors ?? {}).filter((entry): entry is [string, string[]] => entry[1] !== undefined)));

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
    <form className={`${FormStyles.form} mx-auto`} onSubmit={handleSubmit}>
      <FormPageHeader backHref="/account" backLabel="Back to account" showBackButton={false} eyebrow="Account settings" title="Update" highlightedTitle="profile" description="Manage your personal information, body measurements, and fitness goals." icon={UserRoundCog} />

      <div className={FormStyles.formGrid}>
        {/* LEFT COLUMN */}
        <div className={FormStyles['form-left']}>
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
        </div>

        {/* RIGHT COLUMN */}
        <div className={FormStyles['form-right']}>
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
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </FormSelect>
            </FormField>
          </div>

          {formData.gender === Gender.OTHER && (
            <div className={FormStyles.formGroup}>
              <FormField htmlFor="metabolicSex" label="Metabolic sex" hint="Used for calculating your basal metabolic rate." error={errors.metabolicSex?.[0]}>
                <FormSelect id="metabolicSex" name="metabolicSex" value={formData.metabolicSex ?? ''} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.metabolicSex?.length}>
                  <option value="">Select metabolic sex</option>
                  <option value={MetabolicSex.MALE}>Male</option>
                  <option value={MetabolicSex.FEMALE}>Female</option>
                </FormSelect>
              </FormField>
            </div>
          )}

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

          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="activityLevel"
              label={
                <span className="flex items-center gap-2">
                  <FaPersonWalking className={FormStyles.formIcon} />
                  Activity level
                </span>
              }
              hint="Choose the option that best describes your usual activity."
              error={errors.activityLevel?.[0]}
            >
              <FormSelect id="activityLevel" name="activityLevel" value={formData.activityLevel} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.activityLevel?.length}>
                <option value="">Select activity level</option>
                <option value={ActivityLevel.SEDENTARY}>Sedentary – little or no exercise</option>
                <option value={ActivityLevel.LIGHT}>Light – exercise 1–3 days per week</option>
                <option value={ActivityLevel.MODERATE}>Moderate – exercise 3–5 days per week</option>
                <option value={ActivityLevel.ACTIVE}>Active – exercise 6–7 days per week</option>
                <option value={ActivityLevel.VERY_ACTIVE}>Very active – intense daily exercise</option>
              </FormSelect>
            </FormField>
          </div>

          <div className={FormStyles.formGroup}>
            <FormField
              htmlFor="goalType"
              label={
                <span className="flex items-center gap-2">
                  <FaBullseye className={FormStyles.formIcon} />
                  Fitness goal
                </span>
              }
              error={errors.goalType?.[0]}
            >
              <FormSelect id="goalType" name="goalType" value={formData.goalType} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.goalType?.length}>
                <option value={GoalType.MUSCLE_GAIN}>Muscle gain</option>
                <option value={GoalType.WEIGHT_LOSS}>Weight loss</option>
                <option value={GoalType.MAINTENANCE}>Maintain weight</option>
              </FormSelect>
            </FormField>
          </div>

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
              <FormInput name="goalWeight" type="number" step="0.1" min="20" max="400" id="goalWeight" value={formData.goalWeight || ''} placeholder="Example: 75" onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.goalWeight?.length} />
            </FormField>
          </div>

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
              <FormInput name="goalDate" type="date" id="goalDate" value={formData.goalDate} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.goalDate?.length} />
            </FormField>
          </div>
        </div>
      </div>

      <div className="grid-2 grid">
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
