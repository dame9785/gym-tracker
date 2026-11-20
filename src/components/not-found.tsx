import Link from 'next/link';

export default function NotFoundComponent() {
  return (
    <section className="relative flex h-[calc(100dvh-64px)] items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="bg-primary/10 absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

      <div className="relative z-10 flex max-w-xl flex-col items-center px-4 text-center">
        <span className="from-primary via-primary to-primary bg-linear-to-r bg-clip-text text-9xl leading-none font-black tracking-tighter text-transparent drop-shadow-[0_0_30px_rgba(255,148,15,0.3)] md:text-[12rem]">404</span>

        <h1 className="text-text mt-6 text-3xl font-bold tracking-tight md:text-4xl">Page Not Found</h1>

        <p className="text-text-secondary max-w-md text-sm leading-6 md:text-base">Oops! It looks like the page youre looking for doesnt exist, has been moved, or never existed.</p>

        <Link href="/dashboard" className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary-hover hover:shadow-primary/40 mt-8 rounded-xl px-6 py-3 font-semibold shadow-lg transition-all duration-200 hover:scale-105">
          Till dashboard
        </Link>
      </div>
    </section>
  );
}
