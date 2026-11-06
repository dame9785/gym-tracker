'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FaEnvelope } from 'react-icons/fa6';

import styles from '@/components/forms/form.module.css';
import Button from '@/components/button/button';

import { forgotPasswordAction } from '@/actions/user-actions';
import { forgotPasswordSchema, type ForgotPasswordDto } from '@/schemas/auth-schemas';

import Link from 'next/link';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: ForgotPasswordDto = { email };
    const validation = forgotPasswordSchema.safeParse(formData);

    if (!validation.success) {
      setErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await forgotPasswordAction(validation.data);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      setSubmitted(true);
      toast.success(response.message);
    } catch (error) {
      console.error('Forgot password failed:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.form}>
        <h1 className={styles.formTitle}>Check your email</h1>

        <p className={styles.formDescription}>Enter your email address and well send you a link to reset your password.</p>
      </div>
    );
  }

  return (
    <form className={`${styles.form} ${styles.authForm}`} onSubmit={handleSubmit}>
      <div className={styles.formWrapper}>
        <h1 className={styles.formTitle}>
          Forgot <span>Password?</span>
        </h1>

        <p className={styles.formDescription}>Enter your email address and well send you a link to reset your password.</p>
      </div>

      <div className={styles.formGroup}>
        <div className={styles.labelWrapper}>
          <FaEnvelope className={styles.formIcon} />
          <label className={styles.formLabel} htmlFor="email">
            Email
          </label>
        </div>

        <input
          className={styles.formInput}
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {errors.email?.[0] && <p className={styles.fieldErrorMessage}>{errors.email[0]}</p>}
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send reset link'}
      </Button>

      <Link href="/account/login" className={styles.backLink}>
        ← Back to login
      </Link>
    </form>
  );
}
