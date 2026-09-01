/* Services */
import { GoalTypesService } from '@/services-server/goal-service';

/* Components */
import RegisterForm from '@/components/forms/user/register-user-form';
import { redirect } from 'next/navigation';

const goalTypeService = new GoalTypesService();
export default async function Register() {
  /* Fetch all goal types */
  const response = await goalTypeService.getAllGoals();
  if (!response.success || response.data === undefined) {
    redirect('/account/login');
  }

  //Goals Data
  const goals = response.data;

  return (
    <div className="container">
      <div className="form-wrapper flex justify-start items-center m-[5em]">
        <RegisterForm goals={goals} />
      </div>
    </div>
  );
}
