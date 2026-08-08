import styles from './button.module.css';

type ButtonProps = {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'delete';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
};

export default function Button({ text, type = 'button', variant = 'primary', size = 'md', onClick, disabled = false }: ButtonProps) {
  return (
    <button disabled={disabled} onClick={onClick} type={type} className={`${styles.button} ${styles[variant]} ${styles[size]}`}>
      {text}
    </button>
  );
}
