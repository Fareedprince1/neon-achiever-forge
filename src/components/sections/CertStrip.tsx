const certs = ["ACE", "NASM", "CROSSFIT", "TECHNOGYM", "HAMMER STRENGTH"];

export function CertStrip() {
  return (
    <section className="py-16 border-y border-border">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-8">
          <h3 className="text-display text-2xl md:text-3xl">Certified. Trusted. <span className="neon-text">Recognized.</span></h3>
        </div>
        <div className="flex flex-wrap items-center justify-around gap-8 opacity-70">
          {certs.map((c) => (
            <span key={c} className="text-display text-xl tracking-widest hover:neon-text hover:opacity-100 transition-all hover:drop-shadow-[0_0_8px_rgba(200,244,0,0.6)]">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
