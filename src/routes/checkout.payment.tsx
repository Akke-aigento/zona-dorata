import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/lib/cart-context";
import {
  checkoutComplete,
  checkoutGetOrder,
  checkoutSelectPayment,
  type PaymentMethod,
} from "@/lib/checkout";
import { formatEUR } from "@/lib/sellqo";
import { EmptyCartRedirect, PrimaryButton } from "@/components/site/CheckoutForm";

export const Route = createFileRoute("/checkout/payment")({
  head: () => ({
    meta: [
      { title: "Checkout · Payment — Zona Dorata" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaymentStep,
});

function PaymentStep() {
  const navigate = useNavigate();
  const { count, resetLocal } = useCart();
  const { data, isLoading, error } = useQuery({
    queryKey: ["checkout", "order", "payment"],
    queryFn: () => checkoutGetOrder(),
    enabled: count > 0,
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  if (count === 0) return <EmptyCartRedirect />;

  const methods: PaymentMethod[] = data?.payment_methods ?? [];
  const activeId = selected ?? data?.selected_payment_method_id ?? methods[0]?.id ?? null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeId || !terms) return;
    setBusy(true);
    setServerErr(null);
    try {
      await checkoutSelectPayment(activeId);
      const result = await checkoutComplete();
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
        return;
      }
      const orderId = result.order_id;
      resetLocal();
      if (orderId) {
        navigate({ to: "/checkout/confirmation/$orderId", params: { orderId } });
      } else {
        navigate({ to: "/" });
      }
    } catch (e: any) {
      setServerErr(e?.message ?? "Payment failed");
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
        Payment method
      </h2>

      {isLoading ? (
        <p className="mt-6 text-[0.9rem]" style={{ color: "var(--muted-tone)" }}>
          Loading payment options…
        </p>
      ) : error ? (
        <p className="mt-6 text-[0.9rem]" style={{ color: "var(--destructive)" }}>
          {(error as Error).message}
        </p>
      ) : methods.length === 0 ? (
        <p className="mt-6 text-[0.9rem]" style={{ color: "var(--muted-tone)" }}>
          No payment options available. Please contact us.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {methods.map((m) => {
            const active = activeId === m.id;
            return (
              <li key={m.id}>
                <label
                  className="flex cursor-pointer items-start gap-3 p-4 transition-colors"
                  style={{
                    border: `1px solid ${active ? "var(--ink)" : "var(--line)"}`,
                    background: active ? "var(--bone)" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={active}
                    onChange={() => setSelected(m.id)}
                    className="mt-1"
                  />
                  <div className="min-w-0">
                    <p className="text-[0.95rem]" style={{ color: "var(--ink)" }}>
                      {m.name}
                    </p>
                    {m.description && (
                      <p className="mt-1 text-[0.75rem]" style={{ color: "var(--muted-tone)" }}>
                        {m.description}
                      </p>
                    )}
                  </div>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {data && (
        <div
          className="mt-8 border-t pt-4 space-y-1 text-[0.9rem]"
          style={{ borderColor: "var(--line)" }}
        >
          {data.subtotal != null && (
            <Row label="Subtotal" value={formatEUR(data.subtotal)} />
          )}
          {data.shipping_total != null && (
            <Row label="Shipping" value={data.shipping_total === 0 ? "Free" : formatEUR(data.shipping_total)} />
          )}
          {data.tax_total != null && data.tax_total > 0 && (
            <Row label="Tax" value={formatEUR(data.tax_total)} />
          )}
          {data.total != null && (
            <div
              className="mt-2 flex items-baseline justify-between pt-2 border-t"
              style={{ borderColor: "var(--line)" }}
            >
              <span className="ui-label text-[0.75rem]" style={{ color: "var(--ink)" }}>Total</span>
              <span className="text-[1.1rem]" style={{ color: "var(--ink)", fontWeight: 500 }}>
                {formatEUR(data.total)}
              </span>
            </div>
          )}
        </div>
      )}

      <label className="mt-6 flex items-start gap-3 text-[0.85rem]" style={{ color: "var(--ink)" }}>
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          className="mt-1"
        />
        I agree to the terms of sale and privacy policy.
      </label>

      {serverErr && (
        <p className="mt-4 text-[0.85rem]" style={{ color: "var(--destructive)" }}>
          {serverErr}
        </p>
      )}
      <PrimaryButton disabled={busy || !activeId || !terms}>
        {busy ? "Processing…" : "Complete order"}
      </PrimaryButton>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span style={{ color: "var(--muted-tone)" }}>{label}</span>
      <span style={{ color: "var(--ink)" }}>{value}</span>
    </div>
  );
}