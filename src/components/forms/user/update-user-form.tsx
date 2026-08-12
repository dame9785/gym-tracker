'use client';

//CSS
import styles from '@/components/forms/form.module.css';

//Components
import Button from '@/components/button/button';

//Types
import type { GoalTypeViewModel } from '@/types/goal-types';
import type { UpdateUserDto } from '@/schemas/auth-schemas';
import type { UserSettingsViewModel } from '@/types/user-types';

//Schemas
import { updateSchema } from '@/schemas/auth-schemas';

//React Routing
import { useState } from 'react';
import type { ChangeEvent } from 'react';

//Services
import UserService from '@/services/auth-service';

//FONTAWSOME ICONS
import {
  FaEnvelope,
  FaWeightScale,
  FaPhone,
  FaRulerVertical,
  FaCakeCandles,
  FaWeightHanging,
  FaFlagCheckered,
  FaUser,
  FaSignature,
  FaBullseye,
} from 'react-icons/fa6';
import { toast } from 'sonner';
import { ErrorsHelper } from '@/helpers/error-helper';

//Props
interface Props {
  user: UserSettingsViewModel;
  goals: GoalTypeViewModel[];
}

export default function UpdateUserForm({ user, goals }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateUserDto, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  console.log(user);
  const formatDateForInput = (date: string): string => {
    if (!date) {
      return '';
    }

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
    goalWeight: user.goalWeight,
    birthDate: formatDateForInput(user.birthDate) ?? '',
    goalDate: formatDateForInput(user.goalDate) ?? '',
    goalTypeId: user.goalTypeId || 0,
    gender: user.gender,
  });

  const cleanValidationError = (name: string): void => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name as keyof typeof newErrors];

      return newErrors;
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const validation = updateSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(ErrorsHelper.getFormErrors<UpdateUserDto>(validation.error.issues));
      return;
    }

    setIsSaving(true);

    /*Remove all the validation error*/
    setErrors({});

    try {
      const result = await UserService.update(validation.data, user.id);
      if (!result.success) {
        toast.error('Något gick fel, kontot kunde inte uppdateras.');
        return;
      }
      toast.success('Användare uppdaterad');
    } catch (error) {
      console.error('Register failed:', error);
      toast.error('Något gick fel, kontot kunde inte uppdateras.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formWrapper}>
        <h1 className={styles.formTitle}>
          Ändra konto
          <span> Inställningar</span>
        </h1>
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
              autoComplete="email"
              placeholder="E-post..."
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className={styles.fieldErrorMessage}>{errors.email}</p>}
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
              autoComplete="username"
              placeholder="Användarnamn..."
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className={styles.fieldErrorMessage}>{errors.username}</p>}
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
              autoComplete="given-name"
              placeholder="Namn..."
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className={styles.fieldErrorMessage}>{errors.firstName}</p>}
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
              id="lastName"
              autoComplete="family-name"
              placeholder="Efternamn..."
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className={styles.fieldErrorMessage}>{errors.lastName}</p>}
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
              autoComplete="tel"
              placeholder="Telefonnummer..."
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && <p className={styles.fieldErrorMessage}>{errors.phoneNumber}</p>}
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
              value={formData.goalDate}
              onChange={handleChange}
            />
            {errors.goalDate && <p className={styles.fieldErrorMessage}>{errors.goalDate}</p>}
          </div>
        </div>

        <div className="form-right">
          {/* Body Weight */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaWeightScale className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="bodyWeight">
                Kroppsvikt (kg)
              </label>
            </div>
            <input
              className={styles.formInput}
              name="bodyWeight"
              type="number"
              step="0.1"
              id="bodyWeight"
              placeholder="Ex (40.2kg)"
              value={formData.bodyWeight}
              onChange={handleChange}
            />
            {errors.bodyWeight && <p className={styles.fieldErrorMessage}>{errors.bodyWeight}</p>}
          </div>
          {/* Height */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaRulerVertical className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="height">
                Längd (cm)
              </label>
            </div>
            <input
              className={styles.formInput}
              name="height"
              type="number"
              step="0.1"
              id="height"
              placeholder="Ex (150.5cm)"
              value={formData.height}
              onChange={handleChange}
            />
            {errors.height && <p className={styles.fieldErrorMessage}>{errors.height}</p>}
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
              value={formData.birthDate}
              onChange={handleChange}
            />
            {errors.birthDate && <p className={styles.fieldErrorMessage}>{errors.birthDate}</p>}
          </div>

          {/* Goal */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaBullseye className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="goalType">
                Mål
              </label>
            </div>
            <select
              className={styles.formSelect}
              name="goalTypeId"
              id="goalTypeId"
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
            {errors.goalTypeId && <p className={styles.fieldErrorMessage}>{errors.goalTypeId}</p>}
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
              value={formData.goalWeight}
              onChange={handleChange}
            />
            {errors.goalWeight && <p className={styles.fieldErrorMessage}>{errors.goalWeight}</p>}
          </div>
        </div>
      </div>
      <div className="grid grid-2">
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Sparar...' : 'Spara'}
        </Button>
      </div>
    </form>
  );
}
