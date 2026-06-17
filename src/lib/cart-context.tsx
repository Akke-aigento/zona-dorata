import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { ensureCartId, fetchCart, sellqoFetch } from "./sellqo";

type CartCtx = {
  count: number;
  refresh: () => Promise<void>;
  addItem: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
};

const Ctx = createContext<CartCtx>({
  count: 0,
  refresh: async () => {},
  addItem: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    const cart = await fetchCart();
    const n = cart?.item_count ?? cart?.cart?.item_count ?? 0;
    setCount(typeof n === "number" ? n : 0);
  }, []);

  const addItem = useCallback(
    async (productId: string, variantId?: string, quantity = 1) => {
      const cartId = await ensureCartId();
      const res = await sellqoFetch<any>("/cart/add", {
        method: "POST",
        body: {
          cart_id: cartId,
          product_id: productId,
          variant_id: variantId,
          quantity,
        },
      });
      const n = res?.item_count ?? res?.cart?.item_count;
      if (typeof n === "number") setCount(n);
      else await refresh();
    },
    [refresh],
  );

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  return <Ctx.Provider value={{ count, refresh, addItem }}>{children}</Ctx.Provider>;
}

export function useCart() {
  return useContext(Ctx);
}