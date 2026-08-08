'use client';

//CSS
import styles from '@/components/forms/form.module.css';

//Components
import Button from '@/components/button/button';
import LoadingSpinner from '@/components/loading-spinner';

//Types
import type { User } from '@/types/user-types';
import type { GoalType } from '@/types/goal-types';
import type { UpdateUserDto } from '@/schemas/auth-schemas';


//Schemas
import type { updateSchema } from '@/schemas/auth-schemas';

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
  userId: string;
};

export default function UpdateUserForm({ userId }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [user, setUserData] = useState<User | null>(null);
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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


useEffect(() => {
  async function loadGoals() {
    try {
      const data = await GoalService.getAll();
      setGoals(data);
    } catch (error) {
      console.error(error);
    }
  }

  loadGoals();
}, []);

useEffect(() => {
  async function loadUser() {
    try {
      const fetchedUser = await UserService.getUserById(Number(userId));

      if (!fetchedUser) {
        // hantera användaren saknas
        return;
      }

      setUserData(fetchedUser);

      setFormData({
        email: fetchedUser.email,
        username: fetchedUser.username,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        phoneNumber: fetchedUser.phoneNumber,
        bodyWeight: fetchedUser.bodyWeight,
        height: fetchedUser.height,
        birthDate: fetchedUser.birthDate.split('T')[0],
        goalWeight: fetchedUser.goalWeight,
        goalDate: fetchedUser.goalDate?.split('T')[0] ?? '',
        goalTypeId: fetchedUser.goalTypeId,
        gender: fetchedUser.gender,
      });
    } catch (error) {
      console.error(error);
    }
  }

  loadUser();
}, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const numericFields = ['bodyWeight', 'bodyLenght', 'goalWeight', 'goalTypeId'];
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
    setIsLoading(true);
    const userData: UpdateUserDto = {
      email: formData.email,
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      bodyWeight: Number(formData.bodyWeight),
      bodyLenght: Number(formData.bodyLenght),
      birthDate: formData.birthDate,
      goalWeight: Number(formData.goalWeight),
      goalDate: formData.goalDate,
      goalTypeId: formData.goalTypeId,
      gender: formData.gender,
    } satisfies UpdateUserDto;

    //zod validation 
    const validation = updateSchema.safeParse(userData);

    //Show fields validation error meddages
    //If Validation is not success
    if (!validation.success) {
      const fieldErrors = Object.fromEntries(validation.error.issues.map((issue) => [issue.path[0], issue.message]));
      const errorValidationMessages = fieldErrors.error.issues.map((x) => x.message),
      setErrors(errorValidationMessages ?? {});
      
      return
    }



    try {
      const result = await UserService.update(userData, Number(userId));
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
      setIsLoading(false);
    }
  };

 

  

  //Show Loading spinner if loading is true or user is null
  if (!user || isLoading) {
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
              required
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
              required
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
              required
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
              required
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
              required
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
              required
              placeholder="Ex (40.2kg)"
              value={formData.bodyWeight}
              onChange={handleChange}
            />
            {errors.bodyWeight && <p className={styles.fieldErrorMessage}>{errors.bodyWeight}</p>}
          </div>
          {/* Body lenght */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaRulerVertical className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="bodyLenght">
                Längd (cm)
              </label>
            </div>
            <input
              className={styles.formInput}
              name="bodyLenght"
              type="number"
              step="0.1"
              id="bodyLenght"
              required
              placeholder="Ex (150.5cm)"
              value={formData.bodyLenght}
              onChange={handleChange}
            />
            {errors.bodyLenght && <p className={styles.fieldErrorMessage}>{errors.bodyLenght}</p>}
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
        <Button type="submit" text={isLoading ? 'Sparar...' : 'Spara'} variant="primary"></Button>
      </div>
    </form>
  );
}
