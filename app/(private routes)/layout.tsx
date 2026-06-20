import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/serverApi";

type PrivateLayoutProps = {
  children: React.ReactNode;
};

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
