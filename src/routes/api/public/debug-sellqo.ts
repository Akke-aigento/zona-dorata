import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/debug-sellqo")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const apiKey = process.env.SELLQO_API_KEY!;
        const tenantId = process.env.SELLQO_TENANT_ID!;
        const endpoint =
          "https://gczmfcabnoofnmfpzeop.supabase.co/functions/v1/storefront-api";
        const action = url.searchParams.get("action") || "get_products";
        const params: Record<string, unknown> = {};
        url.searchParams.forEach((v, k) => {
          if (k === "action") return;
          params[k] = v;
        });
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
            accept: "application/json",
          },
          body: JSON.stringify({ action, tenant_id: tenantId, params }),
        });
        const text = await res.text();
        return new Response(text, {
          status: res.status,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});