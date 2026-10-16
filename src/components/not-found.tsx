import Link from 'next/link';

export default function NotFoundComponent() {
  return (
    <section className="relative flex h-[calc(100dvh-64px)] items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-3xl" />

      <div className="relative z-10 flex max-w-xl flex-col items-center px-4 text-center">
        <span className="bg-linear-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-9xl font-black leading-none tracking-tighter text-transparent drop-shadow-[0_0_30px_rgba(217,70,239,0.3)] md:text-[12rem]">
          404
        </span>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white md:text-4xl">Page Not Found</h1>

        <p className=" max-w-md text-sm leading-6 text-slate-400 md:text-base">
          Oops! It looks like the page youre looking for doesnt exist, has been moved, or never existed.
        </p>

        <Link
          href="/dashboard"
          className="mt-8 rounded-xl bg-linear-to-r from-orange-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition-all duration-200 hover:scale-105 hover:shadow-fuchsia-500/40"
        >
          Till dashboard
        </Link>
      </div>
    </section>
  );
}
