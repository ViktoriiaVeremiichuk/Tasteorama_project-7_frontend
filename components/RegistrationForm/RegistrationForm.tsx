"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from './RegistrationForm.module.css'
import PasswordField from "./PasswordField";

const validationSchema = Yup.object({
  name: Yup.string().min(2).max(50).required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")])
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
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <h1 className={css.title}>Register</h1>
          <p className={css.description}>Join our community of culinary enthusiasts, save your favorite recipes, and share your cooking creations</p>

          <div className={css.fields}>
            <div className={css.formGroup}>
              <label className={css.label}>Enter your name</label>
              <Field id="name" name="name" className={css.input} />
            </div>

            <div className={css.formGroup}>
              <label className={css.label}>Enter your email address</label>
              <Field id="email" name="email" type="email" className={css.input} />
            </div>

            <div className={css.formGroup}>
              <label className={css.label}>Create a strong password</label>
              <PasswordField name="password" />
            </div>

            <div className={css.formGroup}>
              <label className={css.label}>Repeat your password</label>
              <PasswordField name="confirmPassword" />
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