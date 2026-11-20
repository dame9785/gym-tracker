import WeightForm from '@/components/forms/log-weight/edit-weight-form';

import ErrorMessage from '@/components/ui/error-message';
import Header from '@/components/layout/page-header';
import PageContainer from '@/components/layout/page-container';

import { requireAuth } from '@/lib/auth';
import { WeightLogService } from '@/services/weight-log-service';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const weightLogService = new WeightLogService();

export default async function EditWeight({ params }: Props) {
  const user = await requireAuth();

  const { id } = await params;

  const response = await weightLogService.getById(Number(id), user.userId);

  if (!response.success || !response.data) {
    return (
      <PageContainer>
        <ErrorMessage title="Unable to load weight entry" message={response.message ?? 'Something went wrong while loading your weight entry.'} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header
        title="WEIGHT TRACKING"
        subTitle="Edit weight"
        description="Update your weight entry and keep your progress accurate."
        actions={[
          {
            label: 'Back to weight tracking',
            href: '/log-weight',
            variant: 'secondary',
          },
        ]}
      />

      <div className="flex justify-center">
        <WeightForm logWeight={response.data} />
      </div>
    </PageContainer>
  );
}
