import { redirect } from "next/navigation";
import { checkPaidTier, PAYWALL_ERROR_CODES } from "@/lib/access/paywall";

export default async function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await checkPaidTier();

  if (!result.ok) {
    if (result.reason === PAYWALL_ERROR_CODES.UNAUTHENTICATED) {
      redirect("/login?redirect=/posts");
    }
    redirect("/pricing?upgrade=pro&from=/posts");
  }

  return <>{children}</>;
}
