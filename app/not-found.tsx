import type { Metadata } from "next";
import NotFoundRecipe from "@/components/NotFoundRecipe/NotFoundRecipe";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Tasteorama",
  description:
    "The page you are looking for does not exist or may have been moved.",
};

export default function NotFound() {
  return <NotFoundRecipe />;
}
