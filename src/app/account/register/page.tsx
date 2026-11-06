
import RegisterForm from '@/components/forms/user/register-user-form';

export default function Register() {
  return (
    <div className="mx-auto w-full min-w-0 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-6xl justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
