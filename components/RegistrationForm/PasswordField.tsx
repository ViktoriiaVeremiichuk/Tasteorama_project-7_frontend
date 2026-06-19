"use client";

import { useState } from "react";
import { Field, FieldProps, useFormikContext } from "formik";
import css from "./RegistrationForm.module.css";
import EyeCrossedMob from "@/public/eye-crossed-mob.svg";
import EyeCrossedTab from "@/public/eye-crossed-tab.svg";
import EyeCrossedDesktop from "@/public/eye-crossed.svg";
import EyeMob from "@/public/eye-mob.svg";
import EyeTab from "@/public/eye-tab.svg";
import EyeDesktop from "@/public/eye.svg";

interface Props {
  name: string;
  id?: string;
  placeholder?: string;
}

export default function PasswordField({ name, id, placeholder }: Props) {
  const [show, setShow] = useState(false);
  const { submitCount } = useFormikContext();

  return (
    <div className={css.passwordWrapper}>
      <Field name={name}>
        {({ field, meta }: FieldProps) => (
          <input
            {...field}
            id={id}
            placeholder={placeholder}
            type={show ? "text" : "password"}
            className={`${css.input} ${meta.error && (meta.touched || submitCount > 0) ? css.inputError : ""}`}
          />
        )}
      </Field>
      <button
        type="button"
        className={css.toggleBtn}
        onClick={() => setShow((prev) => !prev)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <>
            <img src={EyeMob.src} className={css.iconMob} alt="EyeMob" />
            <img src={EyeTab.src} className={css.iconTab} alt="EyeTab" />
            <img src={EyeDesktop.src} className={css.iconDesktop} alt="EyeDesktop" />
          </>
        ) : (
          <>
            <img src={EyeCrossedMob.src} className={css.iconMob} alt="EyeCrossedMob" />
            <img src={EyeCrossedTab.src} className={css.iconTab} alt="EyeCrossedTab" />
            <img src={EyeCrossedDesktop.src} className={css.iconDesktop} alt="EyeCrossedDesktop" />
          </>
        )}
      </button>
    </div>
  );
}
