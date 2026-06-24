import { useQueries } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CategoryHero } from "@/components/site/CategoryHero";
import { ProductCard, ProductCardSkeleton } from "@/components/site/ProductCard";
import { Diamond } from "@/components/site/Diamond";
import { sellqoFetch, type SellqoPagination, type SellqoProduct } from "@/lib/sellqo";

type ProductsResponse = {
  products: SellqoProduct[];
  pagination?: SellqoPagination;
};

type Props = {
  title: string;
  subtitle: string;
  categorySlug: string | string[];
};

export function CategoryProductsPage({ title, subtitle, categorySlug }: Props) {
  const slugs = Array.isArray(categorySlug) ? categorySlug : [categorySlug];
  const queries = useQueries({
    queries: slugs.map((slug) => ({
      queryKey: ["sellqo", "products", { category_slug: slug }],
      queryFn: () =>
        sellqoFetch<ProductsResponse>("/products", {
          query: { category_slug: slug, per_page: 100 },
        }),
      staleTime: 60_000,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const error = queries.find((q) => q.error)?.error as Error | undefined;
  const seen = new Set<string>();
  const products: SellqoProduct[] = [];
  for (const q of queries) {
    for (const p of q.data?.products ?? []) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      products.push(p);
    }
  }

  return (
    <SiteLayout>
      <CategoryHero
        title={title}
        subtitle={subtitle}
        breadcrumb={[{ label: "Home", to: "/" }, { label: title }]}
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