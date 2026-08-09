/* Services */
import GoalTypesService from '@/services/goal-types-service';

/* Components */
import RegisterForm from '@/components/forms/user/register-user-form';
import LoadingSpinner from '@/components/loading-spinner';

export default async function Register() {
  /* Fetch all goal types */
  const response = await GoalTypesService.getAll();

  if (!response.success || response.data == null) {
    return <LoadingSpinner />;
  }

  //Goals Data
  const goals = response.data.goals;

  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <RegisterForm goals={goals} />
      </div>
    </div>
  );
}
