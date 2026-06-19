"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from './RegistrationForm.module.css'
import PasswordField from "./PasswordField";

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(16, "Name must be at most 16 characters")
    .required("Name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .max(128, "Password must be at most 128 characters")
    .matches(/^\S+$/, "Password must not contain spaces")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Password confirmation is required"),
});

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignUpForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const user = await register({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      setUser(user);
      toast.success("Registration successful!");
      router.push("/");
    } catch (err) {
      if (isAxiosError(err)) {
        const message = err.response?.data?.message ?? "Registration failed";
        toast.error(message);
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
    <div className={css.wrapper}>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <h1 className={css.title}>Register</h1>
          <p className={css.description}>Join our community of culinary enthusiasts, save your favorite recipes, and share your cooking creations</p>

          <div className={css.fields}>
            <div className={css.formGroup}>
              <label htmlFor="name" className={css.label}>Enter your name</label>
              <Field id="name" name="name" className={css.input} />
              <span className={css.errorSlot}>
                <ErrorMessage name="name" component="p" className={css.error} />
              </span>
            </div>

            <div className={css.formGroup}>
              <label htmlFor="email" className={css.label}>Enter your email address</label>
              <Field id="email" name="email" type="email" className={css.input} />
              <span className={css.errorSlot}>
                <ErrorMessage name="email" component="p" className={css.error} />
              </span>
            </div>

            <div className={css.formGroup}>
              <label className={css.label}>Create a strong password</label>
              <PasswordField name="password" />
              <span className={css.errorSlot}>
                <ErrorMessage name="password" component="p" className={css.error} />
              </span>
            </div>

            <div className={css.formGroup}>
              <label className={css.label}>Repeat your password</label>
              <PasswordField name="confirmPassword" />
              <span className={css.errorSlot}>
                <ErrorMessage name="confirmPassword" component="p" className={css.error} />
              </span>
            </div>
          
            <button type="submit" className={css.button} disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Create account"}
            </button>
          </div>
          <p className={`${css.description} ${css.text}`}>Already have an account? <Link href="/login" className={css.link}>Log in</Link></p>
        </Form>
      )}
    </Formik>
    </div>
  );
}