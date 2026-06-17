'use client';

import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useId } from "react";
import css from './Filters.module.css';
import { getCategories, getIngredients } from '@/lib/api/api';
  
interface OrderFormValues {
  category: string[];
  ingredients: string[];
}

const initialValues: OrderFormValues = {
  category: [],
  ingredients: [],
};

const validationSchema = Yup.object().shape({
  category: Yup.array().of(Yup.string()),
  ingredients: Yup.array().of(Yup.string()),
});

export default function Filters() {
  const fieldId = useId();

  const categories = getCategories();
  const ingredients = getIngredients();

  // const [recipes, setRecipes] = useState('hello');
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [isOpenIngredients, setIsOpenIngredients] = useState(false);
  const [selectedValue, setSelectedValue] = useState('Оберіть опцію');

  const optionsCategory = ['Опція 1', 'Опція 2', 'Опція 3'];
  const optionsIngredients = ['Опція 1', 'Опція 2', 'Опція 3'];

  const handleSelectCategory = (option: string) => {
    setSelectedValue(option);
    setIsOpenCategory(false); // Закриваємо список після вибору
  };

  const handleSelectIngredients = (option: string) => {
    setSelectedValue(option);
    setIsOpenIngredients(false); // Закриваємо список після вибору
  };

  // useEffect(() => {
  //   console.log(`Make HTTP request with: ${recipes}`);
  // }, [recipes]);

  const handleSubmit = (
    values: OrderFormValues,
    actions: FormikHelpers<OrderFormValues>
  ) => {
    console.log(values);
    actions.resetForm();
  };

  return (
    <div className={css.mainContainer}>
      <h2 className={css.title}>Recipes</h2>
      <div className={css.filterContainer}>
        <p className={css.dropdownSearch}>{ } recipes</p>
        <div className={css.dropdownBtn}>
          <button
            className={css.open}
            type="button">
            Filters           
          </button>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.68117 5.625L17.3188 5.62501C18.1092 5.62501 18.75 6.26576 18.75 7.05617C18.75 7.42149 18.6103 7.77298 18.3595 8.03863L13.5577 13.125L13.5577 17.5336C13.5577 18.2705 12.7878 18.7543 12.1239 18.4346L11.0085 17.8976C10.6624 17.731 10.4423 17.3808 10.4423 16.9966L10.4423 13.125L5.64049 8.03863C5.3897 7.77298 5.25 7.42149 5.25 7.05617C5.25 6.26576 5.89076 5.625 6.68117 5.625Z" stroke="black" stroke-width="0.5" />
          </svg>
        </div>
        <div className={css.dropdown}>
          <button
            type="button"
            className={css.resetButton}
          >
            Reset filters
          </button>
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            <Form className={css.form}>
              <Field className={css.field} as="select" name="category" id={fieldId}>
                <option className={css.option} value="">
                  Category
                </option>
                {categories.map((category) => (
                  <option className={css.option} key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Field>
              <Field className={css.field} as="select" name="ingredient" id={fieldId}>
                <option className={css.option} value="">
                  Ingredients
                </option>
                {ingredients.map((ingredient) => (
                  <option className={css.option} key={ingredient} value={ingredient}>
                    {ingredient}
                  </option>
                ))}
              </Field>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}