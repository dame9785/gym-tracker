'use client';

//CSS
import styles from '@/components/forms/form.module.css';

//Components
import Button from '@/components/button/button';
import LoadingSpinner from '@/components/loading-spinner';

//Types
import type { GoalType } from '@/types/goal-types';
import type { UpdateUserDto } from '@/schemas/auth-schemas';


//Schemas
import { updateSchema } from '@/schemas/auth-schemas';

//React Routing
import { useState, useEffect } from 'react';

//Services
import UserService from '@/services/auth-service';
import GoalService from '@/services/goal-service';

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

//Props

  type Props = {
  user: UserSettingsViewModel;
  goals: GoalType[];
};

const numericFields = [
  'bodyWeight',
  'height',
  'goalWeight',
  'goalTypeId',
];

type FormErrors = Partial<Record<keyof UpdateUserDto,

export default function UpdateUserForm({
  user,
  goals,
}: Props) {
   string>>;
  const [errors, setErrors] = useState<FormErrors>({});

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<UpdateUserDto>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bodyWeight: 0,
    height: 0,
    birthDate: '',
    goalWeight: 0,
    goalDate: '',
    goalTypeId: 0,
    gender: 'MALE',
  });









  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    

    //zod validation 
    const validation = updateSchema.safeParse(formData);

    //Show fields validation error meddages
    //If Validation is not success
    if (!validation.success) {
      const fieldErrors = Object.fromEntries(
      validation.error.issues.map((issue) => [String(issue.path[0]),issue.message,])
      );

        setErrors(fieldErrors);
        return;
      
    }

    //show loading
    setIsSaving(true);

    try {
      const result = await UserService.update(formData, Number(userId));
      if (!result.success) {
        setErrors(result.fieldErrors ?? {});

        if (!result.fieldErrors) {
          toast.error(result.message);
        }

        return;
      }
      //Show alert message
      toast.success('Användare uppdaterad');

      //Empty error messages
      setErrors({});
      return;
    } catch (error) {
      toast.error('Något gick fel, användare ej uppdaterad.');
    } finally {
      setIsSaving(false);
    }
  };

 

  

  //Show Loading spinner if loading is true or user is null
  if (isLoading) {
    return <LoadingSpinner />;
  }

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
              maxLength={20}
              
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
              maxLength={20}
              
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
              maxLength={50}
              id="lastName"
              
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
              maxLength={15}
              
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
              value={formData.goalDate?.split('T')[0] ?? ''}
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
              value={formData.birthDate?.split('T')[0] ?? ''}
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
            <select className={styles.formSelect} name="goalTypeId" value={formData.goalTypeId} onChange={handleChange}>
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
    <Button
  type="submit"
  text={isSaving ? 'Sparar...' : 'Spara'}
  variant="primary"
  disabled={isSaving}
/>
      </div>
    </form>
  );
}
