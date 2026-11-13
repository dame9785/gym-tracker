'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FaEnvelope } from 'react-icons/fa6';
import { MailCheck, MailQuestion } from 'lucide-react';
import Link from 'next/link';

import styles from '@/components/forms/form.module.css';

import Button from '@/components/button/button';
import FormPageHeader from '@/components/forms/shared/form-page-header';
import FormField from '@/components/ui/form-field';
import FormInput from '@/components/ui/form-input';

import { forgotPasswordAction } from '@/actions/user-actions';
import { forgotPasswordSchema, type ForgotPasswordDto } from '@/schemas/auth-schemas';

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
      <div className={`${styles.form} ${styles.authForm}`}>
        <FormPageHeader backHref="/account/login" backLabel="Back to login" eyebrow="Password recovery" title="Check your" highlightedTitle="email" description="If an account exists for this email address, you will receive a password reset link shortly. Please check your inbox." icon={MailCheck} />

        <p className={styles.formDescription}>Dont forget to check your spam folder.</p>

        <Link href="/account/login" className={styles.backLink}>
          ← Back to login
        </Link>
      </div>
    );
  }

  return (
    <form className={`${styles.form} ${styles.authForm}`} onSubmit={handleSubmit}>
      <FormPageHeader backHref="/account/login" backLabel="Back to login" eyebrow="Account recovery" title="Forgot" highlightedTitle="password?" description="Enter your email address and we'll send you a link to reset your password." icon={MailQuestion} />

      <div className={styles.formGroup}>
        <FormField
          htmlFor="email"
          label={
            <span className="flex items-center gap-2">
              <FaEnvelope className={styles.formIcon} />
              Email
            </span>
          }
          required
          error={errors.email?.[0]}
        >
          <FormInput
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              setErrors((prev) => {
                const updatedErrors = { ...prev };
                delete updatedErrors.email;
                return updatedErrors;
              });
            }}
            disabled={isSubmitting}
            aria-invalid={!!errors.email?.length}
            required
          />
        </FormField>
      </div>

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send reset link'}
      </Button>
    </form>
  );
}
