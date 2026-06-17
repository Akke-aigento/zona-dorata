import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CategoryHero } from "@/components/site/CategoryHero";
import { ProductCard, ProductCardSkeleton } from "@/components/site/ProductCard";
import { Diamond } from "@/components/site/Diamond";
import { sellqoFetch, type SellqoPagination, type SellqoProduct } from "@/lib/sellqo";

type ProductsResponse = {
  products: SellqoProduct[];
  pagination?: SellqoPagination;
};

export const Route = createFileRoute("/perfumes")({
  head: () => ({
    meta: [
      { title: "Perfumes — Zona Dorata" },
      { name: "description", content: "Italian luxury perfumes — scents that tell your essence." },
      { property: "og:title", content: "Perfumes — Zona Dorata" },
      { property: "og:description", content: "Italian luxury perfumes — scents that tell your essence." },
    ],
  }),
  component: PerfumesPage,
});

function PerfumesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sellqo", "products", { category_slug: "perfumes" }],
    queryFn: () => sellqoFetch<ProductsResponse>("/products?category_slug=perfumes"),
    staleTime: 60_000,
  });

  const products = data?.products ?? [];

  return (
    <SiteLayout>
      <CategoryHero
        title="Perfumes"
        subtitle="Scents that tell your essence"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Perfumes" }]}
      />

      <section className="mx-auto max-w-[1280px] px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState message={(error as Error).message || "Unable to load products."} />
        ) : products.length === 0 ? (
          <EmptyState message="No pieces available yet" />
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <Diamond size={20} />
      <p
        className="mt-6 text-[1.5rem]"
        style={{ fontFamily: "var(--font-display)", color: "var(--muted-tone)" }}
      >
        {message}
      </p>
    </div>
  );
}