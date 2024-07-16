import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import styles from "./text-area-field.module.css";
import { FormInputs } from "../../forms/contact-form/contact-form";

type TextAreaFieldProps = {
  name: keyof FormInputs;
  label: string;
  register: UseFormRegister<FormInputs>;
  error?: FieldError;
  required?: boolean;
};

const TextAreaField: React.FC<TextAreaFieldProps> = React.memo(
  (props: TextAreaFieldProps) => {
    const { name, label, register, error, required = false } = props;

    return (
      <div className={styles.formGroup}>
        <label htmlFor={name}>{label}:</label>
        <textarea
          id={name}
          {...register(name, {
            required: required ? `${label} is required` : false,
          })}
          aria-invalid={error ? "true" : "false"}
        ></textarea>
        {error && (
          <span className={styles.error} role="alert">
            {error.message}
          </span>
        )}
      </div>
    );
  }
);

export default TextAreaField;
