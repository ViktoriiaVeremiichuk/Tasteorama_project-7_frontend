import AddRecipeForm from "@/components/AddRecipeForm/AddRecipeForm";
import styles from "./AddRecipePage.module.css";

export default function AddRecipePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Add Recipe</h1>
        <AddRecipeForm />
      </div>
    </main>
  );
}