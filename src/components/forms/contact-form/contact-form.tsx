import { useCallback, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./contact-form.module.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Spinner from "../../common/spinner";
import InputField from "../../common/input-field";
import TextAreaField from "../../common/text-area-field";

export type FormInputs = {
  name?: string;
  email?: string | null;
  phone?: string | null;
  message: string;
};

const schema = yup.object().shape({
  name: yup.string().optional(),
  email: yup
    .string()
    .email("Invalid email address")
    .nullable()
    .test(
      "email-or-phone",
      "Either email or phone is required",
      function (value) {
        const { phone } = this.parent as FormInputs;
        return !!value || !!phone;
      }
    ),
  phone: yup
    .string()
    .nullable()
    .test(
      "phone-or-email",
      "Either email or phone is required",
      function (value) {
        const { email } = this.parent as FormInputs;
        return !!value || !!email;
      }
    )
    .test("is-valid-phone", "Invalid phone number", function (value) {
      if (!value) {
        return true;
      }
      return /^\+?[0-9]{10,14}$/.test(value);
    }),
  message: yup.string().required("Message is required"),
});

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormInputs> = useCallback(
    async (data) => {
      setIsSubmitting(true);
      setSubmitResult(null);

      try {
        await new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            if (data.email === "neexistujici@email.cz") {
              reject(new Error("Neexistující emailová adresa"));
            } else {
              resolve();
            }
          }, 3000);
        });
        setSubmitResult("Form submitted successfully");
        reset();
      } catch (error) {
        if (error instanceof Error) {
          setSubmitResult(error.message);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [reset]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${styles.form} ${isSubmitting ? styles.disabledOverlay : ""}`}
      aria-live="assertive"
    >
      <InputField
        name="name"
        label="Name"
        register={register}
        error={errors.name}
      />
      <InputField
        name="email"
        label="Email"
        type="email"
        register={register}
        error={errors.email}
      />
      <InputField
        name="phone"
        label="Phone"
        type="tel"
        register={register}
        error={errors.phone}
      />
      <TextAreaField
        name="message"
        label="Message"
        register={register}
        error={errors.message}
      />
      {errors.root && <div className={styles.error}>{errors.root.message}</div>}
      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
      {isSubmitting && <Spinner />}
      {submitResult && (
        <div className={styles.submitResult}>{submitResult}</div>
      )}
    </form>
  );
};

export default ContactForm;
