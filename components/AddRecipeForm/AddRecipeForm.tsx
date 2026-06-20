"use client";

import {
    useState,
    useEffect,
    ChangeEvent
} from "react";
import { useRouter } from "next/navigation";
import styles from "./AddRecipeForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-hot-toast";
import { addRecipeSchema } from "./validation";
import  { buildRecipeFormData } from "./helpers";
import {
    createRecipe,
    getCategories,
    getIngredients, } from "@/lib/api/clientApi";

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

type Category = {
  _id: string;
  name: string;
};

type Ingredient = {
  _id: string;
  name: string;
};

type IngredientOption = {
  _id: string;
  name: string;
};

export default function AddRecipeForm() {
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] =  useState<File | null>(null);

    const router = useRouter();

    const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
    ) => {
    const file = event.target.files?.[0];

        if (!file) return;
        
        setImageFile(file);

    const imageUrl = URL.createObjectURL(file);

        setPreview(imageUrl);
    };

    const [ingredients, setIngredients] = useState<IngredientItem[]>([]);

    const [selectedIngredient, setSelectedIngredient] = useState("");

    const [measure, setMeasure] = useState("");

    const [measureError, setMeasureError] = useState("");

    const handleAddIngredient = () => {
        if (!selectedIngredient || !measure) return;

        if (measure.length < 2 || measure.length > 16) {
            setMeasureError(
            "Amount must be between 2 and 16 characters"
            );

            return;
        }

        setMeasureError("");

        const ingredient = availableIngredients.find(
            (item) => item._id === selectedIngredient
        );

        if (!ingredient) return;

        const newIngredient = {
            id: ingredient._id,
            name: ingredient.name,
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
    
    const [categories, setCategories] =
        useState<Category[]>([]);

    const [availableIngredients, setAvailableIngredients] =
        useState<Ingredient[]>([]);
    
    useEffect(() => {
    const loadData = async () => {
        try {
        const categoriesData =
            await getCategories();

        const ingredientsData =
                await getIngredients();
            

        setCategories(categoriesData);
        setAvailableIngredients(
            ingredientsData
        );
        } catch (error) {
        toast.error(
        "Failed to load categories and ingredients"
    );
        }
    };

    loadData();
    }, []);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={addRecipeSchema}
            onSubmit={async (values, { setSubmitting }) => {
                try {
                    if (ingredients.length === 0) {
                        toast.error("Please add at least one ingredient");
                        return;
                    }
                    const formData = buildRecipeFormData(
                        values,
                        ingredients,
                        imageFile
                    );

                    const recipe = await createRecipe(formData);

                    

                    toast.success(
                        "Recipe created successfully!"
                    );

                    setTimeout(() => {
                        router.push(
                            `/recipe/${recipe._id}`
                        );
                    }, 1500);

                } catch (error) {
                    

                    toast.error(
                        "Failed to create recipe"
                    );
                } finally {
                    setSubmitting(false);
                }
            }} >
            {({ isSubmitting }) => (
                <Form className={styles.form}>
                    <div className={styles.topSection}>
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
                            <img src="/photo.svg" alt="Camera Icon" />
                                    </div>
                                )}
                            </label>
                        </div>
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

                                        {categories.map((category) => (
                                            <option
                                                key={category._id}
                                                value={category.name}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </Field>

                                    <ErrorMessage
                                        name="category"
                                        component="span"
                                        className={styles.error}
                                    />
                                </div>
                            </div>
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
                                    <option value="">
                                        Select ingredient
                                    </option>

                                    {availableIngredients.map(
                                        (ingredient) => (
                                            <option
                                                key={ingredient._id}
                                                value={ingredient._id}
                                            >
                                                {ingredient.name}
                                            </option>
                                        )
                                    )}
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
                                    onChange={(e) => setMeasure(e.target.value)}
                                />
                                {measureError && (
                                    <span className={styles.error}>
                                        {measureError}
                                    </span>
                                )}
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
                                       <img src="/delete.svg" alt="✕" />
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Publishing..."
                            : "Publish Recipe"}
                    </button>
                </Form>
            )}
        </Formik>
    );
    }
