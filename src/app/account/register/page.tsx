import { GoalTypesService } from '@/services-server/goal-service';
import RegisterForm from '@/components/forms/user/register-user-form';

const goalTypesService = new GoalTypesService();

export default async function Register() {
  const goals = await goalTypesService.getAllGoals();

  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <RegisterForm goals={goals} />
      </div>
    </div>
  );
}
