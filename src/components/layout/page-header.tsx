import Button from '../button/button';

type HeaderAction = {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
};

type Props = {
  title: string;
  subTitle: string;
  description?: string;
  actions?: HeaderAction[];
};

export default function Header({ title, subTitle, description, actions = [] }: Props) {
  return (
    <header className="mb-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-primary mb-2 text-xs font-semibold tracking-[0.2em] uppercase">{title}</p>

          <h1 className="text-text text-3xl font-bold tracking-tight sm:text-4xl">{subTitle}</h1>

          {description && <p className="text-text-secondary mt-3 text-sm leading-6 sm:text-base">{description}</p>}
        </div>

        {actions.length > 0 && (
          <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:shrink-0 [&>a]:flex [&>a]:h-10 [&>a]:w-full [&>a]:items-center [&>a]:justify-center [&>a]:whitespace-nowrap">
            {actions.map((action) => (
              <Button key={action.href} href={action.href} variant={action.variant ?? 'primary'}>
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="from-primary/40 via-border mt-8 h-px w-full bg-linear-to-r to-transparent" />
    </header>
  );
}
