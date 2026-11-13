'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FaLock } from 'react-icons/fa6';
import { LockKeyhole } from 'lucide-react';

import FormStyles from '@/components/forms/form.module.css';

import Button from '@/components/button/button';
import FormPageHeader from '@/components/forms/shared/form-page-header';
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';

import { changePasswordAction } from '@/actions/user-actions';
import { changePasswordSchema, type ChangePasswordDto } from '@/schemas/auth-schemas';

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState<ChangePasswordDto>({
    currentPassword: '',
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

    const validation = changePasswordSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    try {
      const response = await changePasswordAction(validation.data);

      if (!response.success) {
        setErrors(Object.fromEntries(Object.entries(response.errors ?? {}).filter((entry): entry is [string, string[]] => entry[1] !== undefined)));

        toast.error(response.message);
        return;
      }

      toast.success(response.message);

      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className={`${FormStyles.form} mx-auto`} onSubmit={handleSubmit}>
      <FormPageHeader backHref="/account" backLabel="Back to account" showBackButton={false} eyebrow="Account security" title="Change" highlightedTitle="password" description="Keep your account secure by updating your password regularly." icon={LockKeyhole} />

      <div className={FormStyles.formGroup}>
        <FormField
          htmlFor="currentPassword"
          label={
            <span className="flex items-center gap-2">
              <FaLock className={FormStyles.formIcon} />
              Current password
            </span>
          }
          required
          error={errors.currentPassword?.[0]}
        >
          <FormInput type="password" id="currentPassword" name="currentPassword" autoComplete="current-password" placeholder="Enter current password" value={formData.currentPassword} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.currentPassword?.length} required />
        </FormField>
      </div>

      <div className={FormStyles.formGroup}>
        <FormField
          htmlFor="newPassword"
          label={
            <span className="flex items-center gap-2">
              <FaLock className={FormStyles.formIcon} />
              New password
            </span>
          }
          required
          error={errors.newPassword?.[0]}
        >
          <FormInput type="password" id="newPassword" name="newPassword" autoComplete="new-password" placeholder="Enter new password" value={formData.newPassword} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.newPassword?.length} required />
        </FormField>
      </div>

      <div className={FormStyles.formGroup}>
        <FormField
          htmlFor="confirmNewPassword"
          label={
            <span className="flex items-center gap-2">
              <FaLock className={FormStyles.formIcon} />
              Confirm new password
            </span>
          }
          required
          error={errors.confirmNewPassword?.[0]}
        >
          <FormInput type="password" id="confirmNewPassword" name="confirmNewPassword" autoComplete="new-password" placeholder="Confirm new password" value={formData.confirmNewPassword} onChange={handleChange} disabled={isSaving} aria-invalid={!!errors.confirmNewPassword?.length} required />
        </FormField>
      </div>

      <div className="grid-2 grid">
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Change password'}
        </Button>
      </div>
    </form>
  );
}
