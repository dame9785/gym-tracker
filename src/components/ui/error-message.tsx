type ErrorMessageProps = {
  title?: string;
  message?: string;
  footerMessage?: string;
  fullHeight?: boolean;
};

export default function ErrorMessage({ title = 'Something went wrong', message = 'We were unable to load the content. Please try again.', footerMessage = 'Please refresh the page and try again.', fullHeight = false }: ErrorMessageProps) {
  return (
    <div className={`flex items-center justify-center ${fullHeight ? 'min-h-[60vh]' : 'min-h-75'}`}>
      <div role="alert" aria-live="assertive" className="border-danger/20 bg-surface/60 w-full max-w-md rounded-2xl border p-8 text-center shadow-xl shadow-black/20">
        <div aria-hidden="true" className="border-danger/30 bg-danger/10 text-danger mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border text-2xl font-bold">
          !
        </div>

        <h2 className="text-text text-xl font-semibold">{title}</h2>

        <p className="text-text-secondary mt-3 text-sm leading-6">{message}</p>

        {footerMessage && (
          <>
            <div className="bg-border mt-6 h-px" />

            <p className="text-text-muted mt-4 text-xs">{footerMessage}</p>
          </>
        )}
      </div>
    </div>
  );
}
