export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="art-grain absolute inset-0" />
        <div className="animate-drift absolute -right-24 -top-20 h-72 w-72 rounded-full bg-cobalt/90 sm:h-96 sm:w-96 lg:right-10 lg:top-10" />
        <div className="absolute -right-10 top-48 h-40 w-40 rounded-full border-2 border-charcoal sm:h-56 sm:w-56 lg:right-48 lg:top-56" />
        <div className="absolute bottom-10 right-1/4 hidden h-24 w-24 rotate-12 rounded-2xl bg-cobalt-tint lg:block" />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-24 pt-20 sm:px-8 sm:pb-32 sm:pt-28 lg:pb-40 lg:pt-36">
        <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-cobalt">
          Anil Kumar · Hands-on AI projects
        </p>
        <h1
          id="hero-title"
          className="max-w-3xl text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-charcoal sm:text-6xl lg:text-7xl"
        >
          Turning ideas into useful AI projects.
        </h1>
        <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-charcoal-soft sm:text-xl">
          A collection of hands-on experiments by Anil Kumar — from multiplayer
          experiences to everyday automation.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a
            href="#projects"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-cobalt px-7 text-base font-semibold text-white transition-colors hover:bg-cobalt-dark"
          >
            Explore projects
          </a>
          <a
            href="#about"
            className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-charcoal bg-ivory/70 px-7 text-base font-semibold text-charcoal transition-colors hover:bg-charcoal hover:text-ivory"
          >
            About this portfolio
          </a>
        </div>
      </div>
    </section>
  );
}
