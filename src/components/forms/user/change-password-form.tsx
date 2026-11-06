'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FaLock } from 'react-icons/fa6';

import styles from '@/components/forms/form.module.css';
import Button from '@/components/button/button';

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
        setErrors(response.errors ?? {});
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
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formWrapper}>
        <h2 className={styles.formTitle}>
          Change <span>Password</span>
        </h2>
      </div>

      <div className={styles.formGroup}>
        <div className={styles.labelWrapper}>
          <FaLock className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="currentPassword">
            Current password
          </label>
        </div>

        <input
          className={styles.formInput}
          type="password"
          id="currentPassword"
          name="currentPassword"
          autoComplete="current-password"
          placeholder="Enter current password"
          value={formData.currentPassword}
          onChange={handleChange}
        />

        {errors.currentPassword?.[0] && <p className={styles.fieldErrorMessage}>{errors.currentPassword[0]}</p>}
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
          placeholder="Enter new password"
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
          placeholder="Confirm new password"
          value={formData.confirmNewPassword}
          onChange={handleChange}
        />

        {errors.confirmNewPassword?.[0] && <p className={styles.fieldErrorMessage}>{errors.confirmNewPassword[0]}</p>}
      </div>

      <div className="grid grid-2">
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Change password'}
        </Button>
      </div>
    </form>
  );
}
