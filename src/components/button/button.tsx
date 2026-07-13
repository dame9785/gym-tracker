import styles from './button.module.css';

type ButtonProps = {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  onClick?: () => void | Promise<void>;
};

export default function Button({ text, type = 'button', variant = 'primary', onClick }: ButtonProps) {
  return (
    <button onClick={onClick} type={type} className={`${styles.button} ${styles[variant]}`}>
      {text}
    </button>
  );
}
