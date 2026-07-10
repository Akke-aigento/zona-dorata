import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
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
  description: string;
  to: "/perfumes" | "/jewellery" | "/artworks" | "/designer-clothes";
  image: string | null;
};

const worlds: World[] = [
  {
    index: "01",
    title: "Perfumes",
    description: "Exceptional scents crafted with rare ingredients. Timeless emotions, bottled.",
    to: "/perfumes",
    image: perfumesImg,
  },
  {
    index: "02",
    title: "Jewellery",
    description: "Precious details. Timeless designs made to be worn and cherished.",
    to: "/jewellery",
    image: jewelleryImg,
  },
  {
    index: "03",
    title: "Artworks",
    description: "Original pieces that inspire and transform spaces. Where emotion becomes a masterpiece.",
    to: "/artworks",
    image: artworksImg,
  },
  {
    index: "04",
    title: "Designer Clothes",
    description: "Refined fabrics. Impeccable cuts. Crafted for a modern and timeless identity.",
    to: "/designer-clothes",
    image: clothesImg,
  },
];

function WorldRow({ world }: { world: World }) {
  return (
    <Link to={world.to} className="group block zd-world-row" style={{ background: "var(--paper)" }}>
      <div className="zd-world-media" style={{ background: "var(--bone)" }}>
        {world.image && (
          <img
            src={world.image}
            alt={world.title}
            className="h-full w-full object-cover transition-transform duration-700 motion-reduce:transition-none group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="zd-world-text">
        <div className="zd-world-text-inner">
          <div
            className="text-[0.9rem]"
            style={{ color: "var(--gold)", fontFamily: "var(--font-display)" }}
          >
            {world.index}
          </div>
          <div className="mt-2" style={{ width: 32, height: 1, background: "var(--gold)" }} />
          <h2
            className="mt-6"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink)",
              fontWeight: 500,
              fontSize: "clamp(1.6rem, 3.4vw, 2.8rem)",
              letterSpacing: "0.02em",
              lineHeight: 1.1,
            }}
          >
            {world.title.toUpperCase()}
          </h2>
          <p
            className="zd-world-desc mt-6 text-[0.9rem] md:text-[0.95rem]"
            style={{ color: "var(--muted-tone)", fontFamily: "var(--font-body)", lineHeight: 1.7, maxWidth: 340 }}
          >
            {world.description}
          </p>
          <div
            className="zd-world-cta mt-8 inline-flex items-center gap-3 ui-label text-[0.7rem]"
            style={{
              color: "var(--ink)",
              letterSpacing: "0.28em",
              borderBottom: "1px solid var(--ink)",
              paddingBottom: 6,
            }}
          >
            DISCOVER THE COLLECTION
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Index() {
  return (
    <SiteLayout>
      <section className="zd-worlds" style={{ background: "var(--paper)" }}>
        {worlds.map((w) => (
          <WorldRow key={w.title} world={w} />
        ))}
      </section>

      <style>{`
        /* Mobile: 4 tiles fit in one viewport */
        .zd-worlds {
          display: flex;
          flex-direction: column;
          height: calc(100svh - 64px);
        }
        .zd-world-row {
          position: relative;
          flex: 1 1 0;
          min-height: 0;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
          display: block;
        }
        .zd-world-media {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .zd-world-media img { width: 100%; height: 100%; object-fit: cover; }
        .zd-world-row::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.1) 100%);
          pointer-events: none;
        }
        .zd-world-text {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 22px;
        }
        .zd-world-text-inner { width: 100%; max-width: 420px; }
        .zd-world-text-inner > * { color: var(--paper) !important; }
        .zd-world-desc { display: none; }
        .zd-world-cta {
          border-bottom-color: var(--paper) !important;
          margin-top: 10px !important;
          padding-bottom: 4px !important;
        }

        @media (min-width: 768px) {
          .zd-worlds { display: block; height: auto; }
          .zd-world-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            min-height: 520px;
            overflow: visible;
          }
          .zd-world-row::after { content: none; }
          .zd-world-media {
            position: relative;
            inset: auto;
            height: 100%;
            aspect-ratio: auto;
          }
          .zd-world-text {
            height: auto;
            padding: 64px 72px;
            justify-content: center;
          }
          .zd-world-text-inner > * { color: inherit !important; }
          .zd-world-desc { display: block; }
          .zd-world-cta {
            border-bottom-color: var(--ink) !important;
            margin-top: 32px !important;
            padding-bottom: 6px !important;
          }
        }
      `}</style>
    </SiteLayout>
  );
}
