import { Link } from "@tanstack/react-router";
import logoGold from "@/assets/brand/logo-gold.svg";

const cols: Array<{ title: string; items: Array<{ label: string; to?: string }> }> = [
  {
    title: "Shop",
    items: [
      { label: "Perfumes", to: "/perfumes" },
      { label: "Jewellery", to: "/jewellery" },
      { label: "Artworks", to: "/artworks" },
      { label: "Designer Clothes", to: "/designer-clothes" },
    ],
  },
  {
    title: "Maison",
    items: [
      { label: "About Zona Dorata" },
      { label: "Our Story" },
      { label: "Craftsmanship" },
    ],
  },
  {
    title: "Help",
    items: [
      { label: "Contact" },
      { label: "Shipping & Returns" },
      { label: "Privacy Policy" },
      { label: "Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer style={{ background: "var(--black)" }}>
      <div className="section-shell px-6 pt-24 pb-12">
        <div className="grid gap-12 md:grid-cols-4">
          {cols.map((c) => (
            <div key={c.title}>
              <h4
                className="brand-wordmark text-[0.7rem]"
                style={{ color: "var(--gold)", letterSpacing: "0.2em" }}
              >
                {c.title}
              </h4>
              <ul className="mt-6 space-y-3">
                {c.items.map((i) => (
                  <li key={i.label} className="text-[0.85rem]" style={{ color: "rgba(245,238,224,0.7)", lineHeight: 2 }}>
                    {i.to ? <Link to={i.to}>{i.label}</Link> : <span>{i.label}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4
              className="brand-wordmark text-[0.7rem]"
              style={{ color: "var(--gold)", letterSpacing: "0.2em" }}
            >
              Newsletter
            </h4>
            <p className="mt-6 text-[0.85rem]" style={{ color: "rgba(245,238,224,0.7)" }}>
              Be the first to know.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 flex items-center gap-3"
            >
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent py-2 text-[0.85rem] outline-none"
                style={{
                  color: "var(--bone)",
                  borderBottom: "1px solid rgba(245,238,224,0.3)",
                }}
              />
              <button
                type="submit"
                className="ui-label text-[0.9rem]"
                style={{ color: "var(--bone)" }}
                aria-label="Subscribe"
              >
                →
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center gap-4">
          <img src={logoGold} alt="Zona Dorata" style={{ height: 32 }} />
          <p className="text-[0.7rem]" style={{ color: "rgba(245,238,224,0.4)" }}>
            © 2026 Zona Dorata Italia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}