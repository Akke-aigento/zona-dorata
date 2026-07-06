import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useCart } from "@/lib/cart-context";
import { checkoutSetAddress } from "@/lib/checkout";
import {
  EmptyCartRedirect,
  FieldError,
  FormField,
  PrimaryButton,
} from "@/components/site/CheckoutForm";

export const Route = createFileRoute("/checkout/address")({
  head: () => ({
    meta: [
      { title: "Checkout · Address — Zona Dorata" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AddressStep,
});

const addressSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  address_line_1: z.string().min(1, "Required"),
  address_line_2: z.string().optional(),
  postal_code: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  country: z.string().min(2, "Required"),
});

const empty = {
  first_name: "",
  last_name: "",
  address_line_1: "",
  address_line_2: "",
  postal_code: "",
  city: "",
  country: "BE",
};

function AddressStep() {
  const navigate = useNavigate();
  const { count } = useCart();
  const [shipping, setShipping] = useState({ ...empty });
  const [billing, setBilling] = useState({ ...empty });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  if (count === 0) return <EmptyCartRedirect />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const sParsed = addressSchema.safeParse(shipping);
    const bParsed = sameAsShipping ? null : addressSchema.safeParse(billing);
    const errs: Record<string, string> = {};
    if (!sParsed.success) {
      for (const i of sParsed.error.issues) errs[`s_${i.path[0] as string}`] = i.message;
    }
    if (bParsed && !bParsed.success) {
      for (const i of bParsed.error.issues) errs[`b_${i.path[0] as string}`] = i.message;
    }
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setBusy(true);
    setServerErr(null);
    try {
      await checkoutSetAddress({
        shipping_address: sParsed.data,
        billing_address: sameAsShipping ? undefined : (bParsed as any).data,
        billing_same_as_shipping: sameAsShipping,
      });
      navigate({ to: "/checkout/shipping" });
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
        Shipping address
      </h2>
      <AddressFields
        values={shipping}
        onChange={setShipping}
        prefix="s"
        errors={errors}
      />

      <label
        className="mt-6 flex items-start gap-3 text-[0.85rem]"
        style={{ color: "var(--ink)" }}
      >
        <input
          type="checkbox"
          checked={sameAsShipping}
          onChange={(e) => setSameAsShipping(e.target.checked)}
          className="mt-1"
        />
        Billing address is the same as shipping.
      </label>

      {!sameAsShipping && (
        <>
          <h2
            className="mt-10 text-[1.4rem]"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            Billing address
          </h2>
          <AddressFields
            values={billing}
            onChange={setBilling}
            prefix="b"
            errors={errors}
          />
        </>
      )}

      {serverErr && (
        <p className="mt-4 text-[0.85rem]" style={{ color: "var(--destructive)" }}>
          {serverErr}
        </p>
      )}
      <PrimaryButton disabled={busy}>{busy ? "Saving…" : "Continue to Shipping"}</PrimaryButton>
    </form>
  );
}

function AddressFields({
  values,
  onChange,
  prefix,
  errors,
}: {
  values: typeof empty;
  onChange: (v: typeof empty) => void;
  prefix: "s" | "b";
  errors: Record<string, string>;
}) {
  const upd = (k: keyof typeof empty, v: string) => onChange({ ...values, [k]: v });
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <FormField label="First name" required>
        <input className="zd-input" value={values.first_name} onChange={(e) => upd("first_name", e.target.value)} autoComplete="given-name" />
        <FieldError message={errors[`${prefix}_first_name`]} />
      </FormField>
      <FormField label="Last name" required>
        <input className="zd-input" value={values.last_name} onChange={(e) => upd("last_name", e.target.value)} autoComplete="family-name" />
        <FieldError message={errors[`${prefix}_last_name`]} />
      </FormField>
      <FormField label="Address" required className="sm:col-span-2">
        <input className="zd-input" value={values.address_line_1} onChange={(e) => upd("address_line_1", e.target.value)} autoComplete="address-line1" />
        <FieldError message={errors[`${prefix}_address_line_1`]} />
      </FormField>
      <FormField label="Apartment, suite (optional)" className="sm:col-span-2">
        <input className="zd-input" value={values.address_line_2} onChange={(e) => upd("address_line_2", e.target.value)} autoComplete="address-line2" />
      </FormField>
      <FormField label="Postal code" required>
        <input className="zd-input" value={values.postal_code} onChange={(e) => upd("postal_code", e.target.value)} autoComplete="postal-code" />
        <FieldError message={errors[`${prefix}_postal_code`]} />
      </FormField>
      <FormField label="City" required>
        <input className="zd-input" value={values.city} onChange={(e) => upd("city", e.target.value)} autoComplete="address-level2" />
        <FieldError message={errors[`${prefix}_city`]} />
      </FormField>
      <FormField label="Country" required className="sm:col-span-2">
        <select
          className="zd-input"
          value={values.country}
          onChange={(e) => upd("country", e.target.value)}
          autoComplete="country"
        >
          <option value="BE">Belgium</option>
          <option value="NL">Netherlands</option>
          <option value="LU">Luxembourg</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
          <option value="IT">Italy</option>
          <option value="ES">Spain</option>
          <option value="AT">Austria</option>
          <option value="PT">Portugal</option>
          <option value="IE">Ireland</option>
          <option value="DK">Denmark</option>
          <option value="SE">Sweden</option>
          <option value="FI">Finland</option>
          <option value="GB">United Kingdom</option>
        </select>
        <FieldError message={errors[`${prefix}_country`]} />
      </FormField>
    </div>
  );
}