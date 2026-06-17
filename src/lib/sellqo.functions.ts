import { createServerFn } from "@tanstack/react-start";

type ProxyInput = {
  path: string;
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
};

function buildUrl(base: string, path: string, query?: ProxyInput["query"]) {
  const url = new URL(path.replace(/^\//, ""), base.endsWith("/") ? base : base + "/");
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

export const sellqoProxy = createServerFn({ method: "POST" })
  .inputValidator((data: ProxyInput) => {
    if (!data || typeof data.path !== "string") {
      throw new Error("sellqoProxy: 'path' is required");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const base = process.env.SELLQO_API_URL;
    const apiKey = process.env.SELLQO_API_KEY;
    const tenantId = process.env.SELLQO_TENANT_ID;

    if (!base || !apiKey) {
      throw new Error(
        "SellQo proxy is not configured. Missing SELLQO_API_URL or SELLQO_API_KEY secret.",
      );
    }

    const url = buildUrl(base, data.path, data.query);
    const headers: Record<string, string> = {
      "x-api-key": apiKey,
      "accept": "application/json",
    };
    if (tenantId) headers["x-tenant-id"] = tenantId;
    if (data.body !== undefined) headers["content-type"] = "application/json";

    const res = await fetch(url, {
      method: data.method ?? "GET",
      headers,
      body: data.body !== undefined ? JSON.stringify(data.body) : undefined,
    });

    const text = await res.text();
    let json: unknown = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { raw: text };
    }

    if (!res.ok) {
      const message =
        (json && typeof json === "object" && "message" in json && (json as any).message) ||
        `SellQo ${res.status} ${res.statusText}`;
      throw new Error(String(message));
    }

    return json as any;
  });