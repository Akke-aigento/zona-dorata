import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/lib/cart-context";
import { checkoutGetOrder, checkoutSetShipping, type ShippingMethod } from "@/lib/checkout";
import { formatEUR } from "@/lib/sellqo";
import { EmptyCartRedirect, PrimaryButton } from "@/components/site/CheckoutForm";

export const Route = createFileRoute("/checkout/shipping")({
  head: () => ({
    meta: [
      { title: "Checkout · Shipping — Zona Dorata" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ShippingStep,
});

function ShippingStep() {
  const navigate = useNavigate();
  const { count } = useCart();
  const { data, isLoading, error } = useQuery({
    queryKey: ["checkout", "order"],
    queryFn: () => checkoutGetOrder(),
    enabled: count > 0,
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  if (count === 0) return <EmptyCartRedirect />;

  const methods: ShippingMethod[] = data?.shipping_methods ?? [];
  const activeId = selected ?? data?.selected_shipping_method_id ?? methods[0]?.id ?? null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeId) return;
    setBusy(true);
    setServerErr(null);
    try {
      await checkoutSetShipping(activeId);
      navigate({ to: "/checkout/payment" });
    } catch (e: any) {
      setServerErr(e?.message ?? "Could not set shipping method");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h2
        className="text-[1.4rem]"
        style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
      >
        Shipping method
      </h2>

      {isLoading ? (
        <p className="mt-6 text-[0.9rem]" style={{ color: "var(--muted-tone)" }}>
          Loading shipping options…
        </p>
      ) : error ? (
        <p className="mt-6 text-[0.9rem]" style={{ color: "var(--destructive)" }}>
          {(error as Error).message}
        </p>
      ) : methods.length === 0 ? (
        <p className="mt-6 text-[0.9rem]" style={{ color: "var(--muted-tone)" }}>
          No shipping options are available for your address.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {methods.map((m) => {
            const active = activeId === m.id;
            return (
              <li key={m.id}>
                <label
                  className="flex cursor-pointer items-center justify-between gap-4 p-4 transition-colors"
                  style={{
                    border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`,
                    background: active ? "var(--bone)" : "transparent",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={active}
                      onChange={() => setSelected(m.id)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-[0.95rem]" style={{ color: "var(--ink)" }}>
                        {m.name}
                      </p>
                      {(m.description || m.estimated_delivery) && (
                        <p className="mt-1 text-[0.75rem]" style={{ color: "var(--muted-tone)" }}>
                          {m.description}
                          {m.description && m.estimated_delivery ? " · " : ""}
                          {m.estimated_delivery}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[0.95rem]" style={{ color: "var(--ink)" }}>
                    {m.price === 0 ? "Free" : formatEUR(m.price)}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {serverErr && (
        <p className="mt-4 text-[0.85rem]" style={{ color: "var(--destructive)" }}>
          {serverErr}
        </p>
      )}
      <PrimaryButton disabled={busy || !activeId}>
        {busy ? "Saving…" : "Continue to Payment"}
      </PrimaryButton>
    </form>
  );
}