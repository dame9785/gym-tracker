import styles from './button.module.css';

type ButtonProps = {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
};

export default function Button({ text, type = 'button', variant = 'primary' }: ButtonProps) {
  return (
    <button type={type} className={`${styles.button} ${styles[variant]}`}>
      {text}
    </button>
  );
}
