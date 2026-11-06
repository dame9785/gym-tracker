import Link from 'next/link';

import ResetPasswordForm from '@/components/forms/user/reset-password-form';

interface Props {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="container mx-auto flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold">Invalid password reset link</h1>

          <p className="mt-4">The password reset link is missing or invalid.</p>

          <Link href="/account/forgot-password" className="mt-6 inline-block text-orange-500 hover:text-orange-400">
            Request a new reset link
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}
