//FONTAWSOME ICONS
import { FaEnvelope, FaLock, FaDumbbell } from 'react-icons/fa6';

//Link
import Link from 'next/link';

//CSS
import '../form.css';

export default function login() {
  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center">
        <form className="form">
          <div className="form-intro-wrapper flex flex-col items-center mb-[3rem]">
            <FaDumbbell className="label-icon dumbell" />
            <h1>
              Gym
              <span>Tracker</span>
            </h1>
          </div>
          <div className="form-group flex flex-col gap-[10px] mb-[2rem]">
            <div className="flex items-center gap-4">
              <FaEnvelope className="label-icon" />
              <label htmlFor="email">E-mail</label>
            </div>
            <input required type="text" placeholder="E-mail.." id="email"></input>
          </div>
          <div className="form-group flex flex-col gap-[10px] mb-[2rem]">
            <div className="flex items-center items-center gap-4">
              <FaLock className="label-icon" />
              <label htmlFor="email">Lösenord</label>
            </div>
            <input required type="password" id="password" placeholder="Lösenord.."></input>
          </div>
          <div className="grid grid-2">
            <button type="submit" className="btn btn-primary text-center">
              Logga in
            </button>
            <Link href="/register" className="btn btn-secondary text-center">
              Registera konto
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
