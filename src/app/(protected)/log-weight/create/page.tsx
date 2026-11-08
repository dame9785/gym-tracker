//Components
import LogWeightForm from '@/components/forms/log-weight/log-weight-form';

export default async function create() {
  return (
    <div className="container">
      <div className="form-wrapper flex items-center justify-center">
        <LogWeightForm />
      </div>
    </div>
  );
}
