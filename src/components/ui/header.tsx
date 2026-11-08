import Button from '../button/button';

type Props = {
  title: string;
  subTitle: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
};

export default function Header({ title, subTitle, description, action }: Props) {
  return (
    <header className="mb-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-orange-400 uppercase">{title}</p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{subTitle}</h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">{description}</p>
        </div>

        {action && (
          <div className="flex flex-col gap-3 min-[420px]:flex-row sm:shrink-0">
            <Button href={action.href} variant="primary">
              {action.label}
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8 h-px w-full bg-linear-to-r from-orange-500/40 via-zinc-800 to-transparent" />
    </header>
  );
}
