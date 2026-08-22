/* Services */
import GoalTypesService from '@/services/goal-service';

/* Components */
import RegisterForm from '@/components/forms/user/register-user-form';

export default async function Register() {
  /* Fetch all goal types */
  const response = await GoalTypesService.getAll();
  if (!response.success) {
    throw new Error('Något gick fel');
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
