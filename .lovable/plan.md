## Problem
The footer (and likely the header) currently displays a logo that reads **"ZINCE TRADING B.V."** instead of **Zona Dorata**. The three SVG brand assets in `src/assets/brand/` contain ZINCE letter paths in their path data.

## Solution
Replace the existing SVG logo files (`logo-gold.svg`, `logo-white.svg`, `logo-black.svg`) with new versions that show the brand name **ZONA DORATA** in the project's luxury typography (Cinzel/Cormorant Garamond) while preserving the diamond mark.

## Implementation steps
1. Generate or reconstruct three SVG logo variants:
   - `logo-gold.svg` — gold fill (`#B8902E`) for the dark footer.
   - `logo-white.svg` — off-white fill (`#FDFBF6`) for dark headers/sections.
   - `logo-black.svg` — dark fill (`#1A1813`) for light backgrounds.
2. Keep the same viewBox dimensions and approximate proportions so the existing usage in `Footer.tsx` and `Header.tsx` does not require layout changes.
3. Verify the footer no longer shows "ZINCE" by checking the preview on mobile and desktop.

## Files to change
- `src/assets/brand/logo-gold.svg`
- `src/assets/brand/logo-white.svg`
- `src/assets/brand/logo-black.svg`

No changes needed in `Footer.tsx` or `Header.tsx` unless the new logo dimensions force a small size adjustment.