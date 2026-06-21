import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { Montserrat, DM_Sans } from "next/font/google";
import "modern-normalize/modern-normalize.css";
import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import AuthModalProvider from "@/components/AuthModalProvider/AuthModalProvider";
import AuthProvider from "@/components/AuthProvider/AuthProvider";

const montserrat = Montserrat({
  variable: "--font-family",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--second-family",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
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
      data-scroll-behavior="smooth"
      className={`${montserrat.variable} ${dmSans.variable}`}
    >
      <body>
        <TanStackProvider>
          <AuthProvider>
            <Toaster position="top-right" />
            <Header />
            <div className="pageWrapper">
              <main>{children}</main>
              <Footer />
            </div>
            <AuthModalProvider />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
