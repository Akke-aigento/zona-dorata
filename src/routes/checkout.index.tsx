import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useCart } from "@/lib/cart-context";
import { checkoutStart, checkoutSetCustomer } from "@/lib/checkout";
import { EmptyCartRedirect, FieldError, FormField, PrimaryButton } from "@/components/site/CheckoutForm";

export const Route = createFileRoute("/checkout/")({
  head: () => ({
    meta: [
      { title: "Checkout · Contact — Zona Dorata" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ContactStep,
});

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  first_name: z.string().min(1, "First name required"),
  last_name: z.string().min(1, "Last name required"),
  accepts_marketing: z.boolean().optional(),
});

function ContactStep() {
  const navigate = useNavigate();
  const { count } = useCart();
  const [values, setValues] = useState({
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    accepts_marketing: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  useEffect(() => {
    // Kick off checkout so the backend knows we're in checkout.
    if (count > 0) checkoutStart().catch(() => {});
  }, [count]);

  if (count === 0) return <EmptyCartRedirect />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    setServerErr(null);
    try {
      await checkoutSetCustomer(parsed.data);
      navigate({ to: "/checkout/address" });
    } catch (e: any) {
      setServerErr(e?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <h2
        className="text-[1.4rem]"
        style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
      >
        Contact
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FormField label="First name" required>
          <input
            className="zd-input"
            value={values.first_name}
            onChange={(e) => setValues((v) => ({ ...v, first_name: e.target.value }))}
            autoComplete="given-name"
          />
          <FieldError message={errors.first_name} />
        </FormField>
        <FormField label="Last name" required>
          <input
            className="zd-input"
            value={values.last_name}
            onChange={(e) => setValues((v) => ({ ...v, last_name: e.target.value }))}
            autoComplete="family-name"
          />
          <FieldError message={errors.last_name} />
        </FormField>
        <FormField label="Email" required className="sm:col-span-2">
          <input
            type="email"
            className="zd-input"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            autoComplete="email"
          />
          <FieldError message={errors.email} />
        </FormField>
        <FormField label="Phone (optional)" className="sm:col-span-2">
          <input
            className="zd-input"
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            autoComplete="tel"
          />
        </FormField>
        <label
          className="sm:col-span-2 flex items-start gap-3 text-[0.85rem]"
          style={{ color: "var(--ink)" }}
        >
          <input
            type="checkbox"
            checked={values.accepts_marketing}
            onChange={(e) => setValues((v) => ({ ...v, accepts_marketing: e.target.checked }))}
            className="mt-1"
          />
          Email me about new drops and stories from Zona Dorata.
        </label>
      </div>
      {serverErr && (
        <p className="mt-4 text-[0.85rem]" style={{ color: "var(--destructive)" }}>
          {serverErr}
        </p>
      )}
      <PrimaryButton disabled={busy}>{busy ? "Saving…" : "Continue to Address"}</PrimaryButton>
    </form>
  );
}