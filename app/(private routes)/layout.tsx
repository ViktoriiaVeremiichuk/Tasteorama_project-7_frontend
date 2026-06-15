import Link from "next/link";
import { redirect } from "next/navigation";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import { getCurrentUser } from "@/lib/api/serverApi";
import styles from "./private-layout.module.css";

export default async function PrivateRoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <TanStackProvider>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <Link href="/" className={styles.logo}>
            Tasteorama
          </Link>
          <p className={styles["user-name"]}>{user.name}</p>
        </header>
        {children}
      </div>
    </TanStackProvider>
  );
}
