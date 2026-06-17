"use client";

import { useState, ChangeEvent } from "react";
import styles from "./AddRecipeForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { addRecipeSchema } from "./validation";

const initialValues = {
  title: "",
  description: "",
  time: "",
  calories: "",
  category: "",
  instructions: "",
};

type IngredientItem = {
  id: string;
  name: string;
  measure: string;
};

export default function AddRecipeForm() {
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
    ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

        setPreview(imageUrl);
    };

    const [ingredients, setIngredients] = useState<IngredientItem[]>([]);

    const [selectedIngredient, setSelectedIngredient] = useState("");

    const [measure, setMeasure] = useState("");

    const handleAddIngredient = () => {
        if (!selectedIngredient || !measure) return;

        const newIngredient = {
            id: crypto.randomUUID(),
            name: selectedIngredient,
            measure,
        };

        setIngredients((prev) => [...prev, newIngredient]);

        setSelectedIngredient("");
        setMeasure("");
    };
    
    const handleRemoveIngredient = (id: string) => {
        setIngredients((prev) =>
            prev.filter((item) => item.id !== id)
        );
        };

    
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={addRecipeSchema}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      <Form className={styles.form}>
        <div className={styles.topSection}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            <h2 className={styles.sectionTitle}>
              General Information
            </h2>

            <div className={styles.fieldGroup}>
              <label htmlFor="title">
                Recipe Title
              </label>

              <Field
                id="title"
                name="title"
                type="text"
                placeholder="Enter the name of your recipe"
              />

              <ErrorMessage
                name="title"
                component="span"
                className={styles.error}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="description">
                Recipe Description
              </label>

              <Field
                as="textarea"
                id="description"
                name="description"
                rows={4}
                placeholder="Enter a brief description of your recipe"
              />

              <ErrorMessage
                name="description"
                component="span"
                className={styles.error}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label htmlFor="time">
                  Cooking time in minutes
                </label>

                <Field
                  id="time"
                  name="time"
                  type="number"
                  placeholder="10"
                />

                <ErrorMessage
                  name="time"
                  component="span"
                  className={styles.error}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="calories">
                  Calories
                </label>

                <Field
                  id="calories"
                  name="calories"
                  type="number"
                  placeholder="150"
                />

                <ErrorMessage
                  name="calories"
                  component="span"
                  className={styles.error}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="category">
                  Category
                </label>

                <Field
                  as="select"
                  id="category"
                  name="category"
                >
                  <option value="">
                    Select category
                  </option>

                  {/* TODO: categories from API */}
                  <option value="Soup">
                    Soup
                  </option>

                  <option value="Dessert">
                    Dessert
                  </option>

                  <option value="Pasta">
                    Pasta
                  </option>
                </Field>

                <ErrorMessage
                  name="category"
                  component="span"
                  className={styles.error}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <h2 className={styles.sectionTitle}>
              Upload Photo
            </h2>

           <label className={styles.uploadBox}>
            <input
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={handleImageChange}
            />

            {preview ? (
                <img
                src={preview}
                alt="Recipe preview"
                className={styles.previewImage}
                />
            ) : (
                <div className={styles.cameraIcon}>
                📷
                </div>
            )}
            </label>
          </div>
        </div>

        {/* Ingredients */}
        <section className={styles.ingredientsSection}>
          <h2 className={styles.sectionTitle}>
            Ingredients
          </h2>

          <div className={styles.ingredientsControls}>
            <div className={styles.fieldGroup}>
              <label htmlFor="ingredient">
                Name
              </label>

              <select
                id="ingredient"
                value={selectedIngredient}
                onChange={(e) =>
                    setSelectedIngredient(e.target.value)
                }
>
                <option>
                  Broccoli
                </option>
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
                value={measure}
                onChange={(e) =>
                    setMeasure(e.target.value)
                }
                />
            </div>

            <button
                type="button"
                onClick={handleAddIngredient}
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

            {ingredients.map((ingredient) => (
                <div
                    key={ingredient.id}
                    className={styles.ingredientItem}
                >
                    <span>{ingredient.name}</span>

                    <span>{ingredient.measure}</span>

                    <button
                    type="button"
                    onClick={() =>
                        handleRemoveIngredient(ingredient.id)
                    }
                    >
                    ✕
                    </button>
                </div>
                ))}
          </div>
        </section>

        {/* Instructions */}
        <section className={styles.instructionsSection}>
          <h2 className={styles.sectionTitle}>
            Instructions
          </h2>

          <Field
            as="textarea"
            name="instructions"
            rows={6}
            placeholder="Enter a text"
            className={styles.instructionsTextarea}
          />

          <ErrorMessage
            name="instructions"
            component="span"
            className={styles.error}
          />
        </section>

        <button
          type="submit"
          className={styles.submitButton}
        >
          Publish Recipe
        </button>
      </Form>
    </Formik>
  );
}