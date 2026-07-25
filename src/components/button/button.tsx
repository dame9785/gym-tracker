import styles from './button.module.css';

type ButtonProps = {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'delete';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void | Promise<void>;
};

export default function Button({
  text,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
    >
      {text}
    </button>
  );
}
