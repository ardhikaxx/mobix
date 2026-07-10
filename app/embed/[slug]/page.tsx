import appsData from "@/public/data/apps.json";
import EmbedCard from "./EmbedCard";

export default function EmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <EmbedCard slugPromise={params} />;
}
