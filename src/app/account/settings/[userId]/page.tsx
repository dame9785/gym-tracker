import UpdateUserForm from '@/components/account/update-form';

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function UserSettings({ params }: PageProps) {
  const { userId } = await params;
  return (
    <div className="container">
      <div className="form-wrapper flex justify-center items-center m-[5em]">
        <UpdateUserForm userId={userId} />
      </div>
    </div>
  );
}
