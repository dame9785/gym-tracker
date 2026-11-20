import RegisterForm from '@/components/forms/exercise/register-exercise-form';

import Header from '@/components/layout/page-header';
import PageContainer from '@/components/layout/page-container';

export default function RegisterExercise() {
  return (
    <PageContainer>
      <Header
        title="YOUR EXERCISES"
        subTitle="Create exercise"
        description="Create an exercise with muscle groups, instructions and technique tips so you can use it in your workouts."
        actions={[
          {
            label: 'Back to exercises',
            href: '/exercises',
            variant: 'secondary',
          },
        ]}
      />

      <RegisterForm />
    </PageContainer>
  );
}
