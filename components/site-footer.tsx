export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-midnight text-ivory">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-ivory-soft">Anil Builds · Built to learn, shared to improve.</p>
        <a
          href="https://github.com/anilvirajj97-png/anil-builds-portfolio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ivory underline underline-offset-4 hover:text-ice"
        >
          View source on GitHub
        </a>
      </div>
    </footer>
  );
}
