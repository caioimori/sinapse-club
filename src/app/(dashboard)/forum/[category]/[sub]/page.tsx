import { redirect } from "next/navigation";

export default async function ForumSubcategoryPage({
  params,
}: {
  params: Promise<{ category: string; sub: string }>;
}) {
  const { category: categorySlug } = await params;
  redirect(`/forum?categoria=${categorySlug}`);
}
