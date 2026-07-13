import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TrustBar } from "@/components/site/TrustBar";
import { Diamond } from "@/components/site/Diamond";
import { ProductCard, ProductCardSkeleton } from "@/components/site/ProductCard";
import { sellqoFetch, type SellqoProduct } from "@/lib/sellqo";
import perfumesAsset from "@/assets/worlds/perfumes.png.asset.json";
import jewelleryAsset from "@/assets/worlds/jewellery.png.asset.json";
import clothesAsset from "@/assets/worlds/clothes.png.asset.json";
import artworksAsset from "@/assets/worlds/artworks.png.asset.json";
import sweaterNavyAsset from "@/assets/featured/clothing/sweater-navy.jpg.asset.json";
import jacketSherpaAsset from "@/assets/featured/clothing/jacket-sherpa.jpg.asset.json";
import jacketLeatherAsset from "@/assets/featured/clothing/jacket-leather.jpg.asset.json";

const perfumesImg = perfumesAsset.url;
const jewelleryImg = jewelleryAsset.url;
const clothesImg = clothesAsset.url;
const artworksImg = artworksAsset.url;

const clothingTeasers = [
  { src: sweaterNavyAsset.url, alt: "Zona Dorata navy sherpa sweater" },
  { src: jacketSherpaAsset.url, alt: "Zona Dorata white sherpa hoodie" },
  { src: jacketLeatherAsset.url, alt: "Zona Dorata black leather jacket" },
];

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
  description: string;
  to: "/perfumes" | "/jewellery" | "/artworks" | "/designer-clothes";
  image: string | null;
};

const worlds: World[] = [
  { index: "01", title: "Perfumes", subtitle: "Scents that tell your essence", description: "Exceptional scents crafted with rare ingredients. Timeless emotions, bottled.", to: "/perfumes", image: perfumesImg },
  { index: "02", title: "Jewellery", subtitle: "Light · Detail · Timeless beauty", description: "Precious details. Timeless designs made to be worn and cherished.", to: "/jewellery", image: jewelleryImg },
  { index: "03", title: "Artworks", subtitle: "Pieces that inspire timeless emotion", description: "Original pieces that inspire and transform spaces. Where emotion becomes a masterpiece.", to: "/artworks", image: artworksImg },
  { index: "04", title: "Designer Clothes", subtitle: "Elegance · Style · Identity", description: "Refined fabrics. Impeccable cuts. Crafted for a modern and timeless identity.", to: "/designer-clothes", image: clothesImg },
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

function WorldRowMobile({ world }: { world: World }) {
  return (
    <Link to={world.to} className="block" style={{ background: "var(--paper)" }}>
      {world.image && (
        <div
          className="w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${world.image})`, aspectRatio: "4 / 5" }}
        />
      )}
      <div className="px-6 py-8 text-center">
        <p
          className="ui-label text-[0.7rem]"
          style={{ color: "var(--gold)", letterSpacing: "0.32em" }}
        >
          {world.index}
        </p>
        <div className="mx-auto my-4" style={{ width: 32, height: 1, background: "var(--gold)" }} />
        <h3
          className="brand-wordmark text-[1.35rem]"
          style={{ color: "var(--ink)" }}
        >
          {world.title.toUpperCase()}
        </h3>
        <p
          className="mx-auto mt-4 max-w-[320px] text-[0.9rem] leading-relaxed"
          style={{ color: "var(--muted-tone)", fontFamily: "var(--font-body)" }}
        >
          {world.description}
        </p>
        <span
          className="ui-label mt-6 inline-block text-[0.7rem]"
          style={{
            color: "var(--gold)",
            borderBottom: "1px solid var(--gold)",
            paddingBottom: 4,
            letterSpacing: "0.32em",
          }}
        >
          DISCOVER THE COLLECTION →
        </span>
      </div>
    </Link>
  );
}

type FeaturedResp = { products: SellqoProduct[] };

function FeaturedPerfumes() {
  const { data, isLoading } = useQuery({
    queryKey: ["sellqo", "products", { category_slug: "featured" }],
    queryFn: () =>
      sellqoFetch<FeaturedResp>("/products", {
        query: { category_slug: "featured", per_page: 2 },
      }),
    staleTime: 60_000,
  });
  const products = (data?.products ?? []).slice(0, 2);

  return (
    <section className="px-6 py-16 md:py-24" style={{ background: "var(--bone)" }}>
      <div className="mx-auto max-w-[1080px] text-center">
        <p
          className="ui-label text-[0.7rem]"
          style={{ color: "var(--gold)", letterSpacing: "0.32em" }}
        >
          SIGNATURE SCENTS
        </p>
        <h2
          className="mt-3"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--ink)",
            fontWeight: 500,
            fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)",
          }}
        >
          Featured
        </h2>
        <div className="mt-4 flex justify-center">
          <Diamond size={14} />
        </div>

        <div className="mx-auto mt-10 grid max-w-[720px] grid-cols-2 gap-6 md:gap-10">
          {isLoading ? (
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          ) : products.length === 0 ? (
            <div className="col-span-2 py-8" style={{ color: "var(--muted-tone)", fontFamily: "var(--font-body)" }}>
              New signature scents arriving soon.
            </div>
          ) : (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      </div>
    </section>
  );
}

function ClothingTeaser() {
  return (
    <section className="px-6 py-16 md:py-24" style={{ background: "var(--black, #0b0b0b)" }}>
      <div className="mx-auto max-w-[1200px] text-center">
        <p
          className="ui-label text-[0.7rem]"
          style={{ color: "var(--gold-l, var(--gold))", letterSpacing: "0.32em" }}
        >
          THE WARDROBE
        </p>
        <h2
          className="mt-3 text-white"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)",
          }}
        >
          Designer Clothes
        </h2>
        <p
          className="mx-auto mt-4 max-w-[520px] text-[0.95rem]"
          style={{ color: "rgba(245,238,224,0.7)", fontFamily: "var(--font-body)" }}
        >
          Crafted for those who wear their identity. Coming soon.
        </p>

        <div className="zd-teaser-row mt-10">
          {clothingTeasers.map((img) => (
            <Link
              key={img.src}
              to="/designer-clothes"
              className="group zd-teaser-card relative block overflow-hidden"
              style={{ background: "#141414" }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.04]"
              />
              <span
                className="absolute right-3 top-3 ui-label text-[0.6rem]"
                style={{
                  color: "var(--gold)",
                  border: "1px solid var(--gold)",
                  padding: "4px 8px",
                  letterSpacing: "0.28em",
                  background: "rgba(0,0,0,0.35)",
                }}
              >
                COMING SOON
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10">
          <Link
            to="/designer-clothes"
            className="ui-label inline-block text-[0.75rem] transition-colors hover:bg-[var(--gold)] hover:text-black"
            style={{
              color: "var(--gold)",
              border: "1px solid var(--gold)",
              padding: "14px 28px",
              letterSpacing: "0.32em",
            }}
          >
            DISCOVER THE COLLECTION
          </Link>
        </div>
      </div>

      <style>{`
        .zd-teaser-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .zd-teaser-card { aspect-ratio: 3 / 4; }
        @media (max-width: 768px) {
          .zd-teaser-row {
            grid-auto-flow: column;
            grid-auto-columns: 78%;
            grid-template-columns: none;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            padding-bottom: 8px;
          }
          .zd-teaser-card { scroll-snap-align: start; }
        }
      `}</style>
    </section>
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
          className="hidden text-[0.9rem] italic md:block md:text-[1.1rem]"
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

      <FeaturedPerfumes />
      <ClothingTeaser />

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
