'use strict';

//FONTAWSOME ICONS
import {
  FaEnvelope,
  FaWeightScale,
  FaPhone,
  FaRulerVertical,
  FaMars,
  FaCakeCandles,
  FaBullseye,
  FaWeightHanging,
  FaFlagCheckered,
  FaUser,
  FaSignature,
  FaLock,
} from 'react-icons/fa6';

//CSS
import styles from './Form.module.css';

//Link
import Link from 'next/link';
import { useState } from 'react';

function RegisterForm() {
  type RegisterRequest = {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    weight: number;
    height: number;
    lenght: number;
    gender: number;
    birthDate: string;
    goal: number;
    goalWeight: number;
    goalDate: string;
    password: string;
  };

  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [weight, setWeight] = useState('');
  const [lenght, setLenght] = useState('');
  const [gender, setGender] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [password, setPassword] = useState('');
  const [goal, setGoal] = useState('');

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user: RegisterRequest = {
      email,
      username: userName,
      firstName: name,
      lastName,
      phoneNumber,
      weight: Number(weight),
      height: Number(lenght),
      lenght: Number(lenght),
      gender: Number(gender),
      birthDate,
      goal: Number(goal),
      goalWeight: Number(goalWeight),
      goalDate,
      password,
    };

    console.log('Registed User Data', user);
    return;
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    console.log(response);
  };

  return (
    <form className={styles.form} onSubmit={handleSumbit}>
      <div className={styles.formWrapper}>
        <h1 className={styles.formTitle}>
          Registera
          <span>Konto</span>
        </h1>
      </div>

      {/* EMAIL */}
      <div className="form-group flex flex-col gap=[0.5rem] mb-[1.2rem]">
        <div className="items-center input-label-wrapper gap-[10px] flex">
          <FaEnvelope className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="email">
            Email
          </label>
        </div>
        <input type="email" id="email" required placeholder="E-post..." onChange={(e) => setEmail(e.target.value)} />
      </div>

      {/* USERNAME */}
      <div className={styles.formGroup}>
        <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
          <FaUser className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="username">
            Användarnamn
          </label>
        </div>
        <input
          type="text"
          id="username"
          maxLength={20}
          required
          placeholder="Användarnamn..."
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      {/* NAME */}
      <div className={styles.formGroup}>
        <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
          <FaSignature className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="name">
            Namn
          </label>
        </div>
        <input
          type="text"
          id="name"
          maxLength={20}
          required
          placeholder="Namn..."
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* LAST NAME */}
      <div className={styles.formGroup}>
        <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
          <FaSignature className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="lastName">
            Efternamn
          </label>
        </div>
        <input
          type="text"
          maxLength={50}
          id="lastName"
          required
          placeholder="Efternamn..."
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      {/* PHONE */}
      <div className={styles.formGroup}>
        <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
          <FaPhone className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="number">
            Nummer
          </label>
        </div>
        <input
          type="tel"
          id="number"
          maxLength={15}
          required
          placeholder="Telefonnummer..."
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>

      {/* Body Weight */}
      <div className={styles.formGroup}>
        <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
          <FaWeightScale className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="weight">
            Kroppsvikt (kg)
          </label>
        </div>
        <input
          type="number"
          step="0.1"
          id="weight"
          required
          placeholder="Ex (40.2kg)"
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      {/* Body lenght */}
      <div className={styles.formGroup}>
        <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
          <FaRulerVertical className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="lenght">
            Längd (cm)
          </label>
        </div>
        <input
          type="number"
          step="0.1"
          id="lenght"
          required
          placeholder="Ex (150.5cm)"
          onChange={(e) => setLenght(e.target.value)}
        />
      </div>

      {/* GENDER */}
      <div className={styles.formGroup}>
        <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
          <FaMars className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="gender">
            Kön
          </label>
        </div>
        <select id="gender" className="select" onChange={(e) => setGender(e.target.value)}>
          <option value="">Välj kön</option>
          <option value={0}>Man</option>
          <option value={1}>Kvinna</option>
        </select>
      </div>

      {/* Birth */}
      <div className={styles.formGroup}>
        <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
          <FaCakeCandles className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="birth">
            Född
          </label>
        </div>
        <input type="date" id="birth" placeholder="1997-09-26" onChange={(e) => setBirthDate(e.target.value)} />
      </div>

      {/* Goal */}
      <div className={styles.formGroup}>
        <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
          <FaBullseye className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="goal">
            Mål
          </label>
        </div>
        <select className="select" id="goal" onChange={(e) => setGoal(e.target.value)}>
          <option value="0">Välj mål</option>
          <option value="1">Bygga muskler</option>
          <option value="2">Gå ner i vikt</option>
          <option value="3">Gå upp i vikt</option>
          <option value="4">Bli starkare</option>
          <option value="5">Uthållighet</option>
        </select>
      </div>

      {/* Goal weight*/}
      <div className={styles.formGroup}>
        <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
          <FaWeightHanging className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="goalWeight">
            Mål vikt (kg)
          </label>
        </div>
        <input
          type="number"
          step="0.1"
          placeholder="Ex: 75"
          id="goalWeight"
          onChange={(e) => setGoalWeight(e.target.value)}
        />
      </div>

      {/* Goal Date */}
      <div className={styles.formGroup}>
        <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
          <FaFlagCheckered className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="goalDate">
            Måldatum
          </label>
        </div>
        <input type="date" id="goalDate" onChange={(e) => setGoalDate(e.target.value)} />
      </div>

      {/* PASSWORD */}
      <div className={styles.formGroup}>
        <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
          <FaLock className={styles.formIcon} />
          <label htmlFor="password" className={styles.formLabel}>
            Lösenord
          </label>
        </div>

        <input
          type="password"
          id="password"
          required
          placeholder="Lösenord..."
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="grid grid-2">
        <button className="btn btn-primary text-center">Skapa konto</button>
        <Link href="/login" className="btn btn-secondary text-center">
          Gå tillbaks
        </Link>
      </div>
    </form>
  );
}

export default RegisterForm;
