'use client';

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
import '../form.css';

//Link
import Link from 'next/link';

export default function Register() {
  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center">
        <form className="form">
          <div className="form-intro-wrapper flex flex-col mb-[2em] items-center">
            <FaUser className="label-icon user" />
            <h1>
              Skapa
              <span> användare</span>
            </h1>
          </div>

          {/* EMAIL */}
          <div className="form-group flex flex-col gap=[0.5rem] mb-[1.2rem]">
            <div className="items-center input-label-wrapper gap-[10px] flex">
              <FaEnvelope className="label-icon" />
              <label htmlFor="email">Email</label>
            </div>
            <input type="email" id="email" required placeholder="E-post..." />
          </div>

          {/* USERNAME */}
          <div className="form-group mb-[1.2rem]">
            <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
              <FaUser className="label-icon" />
              <label htmlFor="username">Användarnamn</label>
            </div>
            <input type="text" id="username" maxLength={20} required placeholder="Användarnamn..." />
          </div>

          {/* NAME */}
          <div className="form-group mb-[1.2rem]">
            <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
              <FaSignature className="label-icon" />
              <label htmlFor="name">Namn</label>
            </div>
            <input type="text" id="name" maxLength={20} required placeholder="Namn..." />
          </div>

          {/* LAST NAME */}
          <div className="form-group mb-[1.2rem]">
            <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
              <FaSignature className="label-icon" />
              <label htmlFor="lastName">Efternamn</label>
            </div>
            <input type="text" maxLength={50} id="lastName" required placeholder="Efternamn..." />
          </div>

          {/* PHONE */}
          <div className="form-group mb-[1.2rem]">
            <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
              <FaPhone className="label-icon" />
              <label htmlFor="number">Nummer</label>
            </div>
            <input type="tel" id="number" maxLength={15} required placeholder="Telefonnummer..." />
          </div>

          {/* Body Weight */}
          <div className="form-group mb-[1.2rem]">
            <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
              <FaWeightScale className="label-icon" />
              <label htmlFor="bodyWeight">Kroppsvikt (kg)</label>
            </div>
            <input type="number" step="0.1" id="bodyWeight" required placeholder="Ex (40.2kg)" />
          </div>

          {/* Body lenght */}
          <div className="form-group mb-[1.2rem]">
            <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
              <FaRulerVertical className="label-icon" />
              <label htmlFor="bodyLenght">Längd (cm)</label>
            </div>
            <input type="number" step="0.1" id="bodyLenght" required placeholder="Ex (150.5cm)" />
          </div>

          {/* GENDER */}
          <div className="form-group mb-[1.2rem]">
            <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
              <FaMars className="label-icon" />
              <label htmlFor="gender">Kön</label>
            </div>
            <select id="gender" className="select">
              <option value="">Välj kön</option>
              <option value={0}>Man</option>
              <option value={1}>Kvinna</option>
            </select>
          </div>

          {/* Birth */}
          <div className="form-group mb-[1.2rem]">
            <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
              <FaCakeCandles className="label-icon" />
              <label htmlFor="birth">Född</label>
            </div>
            <input type="date" id="birth" placeholder="1997-09-26"></input>
          </div>

          {/* Goal */}
          <div className="form-group mb-[1.2rem]">
            <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
              <FaBullseye className="label-icon" />
              <label htmlFor="goal">Mål</label>
            </div>
            <select className="select" id="goal">
              <option value="0">Välj mål</option>
              <option value="1">Bygga muskler</option>
              <option value="2">Gå ner i vikt</option>
              <option value="3">Gå upp i vikt</option>
              <option value="4">Bli starkare</option>
              <option value="5">Uthållighet</option>
            </select>
          </div>

          {/* Goal weight*/}
          <div className="form-group mb-[1.2rem]">
            <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
              <FaWeightHanging className="label-icon" />
              <label>Mål vikt (kg)</label>
            </div>
            <input type="number" step="0.1" placeholder="Ex: 75" />
          </div>

          {/* Goal Date */}
          <div className="form-group mb-[1.2rem]">
            <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
              <FaFlagCheckered className="label-icon" />
              <label htmlFor="goalDate">Måldatum</label>
            </div>
            <input type="date" id="goalDate" />
          </div>

          {/* PASSWORD */}
          <div className="form-group mb-[1.2rem]">
            <div className="items-center input-label-wrapper mb-[0.5rem] gap-[10px] flex">
              <FaLock className="label-icon" />
              <label htmlFor="password">Lösenord</label>
            </div>

            <input type="password" id="password" required placeholder="Lösenord..." />
          </div>
          <div className="grid grid-2">
            <button className="btn btn-primary text-center">Skapa konto</button>
            <Link href="/login" className="btn btn-secondary text-center">
              Gå tillbaks
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
