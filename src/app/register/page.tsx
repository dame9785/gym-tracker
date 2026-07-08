'use client';

import RegisterForm from '../../components/auth/RegisterForm';

export default function Register() {
  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center">
        <RegisterForm />
      </div>
    </div>
  );
}
