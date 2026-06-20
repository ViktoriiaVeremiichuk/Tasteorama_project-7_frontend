'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useSearchStore } from "@/app/store/searchStore";
import css from './Filters.module.css';
import { getCategories, getIngredients } from '@/lib/api/api';

type Ingredient = {
  _id: string;
  name: string;
};

type Category = {
  _id: string;
  name: string;
};

const FiltersSchema = Yup.object({
  category: Yup.string(),
  ingredients: Yup.string(),
});

export default function Filters() {
  const {
    search,
    category,
    ingredients,
    totalRecipes,
    setAllFilters,
    resetFilters,
  } = useSearchStore();
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [ingredientsList, setIngredientsList] = useState<
    Ingredient[]
  >([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const categoriesResponse = await getCategories();
        const ingredientsResponse = await getIngredients();

        setCategoriesList(
          Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []
        );

        setIngredientsList(
          Array.isArray(ingredientsResponse.data) ? ingredientsResponse.data : []
        );
      } catch (error) {
        console.error("Failed to fetch dynamic filter options from Tasteorama API:", error);
      }
    }

    fetchFilterOptions();
  }, []);

  const hasActiveFilters = Boolean(search || category || ingredients);


  return (
    <Formik
      initialValues={{
        category,
        ingredients,
      }}
      enableReinitialize
      validationSchema={FiltersSchema}
      onSubmit={(values) => {
        setAllFilters({
          search,
          category: values.category,
          ingredients: values.ingredients,
        });
      }}
    >
      {({ values, handleChange, resetForm }) => (
        <Form>
          <div className={css.mainContainer}>
            <h2 className={css.title}>Recipes</h2>

            <div className={css.filterContainer}>
              <p className={css.dropdownSearch}>
                {totalRecipes} recipes
              </p>

              <div className={css.dropdownBtn}>
                <button
                  className={css.open}
                  type="button"
                >
                  Filters
                </button>

                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.68117 5.625L17.3188..."
                    stroke="black"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>

              <div className={css.dropdown}>
                {hasActiveFilters && (
                  <button
                    type="button"
                    className={css.resetButton}
                    onClick={() => {
                      resetForm();
                      resetFilters();
                    }}
                  >
                    Reset filters
                  </button>
                )}

                <Field
                  as="select"
                  name="category"
                  value={values.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    handleChange(e);

                    setAllFilters({
                      search,
                      category: e.target.value,
                      ingredients: values.ingredients,
                    });
                  }}
                  className={css.select}
                >
                  <option value="">Categories</option>

                  {categoriesList.map((cat) => (
                    <option
                      key={cat._id}
                      value={cat.name}
                    >
                      {cat.name}
                    </option>
                  ))}
                </Field>

                <Field
                  as="select"
                  name="ingredients"
                  value={values.ingredients}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    handleChange(e);

                    setAllFilters({
                      search,
                      category: values.category,
                      ingredients: e.target.value,
                    });
                  }}
                  className={css.select}
                >
                  <option value="">Ingredients</option>

                  {ingredientsList.map((ing) => (
                    <option
                      key={ing._id}
                      value={ing._id}
                    >
                      {ing.name}
                    </option>
                  ))}
                </Field>
              </div>

            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}