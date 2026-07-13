## Doel

Mobiele homepage-rijen visueel exact laten matchen met de mockup: grotere, hoge foto links (~50% breed, geen ronde hoeken), ruime tekstkolom rechts met goud nummer + korte gouden onderstreep, grote serif titel, korte beschrijving in 3 regels, en "DISCOVER THE COLLECTION →" onderaan. Dunne scheidingslijnen tussen rijen blijven.

Uitsluitend `src/routes/index.tsx` — desktop (≥769px), foto-assets, styles.css, footer en andere pagina's blijven ongewijzigd.

## Concrete wijzigingen in `WorldRowMobile`

Container `<Link>`:
- `items-stretch` i.p.v. `items-center` zodat foto en tekst dezelfde hoogte krijgen.
- padding: `pr-5 py-8` (geen left-padding — foto loopt tot linkerrand, zoals in de mockup).
- `gap-5`.

Foto-div:
- `width: "50%"`
- `aspectRatio: "3 / 4"` (hoge portret-verhouding, dicht bij mockup).
- `borderRadius: 0` (verwijderd) — scherpe hoeken.
- `alignSelf: "stretch"` + `minHeight` blijft weg; aspect-ratio bepaalt hoogte.

Tekstkolom (`flex-1`):
- `flex flex-col justify-center` zodat tekst verticaal centreert naast de hoge foto.
- Nummer: `text-[0.72rem]` in `--gold`, gevolgd door een korte gouden streep (`width: 24, height: 1, background: var(--gold), marginTop: 6`) — matcht de onderstreep onder "01/02/03/04".
- Titel: groter, `text-[1.7rem]`, `leading-[1.05]`, letterSpacing `0.14em`, `marginTop: 18`. Voor "DESIGNER CLOTHES" breekt hij automatisch over 2 regels net als in de mockup.
- Beschrijving: `text-[0.82rem]`, `leading-[1.55]`, `marginTop: 14`, kleur `--muted-tone`. Geen `line-clamp` (mag 3–4 regels tonen).
- CTA "DISCOVER THE COLLECTION →": `marginTop: 22`, `text-[0.66rem]`, `letterSpacing: 0.2em`, `borderBottom: 1px solid var(--ink)`, `paddingBottom: 4`.

Sectie-wrapper (rijen): scheidingslijn (`borderTop: 1px solid var(--line)` vanaf de 2e rij) blijft ongewijzigd. Achtergrond `#fff`.

Hero "Choose Your World": ongewijzigd t.o.v. huidige staat.

## Wat NIET verandert

- `WorldCard`, `.zd-worlds` grid, alle desktop-styles (`@media (min-width: 769px)`).
- Foto-assets (`perfumesImg` etc.).
- `src/styles.css`, `Footer.tsx`, andere routes.

## Verificatie

- Preview op 390px: 4 rijen met hoge portret-foto links (~50% breed, scherp), tekst rechts verticaal gecentreerd, gouden index + korte streep, grote serif titel, 3-regelige beschrijving, onderstreepte CTA — matcht mockup.
- Preview ≥769px: identiek aan huidige desktop grid met overlay-cards.
- `grep -n "aspectRatio: \"3 / 4\"\|line-clamp" src/routes/index.tsx` → aspectRatio matcht, geen line-clamp in `WorldRowMobile`.

## Bestanden

- edit `src/routes/index.tsx` (alleen `WorldRowMobile`).
