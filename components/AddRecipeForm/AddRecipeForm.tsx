"use client";

import {
    useState,
    useEffect,
    useRef,
    ChangeEvent
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./AddRecipeForm.module.css";
import { Formik, Form, Field, ErrorMessage, type FieldProps } from "formik";
import { toast } from "react-hot-toast";
import axios from "axios";
import { addRecipeSchema, FIELD_LIMITS } from "./validation";
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
  key: string;
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

const blockNegativeNumberKey = (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  if (event.key === "-" || event.key === "+" || event.key === "e" || event.key === "E") {
    event.preventDefault();
  }
};

const sanitizePositiveIntegerInput = (value: string) =>
  value.replace(/\D/g, "");

const sanitizeAmountInput = (value: string) => value.replace(/-/g, "");

const CharCount = ({
  current,
  max,
}: {
  current: number;
  max: number;
}) => (
  <span className={styles.charCount} aria-live="polite">
    {current}/{max}
  </span>
);

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

    const fileInputRef = useRef<HTMLInputElement>(null);

    const removePhoto = () => {
        setImageFile(null);
        setPreview("");

        if (fileInputRef.current) {
        fileInputRef.current.value = "";
     }
    };

    const [ingredients, setIngredients] = useState<IngredientItem[]>([]);

    const [selectedIngredient, setSelectedIngredient] = useState("");

    const [measure, setMeasure] = useState("");

    const [measureError, setMeasureError] = useState("");
    const [ingredientsError, setIngredientsError] = useState("");

    const handleAddIngredient = () => {
        if (!selectedIngredient) {
            toast.error("Please select an ingredient");
            return;
        }

        if (!measure.trim()) {
            setMeasureError("Please enter the amount");
            return;
        }

        if (measure.length < 2 || measure.length > 10) {
            setMeasureError(
            "Amount must be between 2 and 10 characters"
            );

            return;
        }

        if (!/^\d/.test(measure)) {
            setMeasureError(
            "Amount must start with at least one digit"
            );

            return;
        }

        setMeasureError("");

        const ingredient = availableIngredients.find(
            (item) => item._id === selectedIngredient
        );

        if (!ingredient) return;

        const isDuplicate = ingredients.some(
            (item) => item.id === ingredient._id
        );

        if (isDuplicate) {
            toast.error("This ingredient has already been added");
            return;
        }

        const newIngredient = {
            key: crypto.randomUUID(),
            id: ingredient._id,
            name: ingredient.name,
            measure,
        };

        setIngredients((prev) => {
            const next = [...prev, newIngredient];

            if (next.length >= 2) {
                setIngredientsError("");
            }

            return next;
        });

        setSelectedIngredient("");
        setMeasure("");
    };
    
    const handleRemoveIngredient = (key: string) => {
        setIngredients((prev) =>
            prev.filter((item) => item.key !== key)
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
        } catch {
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
            onSubmit={async (values, { setSubmitting, validateForm, setTouched }) => {
                const formErrors = await validateForm();

                if (Object.keys(formErrors).length > 0) {
                    void setTouched(
                        Object.keys(formErrors).reduce<Record<string, boolean>>(
                            (acc, field) => {
                                acc[field] = true;
                                return acc;
                            },
                            {},
                        ),
                    );

                    const firstError = Object.values(formErrors)[0];

                    if (typeof firstError === "string") {
                        toast.error(firstError);
                    }

                    setSubmitting(false);
                    return;
                }

                if (ingredients.length < 2) {
                    const message =
                        "Add at least 2 ingredients to publish the recipe";
                    setIngredientsError(message);
                    toast.error(message);
                    setSubmitting(false);
                    return;
                }

                setIngredientsError("");

                try {
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
                            `/recipes/${recipe._id}`
                        );
                    }, 1500);

                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const payload = error.response?.data as {
                            message?: string;
                            response?: { message?: string };
                        } | undefined;
                        const message =
                            payload?.response?.message ??
                            payload?.message ??
                            "Failed to create recipe";

                        toast.error(message);
                    } else {
                        toast.error("Failed to create recipe");
                    }
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
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className={styles.hiddenInput}
                                    onChange={handleImageChange}
                                />

                                {preview ? (
                                    <Image
                                        src={preview}
                                        alt="Recipe preview"
                                        width={337}
                                        height={230}
                                        unoptimized
                                        className={styles.previewImage}
                                    />
                                ) : (
                                    <div className={styles.cameraIcon}>
                            <Image
                                src="/photo.svg"
                                alt=""
                                width={24}
                                height={24}
                                aria-hidden
                            />
                                    </div>
                                )}
                            </label>
                             {preview && (
                                <button
                                type="button"
                                onClick={removePhoto}
                                className={styles.removePhotoButton}
                                >
                                Remove photo
                                </button>
                            )}
                        </div>
                        <div className={styles.leftColumn}>
                            <h2 className={styles.sectionTitle}>
                                General Information
                            </h2>

                            <div className={styles.fieldGroup}>
                                <label htmlFor="title">
                                    Recipe Title
                                </label>

                                <Field name="title">
                                    {({ field }: FieldProps) => (
                                        <>
                                            <input
                                                {...field}
                                                id="title"
                                                type="text"
                                                maxLength={FIELD_LIMITS.title}
                                                placeholder="Enter the name of your recipe"
                                            />
                                            <CharCount
                                                current={field.value.length}
                                                max={FIELD_LIMITS.title}
                                            />
                                        </>
                                    )}
                                </Field>

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

                                <Field name="description">
                                    {({ field }: FieldProps) => (
                                        <>
                                            <textarea
                                                {...field}
                                                id="description"
                                                rows={4}
                                                maxLength={FIELD_LIMITS.description}
                                                placeholder="Enter a brief description of your recipe"
                                            />
                                            <CharCount
                                                current={field.value.length}
                                                max={FIELD_LIMITS.description}
                                            />
                                        </>
                                    )}
                                </Field>

                                <ErrorMessage
                                    name="description"
                                    component="span"
                                    className={styles.error}
                                />
                            </div>

                           
                                <div className={styles.fieldGroup}>
                                    <label htmlFor="time">
                                        Cooking time in minutes
                                    </label>

                                    <Field name="time">
                                        {({ field, form }: FieldProps) => (
                                            <input
                                                {...field}
                                                id="time"
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                placeholder="10"
                                                onKeyDown={blockNegativeNumberKey}
                                                onChange={(event) => {
                                                    form.setFieldValue(
                                                        "time",
                                                        sanitizePositiveIntegerInput(
                                                            event.target.value
                                                        )
                                                    );
                                                }}
                                            />
                                        )}
                                    </Field>

                                    <ErrorMessage
                                        name="time"
                                        component="span"
                                        className={styles.error}
                                    />
                                </div>
                    <div className={styles.row}>
                                <div className={styles.fieldGroup}>
                                    <label htmlFor="calories">
                                        Calories
                                    </label>

                                    <Field name="calories">
                                        {({ field, form }: FieldProps) => (
                                            <input
                                                {...field}
                                                id="calories"
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                placeholder="150"
                                                onKeyDown={blockNegativeNumberKey}
                                                onChange={(event) => {
                                                    form.setFieldValue(
                                                        "calories",
                                                        sanitizePositiveIntegerInput(
                                                            event.target.value
                                                        )
                                                    );
                                                }}
                                            />
                                        )}
                                    </Field>

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
                                    onKeyDown={(event) => {
                                        if (event.key === "-") {
                                            event.preventDefault();
                                        }
                                    }}
                                    onChange={(event) => {
                                        setMeasure(
                                            sanitizeAmountInput(event.target.value)
                                        );
                                    }}
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
                            <div className={`${styles.ingredientsHeader} ${
                                    ingredients.length > 0
                                        ? styles.showHeader
                                        : ""
                                }`}>
                                <span>Name:</span>
                                <span>Amount:</span>
                            </div>

                            {ingredients.map((ingredient) => (
                                <div
                                    key={ingredient.key}
                                    className={styles.ingredientItem}
                                >
                                    <span>{ingredient.name}</span>

                                    <span>{ingredient.measure}</span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveIngredient(ingredient.key)
                                        }
                                        aria-label={`Remove ${ingredient.name}`}
                                    >
                                       <Image
                                           src="/delete.svg"
                                           alt=""
                                           width={24}
                                           height={24}
                                           aria-hidden
                                       />
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

                        <div className={styles.fieldGroup}>
                        <Field name="instructions">
                            {({ field }: FieldProps) => (
                                <>
                                    <textarea
                                        {...field}
                                        rows={6}
                                        maxLength={FIELD_LIMITS.instructions}
                                        placeholder="Enter a text"
                                        className={styles.instructionsTextarea}
                                    />
                                    <CharCount
                                        current={field.value.length}
                                        max={FIELD_LIMITS.instructions}
                                    />
                                </>
                            )}
                        </Field>

                        <ErrorMessage
                            name="instructions"
                            component="span"
                            className={styles.error}
                        />
                        </div>
                    </section>

                     {(ingredients.length < 2 || ingredientsError) && (
                        <p className={styles.ingredientsWarning}>
                            {ingredientsError ||
                                "Add at least 2 ingredients to publish the recipe."}
                        </p>
                    )}

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
