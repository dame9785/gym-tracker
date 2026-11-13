'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FaLock } from 'react-icons/fa6';

import styles from '@/components/forms/form.module.css';

import Button from '@/components/button/button';
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';

import { resetPasswordAction } from '@/actions/user-actions';
import { resetPasswordSchema, type ResetPasswordDto } from '@/schemas/auth-schemas';

import FormPageHeader from '@/components/forms/shared/form-page-header';
import { LockKeyhole } from 'lucide-react';

interface Props {
  token: string;
}

export default function ResetPasswordForm({ token }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState<ResetPasswordDto>({
    token,
    newPassword: '',
    confirmNewPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[name];

      return updatedErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = resetPasswordSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = await resetPasswordAction(validation.data);

      if (!response.success) {
        setErrors(Object.fromEntries(Object.entries(response.errors ?? {}).filter((entry): entry is [string, string[]] => entry[1] !== undefined)));
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.push('/account/login');
    } catch (error) {
      console.error('Failed to reset password:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className={`${styles.form} ${styles.authForm}`} onSubmit={handleSubmit}>
      <FormPageHeader backHref="/account/login" backLabel="Back to login" eyebrow="Account security" title="Reset" highlightedTitle="password" description="Choose a new password for your account." icon={LockKeyhole} />

      <div className={styles.formGroup}>
        <FormField
          htmlFor="newPassword"
          label={
            <span className="flex items-center gap-2">
              <FaLock className={styles.formIcon} />
              New password
            </span>
          }
          required
          error={errors.newPassword?.[0]}
        >
          <FormInput type="password" id="newPassword" name="newPassword" autoComplete="new-password" value={formData.newPassword} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.newPassword?.length} required />
        </FormField>
      </div>

      <div className={styles.formGroup}>
        <FormField
          htmlFor="confirmNewPassword"
          label={
            <span className="flex items-center gap-2">
              <FaLock className={styles.formIcon} />
              Confirm new password
            </span>
          }
          required
          error={errors.confirmNewPassword?.[0]}
        >
          <FormInput type="password" id="confirmNewPassword" name="confirmNewPassword" autoComplete="new-password" value={formData.confirmNewPassword} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.confirmNewPassword?.length} required />
        </FormField>
      </div>

      <Button type="submit" variant="primary" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Reset password'}
      </Button>
    </form>
  );
}
