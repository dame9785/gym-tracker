'use client';

//CSS
import styles from '@/components/form.module.css';

//Components
import Button from '@/components/button/button';

//Services
// import UserService from '@/services/user.service';
// import { getGoals } from '@/services/goal.service';

//React Routing
import { useState, useEffect } from 'react';

//Gender Enum
import { Gender } from '@prisma/client';

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

interface UpdateUserFormProps {
  userId: string;
}

interface GoalType {
  id: number;
  title: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bodyWeight: number;
  bodyLenght: number;
  goalTypeId: number;
  gender: Gender;
  birthDate: string;
  goalWeight: number;
  goalDate: string;
}

interface UserFormData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bodyWeight: number;
  bodyLenght: number;
  birthDate: string;
  goalWeight: number;
  goalDate: string;
  goalTypeId: number;
}

interface UpdateResult {
  errors: string[];
  message: string;
  success: boolean;
}

export default function UpdateUserForm({ userId }: UpdateUserFormProps) {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [user, setUserData] = useState<User | null>(null);
  const [goals, setGoals] = useState<GoalType[]>([]);

  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    bodyWeight: 0,
    bodyLenght: 0,
    birthDate: '',
    goalWeight: 0,
    goalDate: '',
    goalTypeId: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData: UserFormData = {
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
    };

    const result: UpdateResult = await UserService.updateUser(userData, userId);
    if (!result.success) {
      setErrorMessages(result.errors);
    }

    //Tömmer fel meddelandet
    setErrorMessages([]);
  };

  //Get all goals
  useEffect(() => {
    async function loadGoals() {
      try {
        const data = await getGoals();

        setGoals(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadGoals();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser: User = await UserService.getUserById(userId);

      setUserData(fetchedUser);
      setFormData({
        email: fetchedUser.email,
        username: fetchedUser.username,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        phoneNumber: fetchedUser.phoneNumber,
        bodyWeight: fetchedUser.bodyWeight,
        bodyLenght: fetchedUser.bodyLenght,
        birthDate: fetchedUser.birthDate.split('T')[0],
        goalWeight: fetchedUser.goalWeight,
        goalDate: fetchedUser.goalDate?.split('T')[0] ?? '',
        goalTypeId: fetchedUser.goalTypeId,
      });
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return <p>Laddar...</p>;
  }

  return (
    <form className={styles.form} onSubmit={handleSumbit}>
      <div className={styles.formWrapper}>
        <h1 className={styles.formTitle}>
          Ändra konto
          <span> Inställningar</span>
        </h1>
        {errorMessages.length > 0 && (
          <div className={styles.formErrorMessage}>
            <ul>
              {errorMessages.map((error) => (
                <li key={error}>
                  {'-'}
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
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
          </div>
        </div>

        <div className="form-right">
          {/* Body Weight */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaWeightScale className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="weight">
                Kroppsvikt (kg)
              </label>
            </div>
            <input
              className={styles.formInput}
              name="weight"
              type="number"
              step="0.1"
              id="weight"
              required
              placeholder="Ex (40.2kg)"
              value={formData.bodyWeight}
              onChange={handleChange}
            />
          </div>
          {/* Body lenght */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaRulerVertical className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="lenght">
                Längd (cm)
              </label>
            </div>
            <input
              className={styles.formInput}
              name="lenght"
              type="number"
              step="0.1"
              id="lenght"
              required
              placeholder="Ex (150.5cm)"
              value={formData.bodyLenght}
              onChange={handleChange}
            />
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
          </div>

          {/* Goal */}
          <div className={styles.formGroup}>
            <div className={styles.labelWrapper}>
              <FaBullseye className={styles.formIcon} />
              <label className={styles.formLabel} htmlFor="goal">
                Mål
              </label>
            </div>
            <select
              className={styles.formSelect}
              name="goalTypeId"
              value={user.goalTypeId}
              onChange={handleChange}
            >
              <option value="">Välj mål</option>

              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
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
          </div>
        </div>
      </div>
      <div className="grid grid-2">
        <Button type="submit" text="Uppdatera konto" variant="primary"></Button>
      </div>
    </form>
  );
}
