type ErrorMessageProps = {
  title?: string;
  message?: string;
};

export default function ErrorMessage({ title = 'Something went wrong', message = 'We were unable to load the content. Please try again.' }: ErrorMessageProps) {
  return (
    <div className="flex min-h-75 items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-zinc-900/60 p-8 text-center shadow-xl shadow-black/20">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-2xl font-bold text-red-400">
          !
        </div>

        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{message}</p>
        <div className="mt-6 h-px bg-zinc-800" />
        <p className="mt-4 text-xs text-zinc-500">Please refresh the page and try again.</p>
      </div>
    </div>
  );
}
