import RegisterForm from '@/components/forms/user/register-user-form';
import GoalService from '@/services/goal-service.ts';
export default function Register() {
 const goals = await GoalService.getAll();
if(!goals){
//DTO: Do something here
}
  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <RegisterForm goals={goals}/>
      </div>
    </div>
  );
}
