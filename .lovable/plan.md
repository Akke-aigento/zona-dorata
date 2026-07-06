## Doel

Drie fixes op de checkout/cart:

1. Productfoto rendert niet in cart drawer / order summary.
2. Bij navigatie naar `/checkout` (of een stap) flitst "bag is empty" op en de EmptyCartRedirect schopt de gebruiker soms terug — het duurt lang voor de cart erkend wordt.
3. Checkout van 4 stappen terugbrengen naar **2 stappen** in Vanxcel-stijl:
   - Stap 1: Contact + Verzend-/Factuuradres (samen in één formulier).
   - Stap 2: Verzendmethode + Betaalmethode + "Plaats bestelling".

## 1. Cart-afbeelding fix

`normalizeCart` in `src/lib/sellqo.ts` haalt het beeld nu enkel uit `it.image`, `it.featured_image`, `it.product.featured_image`, `it.product.images[0]`. SellQo geeft echter vaak `image_url`, `thumbnail_url`, of enkel via `product.image_url` / `product.images[0].url`.

- Uitbreiden zodat we ook `it.image_url`, `it.thumbnail`, `it.thumbnail_url`, `it.product?.image_url`, `it.product?.thumbnail_url`, en genest object (`{url}`) mappen.
- Placeholder (bone-blok met initialen) tonen als geen image gevonden, zodat het vakje niet leeg-wit oogt.
- Toevoegen: log de eerste keer via `console.debug` de raw item-shape indien geen image — helpt bij evt. resterende afwijkingen.

Toepassen in `CartDrawer.tsx` en de `OrderSummary` in `checkout.tsx`.

## 2. Empty-cart flits / trage herkenning

`CartProvider` start met `cart: null`, dus `count === 0` totdat `refresh()` (netwerkcall) klaar is. Elke checkoutstap doet:

```
if (count === 0) return <EmptyCartRedirect />;
```

`EmptyCartRedirect` navigeert na 1,5 s naar `/perfumes` → gebruiker verliest zijn checkout bij een trage response.

Aanpak:

- `CartProvider` krijgt een `hydrated` boolean die pas op `true` gaat na de eerste `refresh()`-poging (succes of fail).
- Nieuwe helper `useCart()`-veld `hydrated`.
- Alle checkout-routes tonen een korte "Loading your bag…" skeleton zolang `!hydrated`. Pas als `hydrated && count === 0` wordt `EmptyCartRedirect` getoond.
- `OrderSummary` (checkout sidebar) idem: skeleton tijdens hydrate.
- `CartDrawer` header toont `Your Bag (…)` met een subtiele spinner terwijl niet hydrated.

## 3. Checkout 2-staps herstructurering

**Nieuwe routes-structuur:**

```
/checkout               → Details (contact + address)   [was: contact]
/checkout/payment       → Shipping method + Payment + Place order
/checkout/confirmation/$orderId  (ongewijzigd)
```

Verwijderen:

- `src/routes/checkout.address.tsx`
- `src/routes/checkout.shipping.tsx`

Aanpassen:

- **`checkout.tsx` (layout)**: stepper wordt 2 stappen — `Details` en `Payment`. Blijft grid met `Outlet` + `OrderSummary`.
- **`checkout.index.tsx` (Details)**: samengevoegd formulier met velden uit huidige `checkout.index` (email, first/last name, phone, marketing opt-in) + velden uit huidige `checkout.address` (address_line_1/2, postal_code, city, country + optioneel apart billingadres). Bij submit:
  1. `checkoutStart()` (indien nog niet gedaan).
  2. `checkoutSetCustomer(...)`.
  3. `checkoutSetAddress({ shipping_address, billing_address?, billing_same_as_shipping })`.
  4. `navigate({ to: "/checkout/payment" })`.
  Fouten van beide calls samen tonen; button disabled tijdens combined submit.
- **`checkout.payment.tsx`**: bij mount `checkoutGetOrder()` ophalen (huidig gedrag). Bovenaan een **Shipping method** blok tonen (radio-lijst, zelfde stijl als huidige `checkout.shipping`) en daaronder de **Payment method** blok + totalenoverzicht + terms + "Complete order". Submit:
  1. Als `selectedShippingId !== data.selected_shipping_method_id` → `checkoutSetShipping(id)`.
  2. `checkoutSelectPayment(id)`.
  3. `checkoutComplete()` → redirect_url of confirmation-navigatie.
  Auto-selecteer eerste shipping/payment method zodra data binnen is (zoals nu).

**Overige bijwerkingen:**

- `src/routeTree.gen.ts` regenereert automatisch — geen handmatige edit.
- Geen links elders naar `/checkout/address` of `/checkout/shipping`; enkel de stepper verwees ernaar (die wordt herschreven).
- Terug-knop op paymentstep naar `/checkout` (Link met ← Back to details).

## Verificatie

Na de wijzigingen valideer ik met een Playwright-script:

1. Voeg product toe → drawer opent, thumbnail zichtbaar.
2. Klik "Checkout" → `/checkout` toont skeleton, dan formulier (geen "empty" flits).
3. Vul details in → doorstroming naar `/checkout/payment`.
4. Selecteer shipping + payment (indien beschikbaar) → geen console errors.

Bestanden aangepast/gemaakt:
- edit `src/lib/sellqo.ts` (image mapping)
- edit `src/lib/cart-context.tsx` (`hydrated` flag)
- edit `src/components/site/CartDrawer.tsx` (placeholder + hydrated)
- edit `src/routes/checkout.tsx` (2-step stepper, hydrated skeleton in summary)
- edit `src/routes/checkout.index.tsx` (samengevoegd details-formulier)
- edit `src/routes/checkout.payment.tsx` (shipping + payment blok)
- edit `src/components/site/CheckoutForm.tsx` (EmptyCartRedirect met hydrated-guard, of gebruik in routes aanpassen)
- delete `src/routes/checkout.address.tsx`
- delete `src/routes/checkout.shipping.tsx`
