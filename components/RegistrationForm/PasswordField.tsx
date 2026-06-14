// PasswordField.tsx
"use client";

import { useState } from "react";
import { Field } from "formik";
import { Eye, EyeOff } from "lucide-react";
import css from "./RegistrationForm.module.css";

interface Props {
  name: string;
  placeholder?:string,
}

export default function PasswordField({  name, placeholder }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className={css.passwordWrapper}>
      <Field
        name={name}
        placeholder={placeholder}
        type={show ? "text" : "password"}
        className={css.input}
      />
      <button
        type="button"
        className={css.toggleBtn}
        onClick={() => setShow((prev) => !prev)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}