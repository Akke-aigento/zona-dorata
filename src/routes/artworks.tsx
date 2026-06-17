import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/artworks")({
  head: () => ({ meta: [{ title: "Artworks — Zona Dorata" }] }),
  component: () => <ComingSoon title="ARTWORKS" />,
});