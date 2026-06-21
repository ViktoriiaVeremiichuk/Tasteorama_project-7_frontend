"use client";
import PasswordField from "../RegistrationForm/PasswordField";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./LoginForm.module.css"

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
});

const inicialValue = {
    email:"",
    password: ""
};

export default function SignInForm () {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser)

    const handleSubmit = async(values: typeof inicialValue) => {
        try {
            const user = await login({
                email: values.email,
                password: values.password,
            });
            setUser(user);
            toast.success("Login successful!")
            router.push('/')
        }catch(err) {
            if(isAxiosError(err)){
                const message = err.response?.data?.message ?? "Login failed";
                toast.error(message)
            } else {
                toast.error("Login failed");
            }
        }
    }

      return (
        <div className={css.wrapper}>
    <Formik
      initialValues={inicialValue}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, submitCount }) => (
        <Form className={css.form}>
          <h1 className={css.title}>Login</h1>
        <div className={css.fields}>
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
                  autoComplete="email"
                  placeholder="email@gmail.com"
                  className={`${css.input} ${meta.error && (meta.touched || submitCount > 0) ? css.inputError : ""}`}
                />
              )}
            </Field>
              <ErrorMessage name="email" component="p" className={css.error} />
          </div>

          <div
            className={`${css.formGroup} ${(touched.password || submitCount > 0) && errors.password ? css.formGroupError : ""}`}
          >
            <label htmlFor="password" className={css.label}>Enter your password</label>
            <PasswordField
              name="password"
              id="password"
              autoComplete="current-password"
            />
              <ErrorMessage name="password" component="p" className={css.error} />
          </div>

          <button type="submit" className={css.button} disabled={isSubmitting}>
            {isSubmitting ? "Loading..." : "Sign in"}
          </button>
        </div>
        <p className={`${css.description} ${css.text}`}>Don’t have an account? <Link href="/register"  className={css.link}>Register</Link></p>
        </Form>
      )}
    </Formik>
    </div>
  );
}
