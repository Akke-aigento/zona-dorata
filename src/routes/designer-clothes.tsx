import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/designer-clothes")({
  head: () => ({ meta: [{ title: "Designer Clothes — Zona Dorata" }] }),
  component: () => <ComingSoon title="DESIGNER CLOTHES" />,
});