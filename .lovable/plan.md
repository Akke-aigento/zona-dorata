## Doel

Op een hoofdcategoriepagina (bv. `/perfumes`) eerst enkel de **subcategorieën** tonen als kiezer. Pas nadat de gebruiker een subcategorie kiest, worden de producten van die subcategorie geladen. Heeft de hoofdcategorie geen subcategorieën (bv. artworks momenteel), dan blijft het huidige gedrag: meteen alle producten tonen.

## Gedrag per scenario

1. **Categorie mét subcategorieën** (bv. Perfumes → "No Rules", …)
   - Landing op `/perfumes`: hero + grid van **subcategorie-kaarten/chips**, geen producten, geen "All"-optie standaard actief.
   - Klik op een subcategorie → producten van die subcategorie verschijnen onder de chips.
   - Bovenaan de productlijst een chip-rij met alle subcategorieën + een **"All"** optie (toont producten van álle subcategorieën van deze hoofdcategorie) + een **"← Back"** / deselecteer om terug te keren naar de kiezer-only view.
   - Actieve subcategorie is duidelijk gemarkeerd (huidige gold/black stijl).

2. **Categorie zónder subcategorieën** (bv. Artworks)
   - Landing toont meteen alle producten (huidig gedrag), geen chips-rij.

## Implementatie

Alles blijft binnen `src/components/site/CategoryProductsPage.tsx` — geen wijzigingen aan routes, sellqo-lib, of andere pagina's.

- `activeSlug` state uitbreiden naar `string | null | "__all__"`:
  - `null` = **selector view** (default wanneer subcategorieën bestaan).
  - `"__all__"` = alle producten van alle subcategorieën samen.
  - `"<slug>"` = specifieke subcategorie.
- Init:
  - Als er geen subcategorieën zijn → `activeSlug = "__all__"` implicit (behoud huidige fetch met `slugs`).
  - Als er wél subcategorieën zijn → `activeSlug = null` bij mount, selector-view tonen.
- Fetch-logica:
  - `null` → geen product-query (skip).
  - `"__all__"` → huidige `useQueries` over originele `slugs` (hoofdcategorie).
  - `"<slug>"` → `useQueries` met alleen die subcategorie-slug.
- Rendering in de section:
  - Als subcategorieën bestaan en `activeSlug === null`:
    - Toon een grid van **SubcategoryCard**-tegels (visueel wat groter dan de huidige chips — zelfde stijl-taal als de "Worlds"-tegels op home indien beschikbaar; anders een nette bordered tile met naam + product_count).
    - Geen productgrid, geen "All"-chip.
  - Anders (subcategorie actief óf geen subcategorieën):
    - Toon chip-rij bovenaan **enkel als subcategorieën bestaan**: `[← All subcategories]` (zet `activeSlug` terug naar `null`) · `All` (→ `"__all__"`) · elke subcategorie-chip.
    - Toon productgrid zoals nu (skeleton/empty/error states blijven).
- Laadstaat categorieën: zolang `categoriesQuery.isLoading` toon skeleton-chips of skeleton-grid (huidige skeleton kan hergebruikt worden), pas daarna beslissen tussen selector-view en productview.

## Verificatie

Handmatig via preview:
1. `/perfumes` → toont subcategorie-tegels ("No Rules" e.a.), geen producten.
2. Klik "No Rules" → productgrid van No Rules verschijnt, chip actief, "All" + back-chip zichtbaar.
3. Klik "All" → producten van alle perfumes-subcategorieën samengevoegd (huidig gedrag).
4. Klik "← All subcategories" → terug naar selector-view.
5. `/artworks` (geen subcats) → toont meteen producten, geen chips-rij.

## Bestanden

- edit `src/components/site/CategoryProductsPage.tsx`
