import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Montserrat, DM_Sans } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthModalProvider from "@/components/AuthModalProvider/AuthModalProvider";

const montserrat = Montserrat({
  variable: "--font-family",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--second-family",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tasteorama",
  description: "Додаток для обміну кулінарними рецептами",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html
    lang="uk"
    className={`${montserrat.variable} ${dmSans.variable}`}
  >
    <body>
      <TanStackProvider>
        <Toaster position="top-right" />
        <Header />
        <div className="pageWrapper">
          <main>{children}</main>
          <Footer />
        </div>

        <AuthModalProvider />
      </TanStackProvider>
    </body>
  </html>
);
}
