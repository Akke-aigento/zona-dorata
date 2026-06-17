import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/site/ComingSoon";

export const Route = createFileRoute("/jewellery")({
  head: () => ({ meta: [{ title: "Jewellery — Zona Dorata" }] }),
  component: () => <ComingSoon title="JEWELLERY" />,
});