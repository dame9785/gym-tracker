'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FaLock } from 'react-icons/fa6';

import styles from '@/components/forms/form.module.css';
import Button from '@/components/button/button';

import { resetPasswordAction } from '@/actions/user-actions';
import { resetPasswordSchema, type ResetPasswordDto } from '@/schemas/auth-schemas';
import Link from 'next/link';

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
        setErrors(response.errors ?? {});
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
      <div className={styles.formWrapper}>
        <h1 className={styles.formTitle}>
          Reset <span>Password</span>
        </h1>

        <p className={styles.formDescription}>Enter your email address and well send you a link to reset your password.</p>
      </div>

      <div className={styles.formGroup}>
        <div className={styles.labelWrapper}>
          <FaLock className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="newPassword">
            New password
          </label>
        </div>

        <input
          className={styles.formInput}
          type="password"
          id="newPassword"
          name="newPassword"
          autoComplete="new-password"
          value={formData.newPassword}
          onChange={handleChange}
        />

        {errors.newPassword?.[0] && <p className={styles.fieldErrorMessage}>{errors.newPassword[0]}</p>}
      </div>

      <div className={styles.formGroup}>
        <div className={styles.labelWrapper}>
          <FaLock className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="confirmNewPassword">
            Confirm new password
          </label>
        </div>

        <input
          className={styles.formInput}
          type="password"
          id="confirmNewPassword"
          name="confirmNewPassword"
          autoComplete="new-password"
          value={formData.confirmNewPassword}
          onChange={handleChange}
        />

        {errors.confirmNewPassword?.[0] && <p className={styles.fieldErrorMessage}>{errors.confirmNewPassword[0]}</p>}
      </div>

      <Button type="submit" variant="primary" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Reset password'}
      </Button>

      <Link href="/account/login" className={styles.backLink}>
        ← Back to login
      </Link>
    </form>
  );
}
