import RegisterForm from '@/components/forms/user/register-user-form';
import GoalService from '@/services/goal-service.ts';
export default function Register() {
 const goals = await GoalService.getAll();
  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <RegisterForm />
      </div>
    </div>
  );
}
