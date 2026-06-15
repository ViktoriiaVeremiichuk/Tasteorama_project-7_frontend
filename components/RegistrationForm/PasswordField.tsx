"use client";

import { useState } from "react";
import { Field } from "formik";
import css from "./RegistrationForm.module.css";

const EYE_ICONS = {
  mob: "/eye-mob.svg",
  tab: "/eye-tab.svg",
  desktop: "/eye.svg",
} as const;

const EYE_CROSSED_ICONS = {
  mob: "/eye-crossed-mob.svg",
  tab: "/eye-crossed-tab.svg",
  desktop: "/eye-crossed.svg",
} as const;

interface Props {
  name: string;
  placeholder?: string;
  autoComplete?: "current-password" | "new-password";
}

export default function PasswordField({
  name,
  placeholder,
  autoComplete = "current-password",
}: Props) {
  const [show, setShow] = useState(false);
  const icons = show ? EYE_ICONS : EYE_CROSSED_ICONS;

  return (
    <div className={css.passwordWrapper}>
      <Field
        id={name}
        name={name}
        placeholder={placeholder}
        type={show ? "text" : "password"}
        className={css.input}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className={css.toggleBtn}
        onClick={() => setShow((prev) => !prev)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        <img src={icons.mob} className={css.iconMob} alt="" />
        <img src={icons.tab} className={css.iconTab} alt="" />
        <img src={icons.desktop} className={css.iconDesktop} alt="" />
      </button>
    </div>
  );
}
