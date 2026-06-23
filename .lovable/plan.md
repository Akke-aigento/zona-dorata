## Wat is er mis

De producten worden niet geladen omdat onze SellQo-proxy gewoon REST-paden (`/products?category_slug=perfumes`) doorzet naar `SELLQO_API_URL`. Maar de echte SellQo Storefront API werkt anders: het is één endpoint dat **POST**-verzoeken verwacht met een body `{ action, tenant_id, params }` en een `X-API-Key` header.

In de huidige setup wijst `SELLQO_API_URL` naar `https://sellqo.app/` — dat is de marketing-website, niet de API. De netwerklogs laten dat ook zien: het antwoord op `/products` is gewoon de Sellqo-homepage HTML, geen JSON. Daarom rendert iedere categorie "No pieces available yet".

Mancini Milano lost dit op met een edge function die REST → action vertaalt. Wij doen hetzelfde, maar in de bestaande TanStack server function (geen edge function nodig).

## Aanpak

1. **`src/lib/sellqo.functions.ts` herschrijven** zodat de proxy:
   - Het pad parseert (`/products`, `/products/{slug}`, `/cart`, `/cart/{id}/items`, …) en mapt naar de juiste `action` (`get_products`, `get_product`, `cart_create`, `cart_get`, `cart_add_item`, enz.) — exact dezelfde mapping als Mancini's `resolveAction`.
   - Altijd `POST` doet naar het storefront-api endpoint.
   - Body stuurt: `{ action, tenant_id: <SELLQO_TENANT_ID>, params: { ...query, ...body } }`.
   - Header `X-API-Key: <SELLQO_API_KEY>` zet.
   - Een duidelijke fout teruggeeft als het upstream-antwoord HTML is (zodat we dit soort issues sneller zien).
   - Default voor `SELLQO_API_URL` = het officiële storefront-api endpoint (`https://gczmfcabnoofnmfpzeop.supabase.co/functions/v1/storefront-api`), zodat het werkt ook als de secret verkeerd staat.

2. **De `SELLQO_API_URL` secret bijwerken** naar exact dat endpoint (`…/functions/v1/storefront-api`), zodat er geen verwarring meer is met de marketing-URL.

3. **Geen wijzigingen** aan `src/lib/sellqo.ts`, `CategoryProductsPage.tsx`, route-bestanden, cart-context of UI — die blijven dezelfde REST-achtige aanroepen doen; alleen de proxy-laag vertaalt nu correct.

4. **Verificatie**: dev-server herstarten niet nodig; ik test door `/perfumes` (en de overige categorieën) in een headless browser te openen en te checken dat de products-call JSON met producten teruggeeft (of een correcte lege lijst als er nog geen products voor die slug zijn).

## Out of scope

- Geen wijzigingen aan productdetail-, cart- of checkout-flows; die delen profiteren automatisch zodra de proxy correct is.
- Geen edge function — wij blijven met de TanStack server function werken, dat is voor dit project eenvoudiger.
