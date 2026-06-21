import Image from "next/image";
import Link from "next/link";

export default function NotFoundRecipe() {
  return (
    <main>
      <div className="not-found-recipe-container">
        <Image
          src="/not-found.jpg"
          alt="Not Found Recipe"
          width={600}
          height={438}
          className="not-found-recipe-image"
        />
        <h1 className="not-found-recipe-title">404</h1>
        <p className="not-found-recipe-text">Recipe not found</p>
        <Link href="/" className="not-found-recipe-link">
          <Image
            src="/arrow.svg"
            className="not-found-recipe-icon"
            alt="arrow"
            width={24}
            height={24}
          />
          Back to Home
        </Link>
      </div>
    </main>
  );
}
