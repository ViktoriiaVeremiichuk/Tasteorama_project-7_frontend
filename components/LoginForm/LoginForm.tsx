"use client";
import PasswordField from "../RegistrationForm/PasswordField";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import { isAxiosError } from "axios";
import toast from "react-hot-toast";
import { login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./LoginForm.module.css"

const validationSchema = Yup.object({
    email: Yup.string()
    .email('invalid email format')
    .required('Email is required'),
    password: Yup.string()
    .min(8, "Minimum 8 character")
    .required('Password is required')
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
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <h1 className={css.title}>Login</h1>
        <div className={css.fields}>
          <div className={css.formGroup}>
            <label htmlFor="email" className={css.label}>Enter your email address</label>
            <Field id="email" name="email" type="email" placeholder="email@gmail.com" className={css.input} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="password" className={css.label}>Create a strong password</label>
            <PasswordField  name="password"/>
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