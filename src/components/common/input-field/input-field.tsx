import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import styles from "./input-field.module.css";
import { FormInputs } from "../../forms/contact-form/contact-form";

type InputFieldProps = {
  name: keyof FormInputs;
  label: string;
  register: UseFormRegister<FormInputs>;
  error?: FieldError;
  type?: string;
  required?: boolean;
};

const InputField: React.FC<InputFieldProps> = React.memo(
  (props: InputFieldProps) => {
    const {
      name,
      label,
      register,
      error,
      type = "text",
      required = false,
    } = props;

    return (
      <div className={styles.formGroup}>
        <label htmlFor={name}>{label}:</label>
        <input
          id={name}
          type={type}
          {...register(name, {
            required: required ? `${label} is required` : false,
          })}
          aria-invalid={error ? "true" : "false"}
        />
        {error && (
          <span className={styles.error} role="alert">
            {error.message}
          </span>
        )}
      </div>
    );
  }
);

export default InputField;
