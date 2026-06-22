import AddRecipeForm from "@/components/AddRecipeForm/AddRecipeForm";
import styles from "./AddRecipePage.module.css";

export default function AddRecipePage() {
  return (
    <main>
      <h1 className={styles.title}>Add Recipe</h1>

      <AddRecipeForm />
    </main>
  );
}