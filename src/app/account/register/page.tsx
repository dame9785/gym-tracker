/* Components */
import RegisterForm from '@/components/forms/user/register-user-form';

export default async function Register() {
  return (
    <div className="container">
      <div className="form-wrapper flex justify-start items-center m-[5em]">
        <RegisterForm />
      </div>
    </div>
  );
}
