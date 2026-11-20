import LogWeightForm from '@/components/forms/log-weight/log-weight-form';

import Header from '@/components/layout/page-header';
import PageContainer from '@/components/layout/page-container';

export default function Create() {
  return (
    <PageContainer>
      <Header
        title="WEIGHT TRACKING"
        subTitle="Log weight"
        description="Record your weight and keep track of your progress over time."
        actions={[
          {
            label: 'Back to weight tracking',
            href: '/log-weight',
            variant: 'secondary',
          },
        ]}
      />

      <div className="flex justify-center">
        <LogWeightForm />
      </div>
    </PageContainer>
  );
}
