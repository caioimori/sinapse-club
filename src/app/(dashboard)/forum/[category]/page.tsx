import { redirect } from "next/navigation";

export default async function ForumCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  redirect(`/forum?categoria=${categorySlug}`);
}
