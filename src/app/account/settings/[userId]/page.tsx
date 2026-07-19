import UpdateUserForm from '@/components/account/update-form';

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserSettings({ params }: PageProps) {
  const { userId } = await params;
  return <UpdateUserForm userId={userId} />;
}
