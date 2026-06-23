## Goal
Maak de drie overige categoriepagina's (`/jewellery`, `/artworks`, `/designer-clothes`) net zo functioneel als `/perfumes`: ze halen producten op uit SellQo via de bestaande proxy met de juiste `category_slug` en renderen ze in hetzelfde luxe grid.

## Approach
- Vervang elk van de drie route-bestanden (die nu `<ComingSoon />` tonen) met dezelfde structuur als `src/routes/perfumes.tsx`, maar met:
  - eigen `category_slug` (`jewellery`, `artworks`, `designer-clothes`)
  - eigen titel, subtitle, breadcrumb, meta-tags (title/description/og)
- Hergebruik onveranderd: `SiteLayout`, `CategoryHero`, `ProductCard` / `ProductCardSkeleton`, `EmptyState` patroon, `sellqoFetch`.
- Loading toont skeletons, lege response toont "No pieces available yet", fout toont de error message.

## Refactor
Om copy-paste te vermijden: een kleine helper-component `CategoryProductsPage` in `src/components/site/CategoryProductsPage.tsx` die titel/subtitle/categorySlug ontvangt en de query + grid afhandelt. De vier route-bestanden worden dan dunne wrappers (alleen `head()` + één component-call). `perfumes.tsx` wordt eveneens omgezet naar deze wrapper voor consistentie.

## Files
- new `src/components/site/CategoryProductsPage.tsx` — fetch + render grid
- edit `src/routes/perfumes.tsx` — wrapper rond `CategoryProductsPage`
- edit `src/routes/jewellery.tsx` — wrapper, slug `jewellery`
- edit `src/routes/artworks.tsx` — wrapper, slug `artworks`
- edit `src/routes/designer-clothes.tsx` — wrapper, slug `designer-clothes`

## Out of scope
- Filters / sortering / paginatie (kunnen later toegevoegd worden zodra je producten in SellQo hebt).
- Wijzigingen aan productdetailpagina of cart — die staan los.