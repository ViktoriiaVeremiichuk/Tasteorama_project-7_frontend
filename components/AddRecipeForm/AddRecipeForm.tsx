import styles from "./AddRecipeForm.module.css";

export default function AddRecipeForm() {
  return (
    <form className={styles.form}>
      <div className={styles.topSection}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          <h2 className={styles.sectionTitle}>General Information</h2>

          <div className={styles.fieldGroup}>
            <label htmlFor="title">Recipe Title</label>
            <input
              id="title"
              type="text"
              placeholder="Enter the name of your recipe"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="description">Recipe Description</label>

            <textarea
              id="description"
              rows={4}
              placeholder="Enter a brief description of your recipe"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label htmlFor="time">Cooking time in minutes</label>

              <input
                id="time"
                type="number"
                placeholder="10"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="calories">Calories</label>

              <input
                id="calories"
                type="number"
                placeholder="150"
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="category">Category</label>

              <select id="category">
                <option>Soup</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          <h2 className={styles.sectionTitle}>Upload Photo</h2>

          <label className={styles.uploadBox}>
            <input
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
            />

            <div className={styles.cameraIcon}>
              📷
            </div>
          </label>
        </div>
      </div>

      {/* Ingredients */}
      <section className={styles.ingredientsSection}>
        <h2 className={styles.sectionTitle}>Ingredients</h2>

        <div className={styles.ingredientsControls}>
          <div className={styles.fieldGroup}>
            <label htmlFor="ingredient">
              Name
            </label>

            <select id="ingredient">
              <option>Broccoli</option>
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="amount">
              Amount
            </label>

            <input
              id="amount"
              type="text"
              placeholder="100g"
            />
          </div>

          <button
            type="button"
            className={styles.addButton}
          >
            Add new ingredient
          </button>
        </div>

        <div className={styles.ingredientsList}>
          <div className={styles.ingredientsHeader}>
            <span>Name:</span>
            <span>Amount:</span>
          </div>

          {/* Ingredient items will go here */}
        </div>
      </section>

      {/* Instructions */}
      <section className={styles.instructionsSection}>
        <h2 className={styles.sectionTitle}>
          Instructions
        </h2>

        <textarea
          rows={6}
          placeholder="Enter a text"
          className={styles.instructionsTextarea}
        />
      </section>

      <button
        type="submit"
        className={styles.submitButton}
      >
        Publish Recipe
      </button>
    </form>
  );
}