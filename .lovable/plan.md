Mobiele rijen iets compacter maken zodat alle 4 categorieën met wat meer ademruimte in één viewport passen, zonder de layout te veranderen.

## Wijziging in `WorldRowMobile` (src/routes/index.tsx)

Enkel de mobiele rij — foto-verhouding en tekstgroottes een tikje kleiner:

- Foto: `width` van `44%` → `40%`, `aspectRatio` `4 / 5` → `5 / 6` (iets minder hoog).
- Gap tussen foto en tekst: `gap-4` → `gap-3`.
- Tekstkolom padding: `py-3` → `py-2`.
- Index-nummer: `text-[0.65rem]` → `text-[0.6rem]`, streepje `width: 20` → `16`, `marginTop: 4` → `3`.
- Titel: `text-[1.15rem]` → `text-[1rem]`, `marginTop: 10` → `8`.
- Beschrijving: `text-[0.72rem]` → `text-[0.68rem]`, `lineHeight: 1.45` → `1.4`, `marginTop: 8` → `6`.
- CTA: `text-[0.6rem]` → `text-[0.55rem]`, `marginTop: 12` → `9`, `paddingBottom: 3` → `2`.

## Wat NIET verandert

- Welkom-blok (blijft verborgen op mobiel).
- Scheidingslijn tussen rijen (`--line`).
- `WorldCard`, desktop grid, `styles.css`, footer, andere routes, assets.

## Verificatie

- Preview 390×844: 4 rijen passen comfortabel in één viewport, iets kleiner dan nu.
- Desktop ≥769px: ongewijzigd.
