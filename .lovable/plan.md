## Diagnose (bug)

De netwerk-log toont de exacte oorzaak:

```
POST /cart/add  →  { error: "Unknown action: cart_add" }
```

De SellQo storefront-api kent alleen `cart_add_item`. De proxy in `src/lib/sellqo.functions.ts` mapt `POST /cart/{cart_id}/items` correct naar `cart_add_item`, maar `src/lib/cart-context.tsx` roept `/cart/add` aan — dat pad wordt niet gematcht en valt door naar de fallback (`action: "cart_add"`), waardoor SellQo faalt.

Daarnaast is er nog geen cart-pagina, geen checkout-route en geen confirmation-pagina. De proxy kent de checkout-acties al (start, customer, address, shipping, select-payment-method, complete, get_confirmation) — die worden nu voor het eerst gebruikt.

## Wat er wordt gebouwd

### 1. Fix: cart-context

`src/lib/cart-context.tsx`
- `addItem` roept `POST /cart/{cartId}/items` aan (i.p.v. `/cart/add`) met body `{ product_id, variant_id, quantity }`.
- Extra helpers in de context: `items`, `subtotal`, `updateItem(itemId, qty)`, `removeItem(itemId)`, `clear()`, `open/close` van de drawer.
- Na elke mutatie: server-antwoord (`cart` object) in state zetten; fallback op refresh.

`src/lib/sellqo.ts`
- `fetchCart()` gebruikt voortaan de opgeslagen `cart_id` (`GET /cart/{cartId}`) i.p.v. `session_id`, met stille fallback op session-lookup zodra `cart_id` er nog niet is.
- Nieuwe typed helpers: `SellqoCart`, `SellqoCartItem`, `cartItemImage()`.

### 2. Cart drawer (side-sheet)

Nieuw `src/components/site/CartDrawer.tsx` — shadcn `Sheet` vanaf rechts.
- Regels: thumbnail (3:4), naam, variant-label, prijs, +/- quantity stepper, remove.
- Footer: subtotaal, "Verzending wordt berekend in checkout", primaire knop **Checkout** (link naar `/checkout`), secundaire "Continue shopping".
- Lege staat: micro-copy + terug naar `/perfumes`.
- Header cart-icoon opent de drawer (i.p.v. huidige no-op).

### 3. Checkout multi-step

Layout route `src/routes/checkout.tsx` — pathless-achtig, deelt kop (stepper: Contact → Address → Shipping → Payment) + `Outlet`. Order-summary rechts (sticky op desktop, boven collapsible op mobiel).

Leaves:
- `src/routes/checkout.index.tsx` (`/checkout`) — Contact (email + optioneel telefoon + newsletter opt-in). Submit → `POST /checkout` (`checkout_start`) met `cart_id` + `POST /checkout/customer` → navigate `/checkout/address`.
- `src/routes/checkout.address.tsx` — verzend- + factuuradres (checkbox "zelfde als verzending"). Submit → `POST /checkout/address` → `/checkout/shipping`.
- `src/routes/checkout.shipping.tsx` — lijst met shipping-methodes uit `checkout_start`/`checkout_get_order` response, radio-select. Submit → `POST /checkout/shipping` → `/checkout/payment`.
- `src/routes/checkout.payment.tsx` — payment-methodes uit backend, radio-select + T&Cs checkbox. Submit → `POST /checkout/select-payment-method` → `POST /checkout/complete` → navigate `/checkout/confirmation/$orderId` (met redirect-URL indien SellQo die teruggeeft — bv. externe payment provider).
- `src/routes/checkout.confirmation.$orderId.tsx` — `GET /checkout/confirmation/{orderId}`: bedankt-scherm met ordernummer, samenvatting, verzendadres, totalen. Bij binnenkomst: cart-id wissen (`clearCartId`) en teller resetten.

Alle stappen:
- Guarden op bestaande `cart_id`; anders redirect naar `/perfumes` met melding.
- Zod-validatie per formulier, inline foutmeldingen, disabled submit tijdens fetch.
- Design: `--bone` cards op `#141414` background zoals in de rest van de site, dezelfde gold-underline knoppen als op de productdetailpagina.

### 4. Routes & SEO

- `head()` per route: eigen title/description, `robots: noindex` op alle checkout-stappen (behalve confirmation, ook noindex).
- Elke route met loader krijgt `errorComponent` + `notFoundComponent` (bestaand patroon).

### 5. Kleine polish

- Header cart-badge blijft `count`, opent drawer.
- Toast (sonner) na `addItem` succes: "Toegevoegd aan winkelmandje" met "Bekijk" actie die de drawer opent.
- Empty-state edge cases: cart bestaat niet meer server-side (verlopen) → cart-id wissen en teller op 0.

## Technisch

- Geen wijzigingen aan `sellqo.functions.ts` nodig — mapping is al compleet.
- Alle mutaties blijven via `sellqoFetch` → `sellqoProxy` (`createServerFn`), dus `SELLQO_API_KEY` blijft server-side.
- Geen nieuwe secrets, geen DB-migraties, geen edge functions.
- Werkt zonder inloggen (guest checkout) — SellQo `cart_id` in `localStorage` is voldoende.

## Bestanden

Nieuw:
```
src/components/site/CartDrawer.tsx
src/routes/checkout.tsx
src/routes/checkout.index.tsx
src/routes/checkout.address.tsx
src/routes/checkout.shipping.tsx
src/routes/checkout.payment.tsx
src/routes/checkout.confirmation.$orderId.tsx
```

Wijzigen:
```
src/lib/cart-context.tsx     (items/mutations/drawer state + fix /cart/add)
src/lib/sellqo.ts            (fetchCart via cart_id + cart types)
src/components/site/Header.tsx (cart-icoon opent drawer)
src/routes/__root.tsx        (CartDrawer mounten)
src/routes/product.$slug.tsx (toast + drawer-open na addItem)
```

## Controle na implementatie

1. Product op detailpagina toevoegen → geen "Unknown action"-fout, teller +1, drawer opent.
2. Drawer: qty aanpassen, item verwijderen, subtotaal update live.
3. Checkout doorlopen: contact → address → shipping (methodes uit SellQo) → payment (methodes uit SellQo) → complete.
4. Confirmation-pagina toont ordernummer + samenvatting; cart-teller weer 0.
5. Refresh op elke checkout-stap: state komt uit `checkout_get_order`, geen kapotte forms.
6. Zonder cart naar `/checkout` gaan → redirect naar `/perfumes`.
