"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearch: (value: string) => void;
  initialValue?: string;
}

const SearchSchema = Yup.object({
  search: Yup.string()
    .trim()
    .min(3, "Please enter at least 3 characters.")
    .required("Please enter a recipe name."),
});

export default function SearchBox({
  onSearch,
  initialValue = "",
}: SearchBoxProps) {
  return (
    <Formik
      initialValues={{
        search: initialValue,
      }}
      validationSchema={SearchSchema}
      onSubmit={(values) => {
        onSearch(values.search.trim());
      }}
    >
      <Form className={styles.container}>
        <div className={styles.fieldGroup}>
          <Field
            className={styles.input}
            name="search"
            placeholder="Search recipes"
          />

          <ErrorMessage
            name="search"
            component="p"
            className={styles.error}
          />
        </div>

        <button
          className={styles.button}
          type="submit"
        >
          Search
        </button>
      </Form>
    </Formik>
  );
}