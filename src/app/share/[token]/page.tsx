import { getSharedProject } from "@/actions/sharing";
import { notFound } from "next/navigation";
import SharePreview from "./SharePreview";

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await getSharedProject(token);

  if (!result.success || !result.blueprint) {
    notFound();
  }

  return (
    <SharePreview
      blueprint={result.blueprint}
      siteName={result.siteName || "Untitled"}
    />
  );
}
