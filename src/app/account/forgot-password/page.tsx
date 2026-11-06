import ForgotPasswordForm from '@/components/forms/user/forgot-password-form';

export default function ForgotPasswordPage(): React.ReactElement {
  return (
    <div className="container">
      <div className="min-h-screen flex justify-center items-center">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
