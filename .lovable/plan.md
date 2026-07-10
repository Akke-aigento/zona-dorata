## Doel

Homepage responsief splitsen:

- **Desktop/tablet (≥768px)**: huidige layout behouden — 4 rijen met afbeelding links en tekst rechts (index, gouden streep, titel, beschrijving, "DISCOVER THE COLLECTION"). Ongewijzigd.
- **Mobiel (<768px)**: alle 4 werelden samen zichtbaar in **één viewport** (geen scroll). Elke tegel = compacte kaart met achtergrondafbeelding + overlay-tekst, hoogte `calc((100svh - 64px) / 4)` (64px = header). Verticaal gestapeld.

## Aanpak in `src/routes/index.tsx`

1. `.zd-worlds` op mobiel: `display: flex; flex-direction: column; height: calc(100svh - 64px)` zodat de 4 rijen samen precies de viewport vullen.
2. `.zd-world-row` op mobiel:
   - `position: relative; flex: 1; min-height: 0;` → gelijke verdeling over de viewport.
   - Afbeelding als absolute achtergrond (`.zd-world-media` → `position: absolute; inset: 0`) met een donkere overlay voor leesbaarheid (`background: linear-gradient(...)` of `::after`).
   - Tekstblok bovenop de afbeelding (`.zd-world-text` → `position: relative; z-index: 1`), gecentreerd, compact: enkel index + titel + korte "DISCOVER →" link. Beschrijving verbergen op mobiel (`.zd-world-desc { display: none }`) om binnen 1 viewport te passen.
   - Tekstkleur op mobiel: `var(--paper)` (wit op donkere overlay).
3. Op `min-width: 768px` alles terug naar de huidige 2-koloms grid met volledige beschrijving zichtbaar en donkere tekst op licht — exact zoals nu.
4. `WorldRow` JSX krijgt een `.zd-world-desc` class op de `<p>` zodat mobiel hem kan verbergen; verder geen structuurwijziging.

## Verificatie

Playwright: laad `/` op 375×812 → screenshot → controleer dat alle 4 tegels zichtbaar zijn zonder scrollen; laad op 1280×800 → screenshot → controleer dat de huidige rijlayout met beschrijving ongewijzigd is.

Bestanden:
- edit `src/routes/index.tsx` (alleen CSS in de `<style>` + één class op de `<p>`).
