import { IMG } from "@/lib/images";

export function Gallery() {
  return (
    <section id="gallery" className="py-24">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="max-w-2xl mb-10">
          <span className="text-xs uppercase tracking-[0.3em] neon-text">Gallery</span>
          <h2 className="text-display text-4xl md:text-6xl mt-3">Inside <span className="neon-text">Achiever Gym</span></h2>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
          {IMG.gallery.map((src, i) => (
            <div key={i} className={`mb-4 break-inside-avoid relative group overflow-hidden rounded-2xl ${i % 3 === 1 ? "aspect-[3/4]" : "aspect-square"}`}>
              <img src={src} loading="lazy" alt={`Achiever Gym interior ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 mix-blend-multiply transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
