import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-context";

const navItems = [
  { to: "/perfumes", label: "Perfumes" },
  { to: "/jewellery", label: "Jewellery" },
  { to: "/artworks", label: "Artworks" },
  { to: "/designer-clothes", label: "Clothes" },
];

export function Header() {
  const { count } = useCart();
  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: "var(--paper)", borderColor: "var(--line)" }}
    >
      <div className="section-shell flex h-[64px] items-center justify-between">
        <Link to="/" className="brand-wordmark text-[0.95rem]" style={{ color: "var(--ink)" }}>
          Zona Dorata
        </Link>
        <nav className="hidden gap-8 md:flex">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="ui-label text-[0.7rem]"
              style={{ color: "var(--ink)" }}
              activeProps={{ style: { color: "var(--gold)" } }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ui-label text-[0.7rem]" style={{ color: "var(--ink)" }}>
          Bag ({count})
        </div>
      </div>
    </header>
  );
}