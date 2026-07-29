'use client';

//Next Link
import Link from 'next/link';
import { useRouter } from 'next/navigation';

//React hooks
import { useState } from 'react';

//Modules
import FormStyles from '@/components/forms/form.module.css';

//Components
import Button from '@/components/button/button';
import { LogWeightDto } from '@/dto/log-weight-dto';
import { LogWeightService } from '@/services/log-weight-service';
import { toast } from 'sonner';

export default function LogWeightForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LogWeightDto>({
    weight: 0,
    note: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSumbit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const LogWeightDto: LogWeightDto = {
      weight: formData.weight,
      note: formData.note,
    };

    const result = await LogWeightService.create(LogWeightDto);
    if (typeof result === 'string') {
      toast.error(result);
      return;
    }

    if (result.success) {
      toast.success(result.message);
      router.push('/log-weight');
    }
  };

  return (
    <div className={FormStyles.formContainer}>
      <h1 className={FormStyles.formTitle}>
        Lägg till
        <span> Vikt</span>
      </h1>
      <form className={FormStyles.form} onSubmit={handleSumbit}>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="weight">
            Vikt
          </label>
          <input
            className={FormStyles.formInput}
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            min="1"
            required
            placeholder="T.ex. 50"
            onChange={handleChange}
          ></input>
        </div>
        <div className={FormStyles.formGroup}>
          <label className={FormStyles.formLabel} htmlFor="note">
            Notering
          </label>
          <textarea
            className={FormStyles.formInput}
            id="note"
            name="note"
            required
            placeholder="T.ex. morgonen"
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="flex gap-2">
          <Button type="submit" text="Logga vikt" variant="primary"></Button>
          <Link href="/log-weight">
            <Button type="button" text="Gå tillbaks" variant="secondary" />
          </Link>
        </div>
      </form>
    </div>
  );
}
