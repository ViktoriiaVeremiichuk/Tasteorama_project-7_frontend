import AddRecipeForm from "@/components/AddRecipeForm/AddRecipeForm";
import mainCss from "../../page.module.css";
import css from "./AddRecipePage.module.css";

export default function AddRecipePage() {
  return (
    <main className={`${mainCss.mainContainer} ${css.wrapper}`}>
      <h1 className={css.title}>Add Recipe</h1>
      <AddRecipeForm />
    </main>
  );
}
