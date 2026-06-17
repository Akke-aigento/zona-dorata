import { sellqoProxy } from "./sellqo.functions";

export type SellqoImage = string | { url: string; alt?: string };

export type SellqoProduct = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number | null;
  images?: SellqoImage[];
  featured_image?: SellqoImage | null;
  in_stock?: boolean;
  has_variants?: boolean;
  sku?: string;
  price_range?: { min: number; max: number } | null;
  variants?: Array<{
    id: string;
    name?: string;
    price?: number;
    sku?: string;
    option_values?: Record<string, string>;
    in_stock?: boolean;
  }>;
  options?: Array<{ name: string; values: string[] }>;
  related_products?: SellqoProduct[];
};

export type SellqoPagination = {
  page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
};

export function imageUrl(img?: SellqoImage | null): string | null {
  if (!img) return null;
  return typeof img === "string" ? img : img.url ?? null;
}

export function productCover(p: SellqoProduct): string | null {
  return (
    imageUrl(p.featured_image) ??
    imageUrl(p.images?.[0] ?? null) ??
    null
  );
}

export function formatEUR(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

type FetchOpts = {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
};

/**
 * Frontend helper that calls SellQo through the server-side proxy.
 * Pass a SellQo API path (e.g. "/products", "/products/slug", "/cart").
 * Query params can be embedded in `path` or passed via `query`.
 */
export async function sellqoFetch<T = unknown>(
  path: string,
  opts: FetchOpts = {},
): Promise<T> {
  // Split inline query string into the proxy's `query` map so the server fn
  // can rebuild the URL cleanly.
  let cleanPath = path;
  const query: Record<string, string | number | undefined> = { ...(opts.query ?? {}) };
  const qIdx = path.indexOf("?");
  if (qIdx >= 0) {
    cleanPath = path.slice(0, qIdx);
    const sp = new URLSearchParams(path.slice(qIdx + 1));
    sp.forEach((v, k) => {
      query[k] = v;
    });
  }

  return (await sellqoProxy({
    data: {
      path: cleanPath,
      method: opts.method ?? "GET",
      body: opts.body,
      query,
    },
  })) as T;
}

// --- Cart session helpers (browser-only) ------------------------------------
const SESSION_KEY = "zd_session_id";
const CART_KEY = "zd_cart_id";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      (crypto.randomUUID && crypto.randomUUID()) ||
      `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CART_KEY);
}

export function storeCartId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, id);
}

export function clearCartId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_KEY);
}

export async function ensureCartId(): Promise<string> {
  const existing = getStoredCartId();
  if (existing) return existing;
  const sessionId = getOrCreateSessionId();
  const raw = await sellqoFetch<any>("/cart", {
    method: "POST",
    body: { session_id: sessionId },
  });
  const id = raw?.cart_id ?? raw?.id ?? raw?.cart?.id;
  if (!id) throw new Error("SellQo: cart_id missing in /cart response");
  storeCartId(id);
  return id;
}

export async function fetchCart(): Promise<any | null> {
  const sessionId = getOrCreateSessionId();
  if (!sessionId) return null;
  try {
    return await sellqoFetch<any>("/cart", { query: { session_id: sessionId } });
  } catch {
    return null;
  }
}