const steps = [
  { title: "Build", text: "Turn an idea into a small, working project." },
  { title: "Test", text: "Try it on real devices and in real situations." },
  { title: "Refine", text: "Improve it using the feedback that comes back." },
];

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="relative isolate overflow-hidden border-t border-line bg-midnight"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-cobalt/20 blur-3xl" />
      </div>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-ice">
          About
        </p>
        <h2
          id="about-title"
          className="max-w-3xl text-balance font-serif text-3xl font-semibold leading-snug tracking-tight text-ivory sm:text-4xl lg:text-5xl"
        >
          I&apos;m Anil Kumar. I&apos;m learning by building practical AI projects,
          testing them, and improving them through feedback.
        </h2>
        <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-ivory-soft">
          This page shares descriptions of the work, not private account data.
          Private workflows are described in words only, with no links, messages,
          calendar entries or contact details.
        </p>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-3xl border border-line bg-navy/80 p-7"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cobalt font-semibold text-white"
              >
                {index + 1}
              </span>
              <h3 className="mt-5 font-serif text-2xl font-semibold text-ivory">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-ivory-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
