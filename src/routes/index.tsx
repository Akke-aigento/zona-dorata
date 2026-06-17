import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TrustBar } from "@/components/site/TrustBar";
import { Diamond } from "@/components/site/Diamond";
import perfumesAsset from "@/assets/worlds/perfumes.png.asset.json";
import jewelleryAsset from "@/assets/worlds/jewellery.png.asset.json";
import clothesAsset from "@/assets/worlds/clothes.png.asset.json";
import artworksAsset from "@/assets/worlds/artworks.png.asset.json";

const perfumesImg = perfumesAsset.url;
const jewelleryImg = jewelleryAsset.url;
const clothesImg = clothesAsset.url;
const artworksImg = artworksAsset.url;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zona Dorata — Choose Your World" },
      {
        name: "description",
        content:
          "Milanese luxury: perfumes, jewellery, artworks and designer clothes. Benvenuto in Zona Dorata.",
      },
      { property: "og:title", content: "Zona Dorata — Choose Your World" },
      {
        property: "og:description",
        content: "A calm Italian luxury boutique. Choose your world.",
      },
    ],
  }),
  component: Index,
});

type World = {
  index: string;
  title: string;
  subtitle: string;
  to: "/perfumes" | "/jewellery" | "/artworks" | "/designer-clothes";
  image: string | null;
};

const worlds: World[] = [
  { index: "01", title: "Perfumes", subtitle: "Scents that tell your essence", to: "/perfumes", image: perfumesImg },
  { index: "02", title: "Jewellery", subtitle: "Light · Detail · Timeless beauty", to: "/jewellery", image: jewelleryImg },
  { index: "03", title: "Artworks", subtitle: "Pieces that inspire timeless emotion", to: "/artworks", image: artworksImg },
  { index: "04", title: "Designer Clothes", subtitle: "Elegance · Style · Identity", to: "/designer-clothes", image: clothesImg },
];

function WorldCard({ world }: { world: World }) {
  return (
    <Link
      to={world.to}
      className="group relative block overflow-hidden zd-world-card"
      style={{ background: "var(--bone)" }}
    >
      {world.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.06]"
          style={{ backgroundImage: `url(${world.image})` }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "var(--bone)" }}>
          <h3 className="text-[2rem]" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
            {world.title.toUpperCase()}
          </h3>
          <div className="mt-4" style={{ width: 40, height: 1, background: "var(--gold)" }} />
        </div>
      )}
      <div
        className="absolute inset-x-0 bottom-0 top-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.15) 50%, transparent)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 md:p-6">
        <div>
          <div style={{ width: 32, height: 2, background: "var(--gold)" }} />
          <h3
            className="mt-3 brand-wordmark text-[0.85rem] md:mt-4 md:text-[1rem]"
            style={{ color: "var(--bone)" }}
          >
            {world.title.toUpperCase()}
          </h3>
          <p
            className="mt-1 text-[0.7rem] zd-world-sub md:mt-2 md:text-[0.75rem]"
            style={{ color: "rgba(245,238,224,0.7)", fontFamily: "var(--font-body)" }}
          >
            {world.subtitle}
          </p>
        </div>
        <div
          className="flex h-9 w-9 items-center justify-center transition-colors duration-500 group-hover:bg-[var(--gold)] motion-reduce:transition-none md:h-11 md:w-11"
          style={{ border: "1px solid rgba(255,255,255,0.3)", borderRadius: "50%", color: "var(--bone)" }}
          aria-hidden
        >
          →
        </div>
      </div>
      <span className="sr-only">{world.title}</span>
    </Link>
  );
}

function Index() {
  return (
    <SiteLayout>
      {/* Welcome */}
      <section className="pt-6 pb-3 text-center md:pt-16 md:pb-8" style={{ background: "var(--paper)" }}>
        <p
          className="ui-label text-[0.65rem] md:text-[0.7rem]"
          style={{ color: "var(--muted-tone)", letterSpacing: "0.32em" }}
        >
          Luxury Italian Lifestyle
        </p>
        <h1
          className="mt-3 text-[1.5rem] md:mt-6 md:text-[3rem]"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)", fontWeight: 500 }}
        >
          Choose Your World
        </h1>
        <div className="my-2 flex justify-center md:my-4">
          <Diamond size={16} />
        </div>
        <p
          className="text-[0.9rem] italic md:text-[1.1rem]"
          style={{ fontFamily: "var(--font-display)", color: "var(--muted-tone)" }}
        >
          Benvenuto in Zona Dorata
        </p>
      </section>

      {/* Worlds grid */}
      <section className="zd-worlds">
        {worlds.map((w) => (
          <WorldCard key={w.title} world={w} />
        ))}
      </section>

      <TrustBar />

      <style>{`
        .zd-worlds {
          display: grid;
          gap: 6px;
          grid-template-columns: 1fr;
          padding: 0 10px 0;
        }
        .zd-world-card { height: calc((100svh - 148px) / 4); }
        .zd-world-sub { display: none; }
        @media (min-width: 769px) {
          .zd-worlds {
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            padding: 0 24px 96px;
          }
          .zd-world-card { height: auto; aspect-ratio: 3 / 4.4; }
          .zd-world-sub { display: block; }
        }
      `}</style>
    </SiteLayout>
  );
}
