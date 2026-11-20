type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function PageContainer({ children, className = '' }: Props) {
  return <div className={`mx-auto w-full max-w-350 min-w-0 space-y-8 ${className}`}>{children}</div>;
}
