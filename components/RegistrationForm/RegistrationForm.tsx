"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
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
    .oneOf([Yup.ref("password")],"Passwords must match")
    .required(),
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
      {({ isSubmitting, errors, touched, submitCount }) => (
        <Form className={css.form}>
          <h1 className={css.title}>Register</h1>
          <p className={css.description}>Join our community of culinary enthusiasts, save your favorite recipes, and share your cooking creations</p>

          <div className={css.fields}>
            <div
              className={`${css.formGroup} ${(touched.name || submitCount > 0) && errors.name ? css.formGroupError : ""}`}
            >
              <label htmlFor="name" className={css.label}>Enter your name</label>
              <Field name="name">
                {({ field, meta }: FieldProps) => (
                  <input
                    {...field}
                    id="name"
                    className={`${css.input} ${meta.error && (meta.touched || submitCount > 0) ? css.inputError : ""}`}
                  />
                )}
              </Field>
                <ErrorMessage name="name" component="p" className={css.error} />
            </div>

            <div
              className={`${css.formGroup} ${(touched.email || submitCount > 0) && errors.email ? css.formGroupError : ""}`}
            >
              <label htmlFor="email" className={css.label}>Enter your email address</label>
              <Field name="email">
                {({ field, meta }: FieldProps) => (
                  <input
                    {...field}
                    id="email"
                    type="email"
                    className={`${css.input} ${meta.error && (meta.touched || submitCount > 0) ? css.inputError : ""}`}
                  />
                )}
              </Field>
                <ErrorMessage name="email" component="p" className={css.error} />
            </div>

            <div
              className={`${css.formGroup} ${(touched.password || submitCount > 0) && errors.password ? css.formGroupError : ""}`}
            >
              <label htmlFor="password" className={css.label}>Create a strong password</label>
              <PasswordField name="password" id="password" />
                <ErrorMessage name="password" component="p" className={css.error} />
            </div>

            <div
              className={`${css.formGroup} ${(touched.confirmPassword || submitCount > 0) && errors.confirmPassword ? css.formGroupError : ""}`}
            >
              <label htmlFor="confirmPassword" className={css.label}>Repeat your password</label>
              <PasswordField name="confirmPassword" id="confirmPassword" />
                <ErrorMessage name="confirmPassword" component="p" className={css.error} />
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
